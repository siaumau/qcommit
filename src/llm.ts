import * as https from 'https';
import * as vscode from 'vscode';

export interface LLMOptions {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  diff: string;
  outputChannel?: vscode.OutputChannel;
}

export async function generateCommitMessage(options: LLMOptions): Promise<string> {
  const { apiBaseUrl, apiKey, model, diff, outputChannel } = options;

  const prompt = `You are a commit message generator. Given a git diff, generate a concise, meaningful commit message following the Conventional Commits format.

Rules:
- Format: <type>(<scope>): <subject>
- Types: feat, fix, docs, style, refactor, test, chore, perf
- Subject should be in lowercase, imperative mood, no period at the end
- Keep subject under 72 characters
- Only respond with the commit message, no explanation

Git diff:
${diff}

Generate the commit message:`;

  const requestBody = JSON.stringify({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return new Promise((resolve, reject) => {
    const url = new URL(apiBaseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'VS Code Commit Helper',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const trimmedData = data.trim();
        try {
          if (!trimmedData.startsWith('{')) {
            const preview = data.substring(0, 200);
            const msg = `HTTP ${res.statusCode}: Response is not JSON. First 200 chars:\n${preview}`;
            if (outputChannel) {
              outputChannel.appendLine(msg);
            }
            reject(new Error(msg));
            return;
          }

          const response = JSON.parse(trimmedData);

          // Log full response for debugging
          const logMsg = `API Response (${trimmedData.length} bytes):\n${JSON.stringify(response, null, 2)}`;
          if (outputChannel) {
            outputChannel.appendLine(logMsg);
          }
          console.log(logMsg);

          if (response.error) {
            reject(new Error(`API error: ${response.error.message}`));
            return;
          }

          // Try different possible response structures
          let message: string | undefined;

          // Standard OpenAI format
          if (response.choices?.[0]?.message?.content) {
            message = response.choices[0].message.content.trim();
          }
          // Alternative format (just text in choice)
          else if (response.choices?.[0]?.text) {
            message = response.choices[0].text.trim();
          }
          // Check if choices exists at all
          else if (!response.choices) {
            reject(new Error(`No choices in response: ${JSON.stringify(response)}`));
            return;
          }

          if (!message) {
            reject(new Error(`No message found in choices[0]. Structure: ${JSON.stringify(response.choices?.[0])}`));
            return;
          }
          resolve(message);
        } catch (error) {
          const errorMsg = `Parse error: ${error instanceof Error ? error.message : String(error)}\nResponse length: ${trimmedData.length}\nFirst 1000 chars:\n${trimmedData.substring(0, 1000)}`;
          if (outputChannel) {
            outputChannel.appendLine(errorMsg);
          }
          console.error(errorMsg);
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

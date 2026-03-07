"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommitMessage = generateCommitMessage;
const https = __importStar(require("https"));
async function generateCommitMessage(options) {
    const { apiBaseUrl, apiKey, model, diff, language = 'zh-CN', outputChannel } = options;
    let prompt;
    if (language === 'en' || language === 'en-US') {
        prompt = `You are a commit message generator. Given a git diff, generate a concise, meaningful commit message following the Conventional Commits format.

Rules:
- Format: <type>(<scope>): <subject>
- Types: feat, fix, docs, style, refactor, test, chore, perf
- Subject should be in lowercase, imperative mood, no period at the end
- Keep subject under 72 characters
- Only respond with the commit message, no explanation

Git diff:
${diff}

Generate the commit message:`;
    }
    else if (language === 'zh-TW') {
        prompt = `你是一個提交訊息生成器。根據git diff生成簡潔有意義的提交訊息，遵循Conventional Commits格式。

規則：
- 格式：<type>(<scope>): <subject>
- 類型：feat(新功能), fix(修復), docs(文件), style(風格), refactor(重構), test(測試), chore(雜務), perf(效能)
- 描述必須使用繁體中文，採用祈使語態，末尾無句號
- 標題長度不超過72字符
- 只回覆提交訊息，不包含解釋
- 重要：所有回覆必須是繁體中文，不要用英文

Git diff：
${diff}

生成提交訊息（繁體中文）：`;
    }
    else {
        // Chinese (Default: Simplified Chinese / 默认：简体中文)
        prompt = `你是一个提交消息生成器。根据git diff生成简洁有意义的提交消息，遵循Conventional Commits格式。

规则：
- 格式：<type>(<scope>): <subject>
- 类型：feat(新功能), fix(修复), docs(文档), style(风格), refactor(重构), test(测试), chore(杂务), perf(性能)
- 描述必须使用简体中文，采用祈使语态，末尾无句号
- 标题长度不超过72字符
- 只回复提交消息，不包含解释
- 重要：所有回复必须是简体中文，不要用英文

Git diff：
${diff}

生成提交消息（简体中文）：`;
    }
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
                    let message;
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
                }
                catch (error) {
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

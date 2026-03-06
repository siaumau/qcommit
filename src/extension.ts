import * as vscode from 'vscode';
import { Config } from './config';
import { getStagedDiff } from './git';
import { generateCommitMessage } from './llm';

let config: Config;

export function activate(context: vscode.ExtensionContext) {
  console.log('=== Commit Message Helper activating ===');

  config = new Config(context);
  const outputChannel = vscode.window.createOutputChannel(
    'Commit Message Helper'
  );

  // Command: Set API Key
  const setApiKeyCmd = vscode.commands.registerCommand(
    'commitMessageHelper.setApiKey',
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your OpenRouter API key',
        password: true,
        ignoreFocusOut: true,
      });

      if (apiKey) {
        await config.setApiKey(apiKey);
        vscode.window.showInformationMessage(
          'API key saved successfully!'
        );
        outputChannel.appendLine(`[${new Date().toISOString()}] API key saved`);
      }
    }
  );

  // Command: Generate Commit Message
  const generateCmd = vscode.commands.registerCommand(
    'commitMessageHelper.generateMessage',
    async () => {
      console.log('Generate commit message command triggered');
      outputChannel.appendLine(
        `[${new Date().toISOString()}] Command triggered`
      );

      try {
        // Check if API key is set
        const apiKey = await config.getApiKey();
        if (!apiKey) {
          const action = await vscode.window.showErrorMessage(
            'API key not set. Please configure it first.',
            'Set API Key'
          );
          if (action === 'Set API Key') {
            vscode.commands.executeCommand('commitMessageHelper.setApiKey');
          }
          return;
        }

        // Get staged diff
        const diff = await getStagedDiff();
        if (!diff) {
          vscode.window.showWarningMessage(
            'No staged changes found. Please stage some files first.'
          );
          outputChannel.appendLine('No staged changes found');
          return;
        }

        outputChannel.appendLine(`Staged diff length: ${diff.length}`);

        // Show progress
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Generating commit message...',
            cancellable: false,
          },
          async () => {
            // Generate commit message
            const message = await generateCommitMessage({
              apiBaseUrl: config.getApiBaseUrl(),
              apiKey,
              model: config.getModel(),
              language: config.getLanguage(),
              diff,
              outputChannel,
            });

            outputChannel.appendLine(`Generated message: ${message}`);

            // Get git extension and fill in the message
            const gitExtension =
              vscode.extensions.getExtension('vscode.git')?.exports;
            if (!gitExtension) {
              vscode.window.showErrorMessage('Git extension not found');
              return;
            }

            const git = gitExtension.getAPI(1);
            if (!git.repositories || git.repositories.length === 0) {
              vscode.window.showErrorMessage('No git repository found');
              return;
            }

            const repo = git.repositories[0];
            repo.inputBox.value = message;

            vscode.window.showInformationMessage(
              'Commit message generated and filled!'
            );
            outputChannel.appendLine(
              `[${new Date().toISOString()}] Message filled successfully`
            );
          }
        );
      } catch (error) {
        console.error('Error:', error);
        const message =
          error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed: ${message}`);
        outputChannel.appendLine(`[ERROR] ${message}`);
      }
    }
  );

  context.subscriptions.push(setApiKeyCmd, generateCmd);
  console.log('=== Commit Message Helper activated successfully ===');
}

export function deactivate() {}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Commit Message Helper is now active!');

  let disposable = vscode.commands.registerCommand(
    'commitMessageHelper.generateMessage',
    async () => {
      vscode.window.showInformationMessage('OK');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

import { execSync } from 'child_process';
import * as vscode from 'vscode';

export async function getStagedDiff(): Promise<string | null> {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }

    const cwd = workspaceFolder.uri.fsPath;
    const diff = execSync('git diff --cached', {
      cwd,
      encoding: 'utf8',
    });

    return diff.trim() || null;
  } catch (error) {
    console.error('Failed to get staged diff:', error);
    return null;
  }
}

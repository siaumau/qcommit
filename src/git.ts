import { execSync } from 'child_process';
import * as vscode from 'vscode';

export async function getStagedDiff(mode: string = 'staged'): Promise<string | null> {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }

    const cwd = workspaceFolder.uri.fsPath;
    let diffCommand: string;

    let diff = '';

    switch (mode) {
      case 'unstaged':
        // Only unstaged changes
        diff = execSync('git diff', {
          cwd,
          encoding: 'utf8',
        });
        break;
      case 'all': {
        // All changes (staged + unstaged + untracked)
        const stagedDiff = execSync('git diff --cached', {
          cwd,
          encoding: 'utf8',
        });
        const unstagedDiff = execSync('git diff', {
          cwd,
          encoding: 'utf8',
        });
        // Include untracked files
        const untrackedFiles = execSync(
          "git ls-files --others --exclude-standard",
          {
            cwd,
            encoding: 'utf8',
          }
        );
        diff = stagedDiff + unstagedDiff;
        if (untrackedFiles.trim()) {
          diff += '\n\n=== Untracked Files ===\n' + untrackedFiles;
        }
        break;
      }
      case 'staged':
      default:
        // Only staged changes
        diff = execSync('git diff --cached', {
          cwd,
          encoding: 'utf8',
        });
    }

    return diff.trim() || null;
  } catch (error) {
    console.error(`Failed to get ${mode} diff:`, error);
    return null;
  }
}

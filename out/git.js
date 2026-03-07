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
exports.getStagedDiff = getStagedDiff;
const child_process_1 = require("child_process");
const vscode = __importStar(require("vscode"));
async function getStagedDiff(mode = 'staged') {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return null;
        }
        const cwd = workspaceFolder.uri.fsPath;
        let diffCommand;
        let diff = '';
        switch (mode) {
            case 'unstaged':
                // Only unstaged changes
                diff = (0, child_process_1.execSync)('git diff', {
                    cwd,
                    encoding: 'utf8',
                });
                break;
            case 'all': {
                // All changes (staged + unstaged + untracked)
                const stagedDiff = (0, child_process_1.execSync)('git diff --cached', {
                    cwd,
                    encoding: 'utf8',
                });
                const unstagedDiff = (0, child_process_1.execSync)('git diff', {
                    cwd,
                    encoding: 'utf8',
                });
                // Include untracked files
                const untrackedFiles = (0, child_process_1.execSync)("git ls-files --others --exclude-standard", {
                    cwd,
                    encoding: 'utf8',
                });
                diff = stagedDiff + unstagedDiff;
                if (untrackedFiles.trim()) {
                    diff += '\n\n=== Untracked Files ===\n' + untrackedFiles;
                }
                break;
            }
            case 'staged':
            default:
                // Only staged changes
                diff = (0, child_process_1.execSync)('git diff --cached', {
                    cwd,
                    encoding: 'utf8',
                });
        }
        return diff.trim() || null;
    }
    catch (error) {
        console.error(`Failed to get ${mode} diff:`, error);
        return null;
    }
}

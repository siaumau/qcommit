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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const config_1 = require("./config");
const git_1 = require("./git");
const llm_1 = require("./llm");
let config;
class CommitMessageSidebarProvider {
    constructor(context, outputChannel) {
        this.context = context;
        this.outputChannel = outputChannel;
    }
    async resolveWebviewView(webviewView) {
        webviewView.webview.options = {
            enableScripts: true,
        };
        webviewView.webview.html = await this.getHtml(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'saveSettings':
                    await this.saveSettings(message.payload);
                    webviewView.webview.html = await this.getHtml(webviewView.webview);
                    break;
                case 'generateMessage':
                    await vscode.commands.executeCommand('commitMessageHelper.generateMessage');
                    break;
            }
        });
    }
    async saveSettings(payload) {
        if (payload.clearApiKey) {
            await config.deleteApiKey();
        }
        else if (payload.apiKey?.trim()) {
            await config.setApiKey(payload.apiKey.trim());
        }
        if (payload.apiBaseUrl?.trim()) {
            await config.updateSetting('apiBaseUrl', payload.apiBaseUrl.trim());
        }
        if (payload.model?.trim()) {
            await config.updateSetting('model', payload.model.trim());
        }
        if (payload.language?.trim()) {
            await config.updateSetting('language', payload.language.trim());
        }
        if (payload.diffMode?.trim()) {
            await config.updateSetting('diffMode', payload.diffMode.trim());
        }
        this.outputChannel.appendLine(`[${new Date().toISOString()}] Sidebar settings updated`);
        vscode.window.showInformationMessage('QCommit settings saved.');
    }
    async getHtml(webview) {
        const nonce = getNonce();
        const hasApiKey = await config.hasApiKey();
        const apiKeyStatus = hasApiKey ? 'Saved' : 'Not set';
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QCommit Settings</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    body {
      padding: 16px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
    }
    .wrap {
      display: grid;
      gap: 14px;
    }
    .card {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 10px;
      padding: 14px;
      background: color-mix(in srgb, var(--vscode-sideBar-background) 82%, var(--vscode-editor-background));
    }
    h1, h2, p {
      margin: 0;
    }
    h1 {
      font-size: 18px;
      font-weight: 700;
    }
    h2 {
      font-size: 13px;
      margin-bottom: 10px;
    }
    .muted {
      color: var(--vscode-descriptionForeground);
      font-size: 12px;
      line-height: 1.5;
    }
    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
      margin-bottom: 10px;
    }
    input, select, button {
      font: inherit;
    }
    input, select {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--vscode-input-border, transparent);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-radius: 6px;
      padding: 8px 10px;
    }
    .actions {
      display: grid;
      gap: 8px;
      margin-top: 8px;
    }
    button {
      border: 0;
      border-radius: 6px;
      padding: 9px 12px;
      cursor: pointer;
    }
    .primary {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .status {
      display: inline-block;
      margin-top: 8px;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>QCommit</h1>
      <p class="muted">放在左側欄的設定面板，可直接管理 API 與產生 commit message。</p>
    </div>

    <div class="card">
      <h2>Connection</h2>
      <label>
        API Key
        <input id="apiKey" type="password" placeholder="Leave blank to keep current key">
      </label>
      <label>
        API Base URL
        <input id="apiBaseUrl" type="text" value="${escapeHtml(config.getApiBaseUrl())}">
      </label>
      <label>
        Model
        <input id="model" type="text" value="${escapeHtml(config.getModel())}">
      </label>
      <span class="status">API key status: ${apiKeyStatus}</span>
    </div>

    <div class="card">
      <h2>Behavior</h2>
      <label>
        Language
        <select id="language">
          ${renderOption('zh-CN', config.getLanguage(), 'zh-CN')}
          ${renderOption('zh-TW', config.getLanguage(), 'zh-TW')}
          ${renderOption('en', config.getLanguage(), 'en')}
          ${renderOption('en-US', config.getLanguage(), 'en-US')}
        </select>
      </label>
      <label>
        Diff Mode
        <select id="diffMode">
          ${renderOption('staged', config.getDiffMode(), 'staged')}
          ${renderOption('unstaged', config.getDiffMode(), 'unstaged')}
          ${renderOption('all', config.getDiffMode(), 'all')}
        </select>
      </label>
      <div class="actions">
        <button class="primary" id="saveBtn">Save Settings</button>
        <button class="secondary" id="generateBtn">Generate Commit Message</button>
        <button class="secondary" id="clearKeyBtn">Clear API Key</button>
      </div>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    document.getElementById('saveBtn').addEventListener('click', () => {
      vscode.postMessage({
        type: 'saveSettings',
        payload: {
          apiKey: document.getElementById('apiKey').value,
          apiBaseUrl: document.getElementById('apiBaseUrl').value,
          model: document.getElementById('model').value,
          language: document.getElementById('language').value,
          diffMode: document.getElementById('diffMode').value
        }
      });
    });

    document.getElementById('generateBtn').addEventListener('click', () => {
      vscode.postMessage({ type: 'generateMessage' });
    });

    document.getElementById('clearKeyBtn').addEventListener('click', () => {
      vscode.postMessage({
        type: 'saveSettings',
        payload: {
          apiBaseUrl: document.getElementById('apiBaseUrl').value,
          model: document.getElementById('model').value,
          language: document.getElementById('language').value,
          diffMode: document.getElementById('diffMode').value,
          clearApiKey: true
        }
      });
    });
  </script>
</body>
</html>`;
    }
}
CommitMessageSidebarProvider.viewType = 'commitMessageHelper.sidebar';
function activate(context) {
    console.log('=== Commit Message Helper activating ===');
    config = new config_1.Config(context);
    const outputChannel = vscode.window.createOutputChannel('Commit Message Helper');
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.name = 'QCommit Progress';
    // Command: Set API Key
    const setApiKeyCmd = vscode.commands.registerCommand('commitMessageHelper.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your OpenRouter API key',
            password: true,
            ignoreFocusOut: true,
        });
        if (apiKey) {
            await config.setApiKey(apiKey);
            vscode.window.showInformationMessage('API key saved successfully!');
            outputChannel.appendLine(`[${new Date().toISOString()}] API key saved`);
        }
    });
    // Command: Generate Commit Message
    const generateCmd = vscode.commands.registerCommand('commitMessageHelper.generateMessage', async () => {
        console.log('Generate commit message command triggered');
        outputChannel.appendLine(`[${new Date().toISOString()}] Command triggered`);
        try {
            showGeneratingStatus(statusBarItem);
            // Check if API key is set
            const apiKey = await config.getApiKey();
            if (!apiKey) {
                const action = await vscode.window.showErrorMessage('API key not set. Please configure it first.', 'Set API Key');
                if (action === 'Set API Key') {
                    vscode.commands.executeCommand('commitMessageHelper.setApiKey');
                }
                return;
            }
            // Get diff based on configured mode
            const diffMode = config.getDiffMode();
            const diff = await (0, git_1.getStagedDiff)(diffMode);
            if (!diff) {
                const modeLabel = diffMode === 'all' ? 'changes' : `${diffMode} changes`;
                vscode.window.showWarningMessage(`No ${modeLabel} found. Please make some changes or stage files first.`);
                outputChannel.appendLine(`No ${modeLabel} found`);
                return;
            }
            outputChannel.appendLine(`Staged diff length: ${diff.length}`);
            // Get git extension early for animation
            const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
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
            // Start loading animation
            let isGenerating = true;
            startLoadingAnimation(repo, () => isGenerating);
            const message = await (0, llm_1.generateCommitMessage)({
                apiBaseUrl: config.getApiBaseUrl(),
                apiKey,
                model: config.getModel(),
                language: config.getLanguage(),
                diff,
                outputChannel,
            });
            // Stop animation
            isGenerating = false;
            outputChannel.appendLine(`Generated message: ${message}`);
            repo.inputBox.value = message;
            showSuccessStatus(statusBarItem);
            vscode.window.showInformationMessage('Commit message generated and filled!');
            outputChannel.appendLine(`[${new Date().toISOString()}] Message filled successfully`);
        }
        catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : String(error);
            showErrorStatus(statusBarItem);
            vscode.window.showErrorMessage(`Failed: ${message}`);
            outputChannel.appendLine(`[ERROR] ${message}`);
        }
        finally {
            clearStatus(statusBarItem);
        }
    });
    const generateTitleCmd = vscode.commands.registerCommand('commitMessageHelper.generateMessageTitle', async () => {
        await vscode.commands.executeCommand('commitMessageHelper.generateMessage');
    });
    const sidebarProvider = new CommitMessageSidebarProvider(context, outputChannel);
    const sidebarRegistration = vscode.window.registerWebviewViewProvider(CommitMessageSidebarProvider.viewType, sidebarProvider);
    context.subscriptions.push(setApiKeyCmd, generateCmd, generateTitleCmd, sidebarRegistration, statusBarItem);
    console.log('=== Commit Message Helper activated successfully ===');
}
function deactivate() { }
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function renderOption(value, current, label) {
    const selected = value === current ? 'selected' : '';
    return `<option value="${value}" ${selected}>${label}</option>`;
}
function getNonce() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function showGeneratingStatus(statusBarItem) {
    statusBarItem.text = '$(sync~spin) QCommit: Generating commit message...';
    statusBarItem.tooltip = 'QCommit is generating a commit message';
    statusBarItem.show();
}
function showSuccessStatus(statusBarItem) {
    statusBarItem.text = '$(check) QCommit: Commit message ready';
    statusBarItem.tooltip = 'Commit message generated successfully';
    statusBarItem.show();
}
function showErrorStatus(statusBarItem) {
    statusBarItem.text = '$(error) QCommit: Generation failed';
    statusBarItem.tooltip = 'Commit message generation failed';
    statusBarItem.show();
}
function clearStatus(statusBarItem) {
    setTimeout(() => {
        statusBarItem.hide();
    }, 2500);
}
function startLoadingAnimation(repo, isGenerating) {
    const loadingText = '處理中---';
    let charIndex = 0;
    const animateFrame = () => {
        if (!isGenerating()) {
            return;
        }
        // Show characters up to current index
        repo.inputBox.value = loadingText.substring(0, charIndex + 1);
        // Move to next character
        charIndex += 1;
        // Loop back when reaching the end
        if (charIndex > loadingText.length) {
            charIndex = 0; // Clear and restart
            repo.inputBox.value = '';
        }
        // Continue animation
        setTimeout(animateFrame, 150);
    };
    animateFrame();
}

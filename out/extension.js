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
function activate(context) {
    console.log('=== Commit Message Helper activating ===');
    config = new config_1.Config(context);
    const outputChannel = vscode.window.createOutputChannel('Commit Message Helper');
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
            // Check if API key is set
            const apiKey = await config.getApiKey();
            if (!apiKey) {
                const action = await vscode.window.showErrorMessage('API key not set. Please configure it first.', 'Set API Key');
                if (action === 'Set API Key') {
                    vscode.commands.executeCommand('commitMessageHelper.setApiKey');
                }
                return;
            }
            // Get staged diff
            const diff = await (0, git_1.getStagedDiff)();
            if (!diff) {
                vscode.window.showWarningMessage('No staged changes found. Please stage some files first.');
                outputChannel.appendLine('No staged changes found');
                return;
            }
            outputChannel.appendLine(`Staged diff length: ${diff.length}`);
            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating commit message...',
                cancellable: false,
            }, async () => {
                // Generate commit message
                const message = await (0, llm_1.generateCommitMessage)({
                    apiBaseUrl: config.getApiBaseUrl(),
                    apiKey,
                    model: config.getModel(),
                    diff,
                    outputChannel,
                });
                outputChannel.appendLine(`Generated message: ${message}`);
                // Get git extension and fill in the message
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
                repo.inputBox.value = message;
                vscode.window.showInformationMessage('Commit message generated and filled!');
                outputChannel.appendLine(`[${new Date().toISOString()}] Message filled successfully`);
            });
        }
        catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Failed: ${message}`);
            outputChannel.appendLine(`[ERROR] ${message}`);
        }
    });
    context.subscriptions.push(setApiKeyCmd, generateCmd);
    console.log('=== Commit Message Helper activated successfully ===');
}
function deactivate() { }

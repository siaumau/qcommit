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
exports.Config = void 0;
const vscode = __importStar(require("vscode"));
class Config {
    constructor(context) {
        this.context = context;
    }
    async getApiKey() {
        return this.context.secrets.get('commitMessageHelper.apiKey');
    }
    async setApiKey(key) {
        await this.context.secrets.store('commitMessageHelper.apiKey', key);
    }
    async deleteApiKey() {
        await this.context.secrets.delete('commitMessageHelper.apiKey');
    }
    async updateSetting(key, value) {
        const config = vscode.workspace.getConfiguration('commitMessageHelper');
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
    getModel() {
        const config = vscode.workspace.getConfiguration('commitMessageHelper');
        return config.get('model') || 'openai/gpt-4o-mini';
    }
    getApiBaseUrl() {
        const config = vscode.workspace.getConfiguration('commitMessageHelper');
        return config.get('apiBaseUrl') || 'https://openrouter.ai/api/v1';
    }
    getLanguage() {
        const config = vscode.workspace.getConfiguration('commitMessageHelper');
        return config.get('language') || 'zh-CN';
    }
    getDiffMode() {
        const config = vscode.workspace.getConfiguration('commitMessageHelper');
        return config.get('diffMode') || 'staged';
    }
    hasApiKey() {
        return this.getApiKey().then((key) => Boolean(key));
    }
}
exports.Config = Config;

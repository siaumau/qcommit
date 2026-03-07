import * as vscode from 'vscode';

export class Config {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async getApiKey(): Promise<string | undefined> {
    return this.context.secrets.get('commitMessageHelper.apiKey');
  }

  async setApiKey(key: string): Promise<void> {
    await this.context.secrets.store('commitMessageHelper.apiKey', key);
  }

  async deleteApiKey(): Promise<void> {
    await this.context.secrets.delete('commitMessageHelper.apiKey');
  }

  getModel(): string {
    const config = vscode.workspace.getConfiguration('commitMessageHelper');
    return config.get<string>('model') || 'openai/gpt-4o-mini';
  }

  getApiBaseUrl(): string {
    const config = vscode.workspace.getConfiguration('commitMessageHelper');
    return config.get<string>('apiBaseUrl') || 'https://openrouter.ai/api/v1';
  }

  getLanguage(): string {
    const config = vscode.workspace.getConfiguration('commitMessageHelper');
    return config.get<string>('language') || 'zh-CN';
  }

  getDiffMode(): string {
    const config = vscode.workspace.getConfiguration('commitMessageHelper');
    return config.get<string>('diffMode') || 'staged';
  }
}

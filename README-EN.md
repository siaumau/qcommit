# Commit Message Helper

**Languages:** [中文](https://github.com/siaumau/qcommit/blob/main/README.md) | [English](#readme-en)

AI-powered VS Code extension for generating standardized Commit Messages in one click!

<a id="readme-en"></a>

## ✨ Features

- 🤖 Automatically generate Commit Messages based on code changes using AI
- 🌍 Multi-language support: Simplified Chinese, Traditional Chinese, English
- 📋 Follows Conventional Commits format
- ⚡ Support for multiple AI models (OpenAI, Anthropic, vLLM, etc.)
- 🔐 Secure API Key storage (using VS Code key management)

## 🚀 Getting Started

### 1. Install the Extension

Search for **Commit Message Helper** in VS Code Extension Marketplace or install via command line:

```bash
code --install-extension ericlifetw.commit-message-anyai2helper
```

### 2. Set Your API Key

1. Open Command Palette: `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. Search and run: **"Commit Message Helper: Set OpenRouter API Key"**
3. Enter your API Key (from OpenRouter, OpenAI, Anthropic, etc.)

### 3. Configure Model and Language (Optional)

See the **⚙️ Configuration** section below to set your preferred AI model and language.

### 4. Usage

#### Quick Generation (Recommended)
- **Keyboard Shortcut**: `Ctrl+Alt+G` (Mac: `Cmd+Option+G`)
- **Or** Click the **✨ icon** above the commit message box in Source Control panel
- **Or** Open Command Palette and search **"Generate Commit Message"**

#### Auto-fill
Generated Commit Messages are automatically filled into the commit input box—no copy-paste needed!

---

## ⚙️ Configuration

### How to Open Settings

**Method 1: VS Code Settings UI (Recommended)**
1. Press `Ctrl+,` (Mac: `Cmd+,`) to open Settings
2. Search for `commitMessageHelper`
3. Modify the relevant settings

**Method 2: Edit settings.json Manually**
1. Open Command Palette → Search **"Preferences: Open User Settings (JSON)"**
2. Add configuration items:

```json
{
  "commitMessageHelper.language": "en",
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini"
}
```

### Available Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commitMessageHelper.language` | string | `zh-CN` | Generate language: `zh-CN` (Simplified Chinese), `zh-TW` (Traditional Chinese), `en` (English) |
| `commitMessageHelper.apiBaseUrl` | string | `https://openrouter.ai/api/v1` | API endpoint (supports OpenRouter, OpenAI, Ollama, etc.) |
| `commitMessageHelper.model` | string | `openai/gpt-4o-mini` | AI model name to use |

### Configuration Examples

#### Using OpenRouter (Recommended)
```json
{
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini",
  "commitMessageHelper.language": "en"
}
```

#### Using OpenAI
```json
{
  "commitMessageHelper.apiBaseUrl": "https://api.openai.com/v1",
  "commitMessageHelper.model": "gpt-4o-mini",
  "commitMessageHelper.language": "en"
}
```

#### Using Local Ollama
```json
{
  "commitMessageHelper.apiBaseUrl": "http://localhost:11434/v1",
  "commitMessageHelper.model": "llama2",
  "commitMessageHelper.language": "en"
}
```

#### Using Anthropic Claude
```json
{
  "commitMessageHelper.apiBaseUrl": "https://api.anthropic.com/v1",
  "commitMessageHelper.model": "claude-opus",
  "commitMessageHelper.language": "en"
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl+Alt+G` | Generate Commit Message |
| `Ctrl+,` | Open VS Code Settings |
| `Ctrl+Shift+P` | Open Command Palette |

*Mac users: Replace `Ctrl` with `Cmd` and `Alt` with `Option`*

---

## 🔒 Security

- API Keys are stored using VS Code's secret management mechanism and **not saved in plain text config files**
- All API communications use HTTPS encryption
- We do not collect or store any generated Commit Messages

---

## 📚 Development

### Project Structure

```
src/
├── extension.ts    # VS Code commands and UI
├── config.ts       # Configuration management and secure API Key storage
├── git.ts          # Retrieves git staged diff
└── llm.ts          # AI API calls and message generation
```

### Local Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch for file changes
npm run watch

# Run tests
npm test
```

### Debugging

1. Open the project folder in VS Code
2. Press `F5` to launch the Debug Extension window
3. Test the extension in a new VS Code window

---

## 📝 License

MIT

---

## 💡 FAQ

**Q: How do I switch to a different AI model?**
A: Modify the `commitMessageHelper.model` setting in your configuration, or open Settings (`Ctrl+,`) and search for "model".

**Q: Which API services are supported?**
A: We support OpenRouter, OpenAI, Anthropic Claude, local Ollama, and any service compatible with the OpenAI API.

**Q: How do I change the language?**
A: Modify the `commitMessageHelper.language` setting. We support Simplified Chinese, Traditional Chinese, and English.

**Q: Where is my API Key stored?**
A: Your API Key is stored in VS Code's secure storage (Windows: Credential Manager, Mac: Keychain, Linux: gnome-keyring), which is safe and reliable.

**Q: What if I don't like the generated message?**
A: You can manually edit the message in the commit box, or click the generate button again to get a new suggestion.

**Q: Does this extension collect any data?**
A: No, all processing is done locally through API calls. We don't collect or store any commit messages.

---

## 🐛 Feedback & Support

If you have any issues or suggestions:
- Submit a GitHub Issue
- Leave a comment on the VS Code Marketplace
- Email the extension publisher

---

## 🎯 Roadmap

- [ ] Support for more languages
- [ ] Custom prompt templates
- [ ] Commit history analysis for better suggestions
- [ ] GitHub/GitLab integration
- [ ] Web UI for configuration

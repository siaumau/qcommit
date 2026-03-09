# Commit Message Helper

**Languages:** [中文](https://github.com/siaumau/qcommit/blob/main/README.md) | [English](#readme-en)

AI-powered VS Code extension that generates commit messages from your Git diff and fills them directly into the Source Control input box.

<a id="readme-en"></a>

## Features

- Generate commit messages from staged, unstaged, or all Git changes
- Supports Conventional Commits style
- Multi-language output: Traditional Chinese, Simplified Chinese, and English
- Works with OpenRouter, OpenAI, Anthropic, Ollama, and OpenAI-compatible APIs
- Stores API keys securely with VS Code Secret Storage
- Includes a new left Activity Bar entry with a sidebar settings panel
- Adds an `AI 提交` action button in the Source Control title area
- Shows generation progress in the VS Code status bar

## Installation

Search for **Commit Message Helper** in the VS Code Marketplace, or install it from the command line:

```bash
code --install-extension ericlifetw.commit-message-anyai2helper
```

## Quick Start

### 1. Set your API key

You can do this in two ways.

From the Command Palette:

1. Open `Ctrl+Shift+P`
2. Run **Commit Message Helper: Set OpenRouter API Key**

From the new `QCommit` sidebar:

1. Click the `QCommit` icon in the VS Code Activity Bar
2. Enter your API key in the `API Key` field
3. Click `Save Settings`

### 2. Configure model and language

You can manage settings from:

- VS Code Settings UI by searching `commitMessageHelper`
- `settings.json`
- The `QCommit` sidebar panel

### 3. Generate a commit message

Supported entry points:

- Keyboard shortcut: `Ctrl+Alt+G`
- The `AI 提交` button in the Source Control title area
- The action button in the Source Control view
- Command Palette: **Generate Commit Message**
- The `Generate Commit Message` button inside the `QCommit` sidebar

The generated text is automatically written into the Git commit input box.

### 4. Watch generation status

When generation starts, the VS Code status bar shows live progress states:

- `QCommit: Generating commit message...`
- `QCommit: Commit message ready`
- `QCommit: Generation failed`

This is more visible and persistent than a corner notification.

## Sidebar Panel

This release adds a VS Code-style left sidebar integration.

- A dedicated `QCommit` icon appears in the Activity Bar
- Clicking it opens a settings panel inside the sidebar
- You can edit `API Key`, `API Base URL`, `Model`, `Language`, and `Diff Mode`
- You can clear the saved API key
- You can trigger commit message generation directly from the panel

This makes frequent configuration changes much faster than editing `settings.json` manually.

## Source Control Integration

Besides the shortcut and sidebar, the extension now integrates more directly into the Source Control view.

- An `AI 提交` button appears in the Source Control title area
- Clicking it runs the same flow as `Ctrl+Alt+G`
- The generated result is automatically filled into the commit input box

## Configuration

### Available settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commitMessageHelper.language` | string | `zh-CN` | Output language: `zh-CN`, `zh-TW`, `en`, `en-US` |
| `commitMessageHelper.apiBaseUrl` | string | `https://openrouter.ai/api/v1` | API endpoint |
| `commitMessageHelper.model` | string | `openai/gpt-4o-mini` | Model name to use |
| `commitMessageHelper.diffMode` | string | `staged` | Diff scope: `staged`, `unstaged`, or `all` |

### Example `settings.json`

```json
{
  "commitMessageHelper.language": "en",
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini",
  "commitMessageHelper.diffMode": "staged"
}
```

### Other service examples

#### OpenAI

```json
{
  "commitMessageHelper.apiBaseUrl": "https://api.openai.com/v1",
  "commitMessageHelper.model": "gpt-4o-mini",
  "commitMessageHelper.language": "en",
  "commitMessageHelper.diffMode": "all"
}
```

#### Ollama

```json
{
  "commitMessageHelper.apiBaseUrl": "http://localhost:11434/v1",
  "commitMessageHelper.model": "llama2",
  "commitMessageHelper.language": "en",
  "commitMessageHelper.diffMode": "unstaged"
}
```

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl+Alt+G` | Generate commit message |
| `Ctrl+Shift+P` | Open Command Palette |
| `Ctrl+,` | Open VS Code Settings |

## Security

- API keys are stored in VS Code Secret Storage, not in plain text settings files
- API communication is handled by the endpoint you configure
- The extension does not persist generated commit messages on its own

## Development

### Project structure

```text
src/
  extension.ts    Commands, sidebar registration, and VS Code UI logic
  config.ts       Configuration access and Secret Storage helpers
  git.ts          Git diff collection
  llm.ts          AI API calls and commit message generation
media/
  activitybar.svg Activity Bar icon for the sidebar
```

### Local development

```bash
npm install
npm run compile
npm run watch
```

### Debugging

1. Open the project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Test both the Source Control action and the left `QCommit` sidebar

## FAQ

**Q: Do I have to use OpenRouter?**  
A: No. Any OpenAI-compatible endpoint can work, including OpenAI, Anthropic, and Ollama setups.

**Q: Where is the API key stored?**  
A: In VS Code Secret Storage, not in `settings.json`.

**Q: What can I do from the sidebar?**  
A: You can update API settings, change the model, language, and diff mode, clear the saved API key, and trigger message generation.

**Q: Is the `AI 提交` button different from the keyboard shortcut?**  
A: No. It triggers the same generation flow as `Ctrl+Alt+G`.

**Q: What if I do not like the generated message?**  
A: Edit it manually or generate another one.

## License

MIT

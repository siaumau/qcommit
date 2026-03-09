# Commit Message Helper

**Languages:** [中文](#readme-zh) | [English](https://github.com/siaumau/qcommit/blob/main/README-EN.md)

AI 驅動的 VS Code 擴充功能，可根據 Git 變更自動產生 Commit Message，並直接填入 Source Control 的輸入框。

<a id="readme-zh"></a>

## 功能特色

- 使用 AI 根據 staged、unstaged 或全部 diff 自動產生 Commit Message
- 支援 Conventional Commits 風格
- 支援多語言輸出：繁體中文、簡體中文、英文
- 支援 OpenRouter、OpenAI、Anthropic、Ollama 與相容 OpenAI API 的服務
- API Key 使用 VS Code Secret Storage 安全保存
- 新增左側 Activity Bar 入口，可直接在側欄調整設定並執行產生功能

## 安裝

在 VS Code Extension Marketplace 搜尋 **Commit Message Helper**，或使用指令安裝：

```bash
code --install-extension ericlifetw.commit-message-anyai2helper
```

## 快速開始

### 1. 設定 API Key

你可以用兩種方式設定：

1. 開啟命令面板：`Ctrl+Shift+P`
2. 執行 **Commit Message Helper: Set OpenRouter API Key**

或使用左側新的 `QCommit` 側欄：

1. 點擊左側 Activity Bar 的 `QCommit` 圖示
2. 在 `API Key` 欄位輸入金鑰
3. 按下 `Save Settings`

### 2. 調整模型與語言

可在以下位置調整：

- VS Code 設定頁搜尋 `commitMessageHelper`
- `settings.json`
- 左側 `QCommit` 側欄設定面板

### 3. 產生 Commit Message

可透過以下方式使用：

- 快捷鍵：`Ctrl+Alt+G`
- Source Control 面板上的產生按鈕
- 命令面板執行 **Generate Commit Message**
- `QCommit` 左側側欄內的 `Generate Commit Message` 按鈕

產生完成後，訊息會自動填入 Git commit 輸入框。

## 左側側欄功能

新版本加入了和 VS Code 左側工具列整合的設定面板：

- 在 Activity Bar 顯示 `QCommit` 圖示
- 點進去可直接修改 `API Key`、`API Base URL`、`Model`、`Language`、`Diff Mode`
- 可直接清除已儲存的 API Key
- 可直接從側欄執行 Commit Message 產生

這讓常用設定不必每次都進 `settings.json` 或命令面板。

## 設定說明

### 可用設定

| 設定鍵 | 型別 | 預設值 | 說明 |
|--------|------|--------|------|
| `commitMessageHelper.language` | string | `zh-CN` | 輸出語言，可用 `zh-CN`、`zh-TW`、`en`、`en-US` |
| `commitMessageHelper.apiBaseUrl` | string | `https://openrouter.ai/api/v1` | API 端點 |
| `commitMessageHelper.model` | string | `openai/gpt-4o-mini` | 使用的模型名稱 |
| `commitMessageHelper.diffMode` | string | `staged` | Diff 範圍，可用 `staged`、`unstaged`、`all` |

### `settings.json` 範例

```json
{
  "commitMessageHelper.language": "zh-TW",
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini",
  "commitMessageHelper.diffMode": "staged"
}
```

### 其他服務範例

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
  "commitMessageHelper.language": "zh-TW",
  "commitMessageHelper.diffMode": "unstaged"
}
```

## 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Ctrl+Alt+G` | 產生 Commit Message |
| `Ctrl+Shift+P` | 開啟命令面板 |
| `Ctrl+,` | 開啟 VS Code 設定 |

## 安全性

- API Key 儲存在 VS Code Secret Storage，不會直接寫進明文設定檔
- API 通訊由你設定的服務端點負責
- 擴充功能本身不會額外保存產生出的 Commit Message

## 開發

### 專案結構

```text
src/
  extension.ts    VS Code 指令、側欄與 UI 註冊
  config.ts       設定與 Secret Storage
  git.ts          取得 Git diff
  llm.ts          呼叫 AI API 產生訊息
media/
  activitybar.svg 左側 Activity Bar 圖示
```

### 本機開發

```bash
npm install
npm run compile
npm run watch
```

### 除錯

1. 用 VS Code 開啟專案
2. 按 `F5` 啟動 Extension Development Host
3. 在新視窗中測試 Source Control 與左側 `QCommit` 側欄

## FAQ

**Q: 一定要用 OpenRouter 嗎？**  
A: 不用，只要是相容 OpenAI API 的服務都可以，像 OpenAI、Anthropic、Ollama 都能設定。

**Q: API Key 放在哪裡？**  
A: 存在 VS Code 的安全儲存區，不會直接寫進 `settings.json`。

**Q: 左側側欄能做什麼？**  
A: 可以直接設定 API、模型、語言、diff mode，也可以直接按按鈕產生 Commit Message。

**Q: 如果 AI 產生的訊息不滿意怎麼辦？**  
A: 你可以手動修改，或再次執行產生功能取得另一個版本。

## License

MIT

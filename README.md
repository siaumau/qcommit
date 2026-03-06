# Commit Message Helper

**Languages:** [中文](#readme-zh) | [English](https://github.com/siaumau/qcommit/blob/main/README-EN.md)

AI 驱动的 VS Code 扩展，一键生成规范的 Commit Message！

<a id="readme-zh"></a>

## ✨ 功能

- 🤖 使用 AI 根据代码变更自动生成 Commit Message
- 🌍 支持多语言：简体中文、繁体中文、英文
- 📋 遵循 Conventional Commits 格式
- ⚡ 支持多种 AI 模型（OpenAI、Anthropic、vLLM 等）
- 🔐 安全存储 API Key（使用 VS Code 密钥管理）

## 🚀 快速开始

### 1. 安装扩展

从 VS Code 扩展市场搜索 **Commit Message Helper** 或在命令行安装：

```bash
code --install-extension ericlifetw.commit-message-anyai2helper
```

### 2. 设置 API Key

1. 打开命令面板：`Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
2. 搜索并运行：**"Commit Message Helper: Set OpenRouter API Key"**
3. 输入你的 API Key（例如 OpenRouter、OpenAI、Anthropic 等）

### 3. 配置模型和语言（可选）

看下面的 **⚙️ 配置** 部分，配置你想使用的 AI 模型和语言。

### 4. 使用

#### 快速生成（推荐）
- **快捷键**：`Ctrl+Alt+G` (Mac: `Cmd+Option+G`)
- **或** 点击 Source Control 面板提交框上的 **✨ 图标**
- **或** 打开命令面板搜索 **"Generate Commit Message"**

#### 自动填入
生成的 Commit Message 会自动填入提交框，无需复制粘贴

---

## ⚙️ 配置

### 打开设置

**方式 1：VS Code 设置 UI（推荐）**
1. 按 `Ctrl+,` (Mac: `Cmd+,`) 打开设置
2. 搜索 `commitMessageHelper`
3. 修改相关配置

**方式 2：手动编辑 settings.json**
1. 打开命令面板 → 搜索 **"Preferences: Open User Settings (JSON)"**
2. 添加配置项：

```json
{
  "commitMessageHelper.language": "zh-CN",
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini"
}
```

### 可用配置项

| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `commitMessageHelper.language` | string | `zh-CN` | 生成语言：`zh-CN`(简体中文)、`zh-TW`(繁体中文)、`en`(英文) |
| `commitMessageHelper.apiBaseUrl` | string | `https://openrouter.ai/api/v1` | API 服务地址（支持 OpenRouter、OpenAI、Ollama 等） |
| `commitMessageHelper.model` | string | `openai/gpt-4o-mini` | 使用的 AI 模型名称 |

### 配置示例

#### 使用 OpenRouter（推荐）
```json
{
  "commitMessageHelper.apiBaseUrl": "https://openrouter.ai/api/v1",
  "commitMessageHelper.model": "openai/gpt-4o-mini",
  "commitMessageHelper.language": "zh-CN"
}
```

#### 使用 OpenAI
```json
{
  "commitMessageHelper.apiBaseUrl": "https://api.openai.com/v1",
  "commitMessageHelper.model": "gpt-4o-mini",
  "commitMessageHelper.language": "en"
}
```

#### 使用本地 Ollama
```json
{
  "commitMessageHelper.apiBaseUrl": "http://localhost:11434/v1",
  "commitMessageHelper.model": "llama2",
  "commitMessageHelper.language": "zh-CN"
}
```

#### 繁体中文
```json
{
  "commitMessageHelper.language": "zh-TW"
}
```

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Alt+G` | 生成 Commit Message |
| `Ctrl+,` | 打开 VS Code 设置 |
| `Ctrl+Shift+P` | 打开命令面板 |

*Mac 用户请将 `Ctrl` 改为 `Cmd`，`Alt` 改为 `Option`*

---

## 🔒 安全说明

- API Key 使用 VS Code 的密钥管理机制存储，**不会保存在普通配置文件中**
- 所有 API 通信均使用 HTTPS 加密
- 不收集或存储任何生成的 Commit Message

---

## 📚 开发

### 项目结构

```
src/
├── extension.ts    # VS Code 命令和 UI
├── config.ts       # 配置管理和 API Key 安全存储
├── git.ts          # 获取 git staged diff
└── llm.ts          # AI API 调用和消息生成
```

### 本地开发

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监听文件变更
npm run watch

# 运行测试
npm test
```

### 调试

1. 打开项目文件夹到 VS Code
2. 按 `F5` 启动调试窗口
3. 在新的 VS Code 窗口中测试扩展

---

## 📝 License

MIT

---

## 💡 常见问题

**Q: 如何更换 AI 模型？**
A: 在设置中修改 `commitMessageHelper.model` 配置项，或打开命令面板搜索 Settings 并搜索 `model`。

**Q: 支持哪些 API 服务？**
A: 支持 OpenRouter、OpenAI、Anthropic Claude、本地 Ollama 等任何兼容 OpenAI API 的服务。

**Q: 如何切换语言？**
A: 在设置中修改 `commitMessageHelper.language`，支持简体中文、繁体中文、英文三种语言。

**Q: API Key 保存在哪里？**
A: API Key 保存在 VS Code 的密钥存储中（Windows: Credential Manager、Mac: Keychain、Linux: gnome-keyring），安全可靠。

**Q: 生成的消息不满意怎么办？**
A: 可以手动修改提交框中的消息，或重新点击生成按钮获取新的建议。

---

## 🐛 反馈和支持

如有问题或建议，请：
- 提交 GitHub Issue
- 在 VS Code 扩展市场留下评论
- 发送邮件至扩展发布者

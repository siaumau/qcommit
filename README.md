# Commit Message Helper

VS Code 扩展，在 Source Control 面板的提交信息框上方添加一个图标按钮。

## 快速开始

### 安装依赖
```bash
npm install
```

### 编译
```bash
npm run compile
```

### 测试扩展

1. 打开此项目文件夹到 VS Code
2. 按 `F5` 启动调试窗口（Debug Extension）
3. 在新的 VS Code 窗口中，打开一个有 git 仓库的文件夹
4. 切换到 **Source Control** 面板
5. 你会看到提交信息框上方有一个 **✨ 图标按钮**
6. 点击图标按钮后，会显示"OK"的通知消息

## 项目结构

```
.
├── src/
│   └── extension.ts          # 扩展主文件
├── package.json              # 扩展配置
├── tsconfig.json             # TypeScript 配置
└── README.md
```

## 功能说明

- **命令**: `commitMessageHelper.generateMessage`
- **位置**: SCM Input Box Action Button（提交信息框上方）
- **图标**: Sparkle (✨)
- **触发**: 点击图标按钮显示 "OK" 通知

## 下一步

这是 MVP 版本，用于测试图标位置。后续可以添加：
- 调用 AI API
- 生成实际的 commit message
- 填入提交框

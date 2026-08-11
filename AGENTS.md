# AGENTS.md – AltaCV React 项目 AI 协作指南

本项目将 AltaCV 从 LaTeX 迁移至 React，构建灵活易用的简历组件库。

## 项目设计文档

- 设计方向与愿景：[docs/design.md](docs/design.md)
- 组件设计规范：[docs/components.md](docs/components.md)
- 编写组件前，务必先查阅上述文档，确保不偏离设计方向。

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- pnpm 包管理器

## 关键约定

1. **组件原子化**：每个组件只负责单一功能，通过组合构建复杂布局。
2. **样式控制**：所有样式可通过 `className` 覆盖；使用 CSS Variables 定义主题。
3. **类型安全**：完整的 TypeScript 类型定义，Props 接口清晰明确。
4. **打印优化**：所有组件需考虑 `@media print` 场景。
5. **无内联样式**：优先使用 Tailwind 工具类，避免 `style={{}}` 内联样式。

## 目录结构

```
src/
├── components/
│   ├── elements/     # 原子组件（Typography, Divider, Icon 等）
│   └── layout/       # 布局组件（Section, Grid 等）
├── styles/
│   ├── base.css
│   ├── components.css
│   ├── media.css
│   └── themes/       # 主题 CSS（dark, blue, purple 等）
├── theme/
│   ├── ThemeProvider.tsx
│   └── useTheme.ts
└── App.tsx
```

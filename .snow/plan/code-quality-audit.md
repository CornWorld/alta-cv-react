# 代码质量改进与依赖升级

## Context

对 alta-cv-react 项目进行代码质量检查后，发现可清理项、可修复项和可升级的依赖。本计划分阶段执行：先清理无用文件/依赖，再修复代码质量问题，最后进行安全依赖升级。

## Analysis

- **Affected files**: package.json, src/theme/ThemeProvider.tsx, src/assets/react.svg（删除）
- **New files**: src/theme/useTheme.ts（拆分 hook）
- **Dependencies**: autoprefixer（删除）, postcss（删除）, react/react-dom（升级）, 等
- **Complexity**: 简单
- **Risk areas**: 依赖升级后需验证构建是否通过

## Phases

### Phase 1: 清理无用依赖与文件

- **Goal**: 移除未使用的依赖和文件，减小项目体积
- **Files**: package.json, src/assets/react.svg
- **Steps**:
  - [ ] 从 package.json 移除 `autoprefixer` 和 `postcss`
  - [ ] 删除 `src/assets/react.svg`
- **Done when**: package.json 更新，build 仍然通过

### Phase 2: 修复代码质量问题

- **Goal**: 修复 ESLint 警告，改善代码结构
- **Files**: src/theme/ThemeProvider.tsx（新建 src/theme/useTheme.ts）
- **Steps**:
  - [ ] 新建 `src/theme/useTheme.ts`，将 `useTheme` hook 移至独立文件
  - [ ] 更新 `ThemeProvider.tsx` 引用新的 hook 文件
  - [ ] 更新 `ThemeToggle.tsx` 引用新的 hook 路径
- **Done when**: lint 无警告，build 通过

### Phase 3: 安全依赖升级

- **Goal**: 将所有依赖升级到推荐版本（不含大版本破坏性变更）
- **Files**: package.json
- **Steps**:
  - [ ] 运行 pnpm up 升级以下依赖到 wanted 版本：
    - react@^19.2.8, react-dom@^19.2.8
    - react-icons@^5.7.0, @types/react@^19.2.17, @types/react-dom@^19.2.3
    - @tailwindcss/vite@^4.3.3, tailwindcss@^4.3.3
    - vite@^6.4.3
    - @vitejs/plugin-react@^4.7.0
    - @eslint/js@^9.39.5, eslint@^9.39.5
    - typescript-eslint@^8.65.0
    - eslint-plugin-react-refresh@^0.4.26
    - globals@^16.5.0（保持 v16，不升 v17）
  - [ ] 运行 pnpm install 更新 lockfile
- **Done when**: 所有依赖更新完毕，build 和 lint 通过

## Risks & Mitigations

| Risk                                         | Impact   | Mitigation                         |
| -------------------------------------------- | -------- | ---------------------------------- |
| eslint-plugin-react-hooks 5.2.0 版本落后锁定 | 无法升级 | Wanted 和 Current 一致，暂不处理   |
| 依赖升级后 lockfile 冲突                     | 构建失败 | 删除 pnpm-lock.yaml 后重新 install |

## Rollback Strategy

每阶段开始前备份 package.json，出现问题后 git checkout 恢复

## Completion Summary

**Status**: ✅ Completed

### Phase 1 — 清理无用依赖与文件 ✅

- 从 package.json 移除 `autoprefixer` 和 `postcss`
- 删除 `src/assets/react.svg`

### Phase 2 — 修复代码质量问题 ✅

- 新建 `src/theme/useTheme.ts`，包含 `ThemeContext`、`useTheme` hook 和 `ThemeName` 类型
- 更新 `ThemeProvider.tsx` 只导出组件，消除 `react-refresh/only-export-components` 警告
- 更新 `ThemeToggle.tsx` 引用新的 hook 路径
- Lint: 0 errors, 0 warnings

### Phase 3 — 安全依赖升级 ✅

14 个依赖升级到安全版本（详见上方表格）
Build passes, no regressions

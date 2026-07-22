# alta-cv-react

用 React、TypeScript 和 CSS 变量重写 AltaCV 简历排版体验的个人简历项目。当前版本以 `src/App.tsx` 为简历内容入口，提供一组接近 LaTeX AltaCV 语义的 React 组件，用于快速组合头像、联系方式、章节、经历、列表、标签和奖项。

## 特性

- React/TSX 直接描述简历结构，适合把简历当作可维护的前端页面管理。
- `Section`、`Event`、`List`、`Contact`、`Tag`、`Achievement` 等组件覆盖常见简历块。
- 主题由 CSS 变量驱动，`ThemeProvider` 会在根节点写入 `data-theme`。
- 支持深色主题样式文件，并保留 A4 构建/预览脚本。
- 基于 Vite 构建，可部署到 Cloudflare Pages 等静态托管平台。

## 技术栈

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- react-icons
- ESLint

## 快速开始

```bash
pnpm install
pnpm dev
```

A4 模式开发：

```bash
pnpm dev:a4
```

构建与预览：

```bash
pnpm build
pnpm preview
```

A4 模式构建与预览：

```bash
pnpm build:a4
pnpm preview:a4
```

部署到 Cloudflare Pages：

```bash
pnpm deploy
```

## 目录结构

```text
src/
  App.tsx                 # 当前简历内容入口
  App.css                 # 汇总基础样式、主题样式和组件样式
  components/
    elements/             # Event、List、Contact、Tag 等简历元素
    layout/               # Section 等布局组件
    ThemeToggle.tsx
  styles/
    base.css
    components.css
    media.css
    themes/
  theme/
    ThemeProvider.tsx
```

## 组件示例

当前简历内容直接写在 `src/App.tsx`。可以用组件表达简历语义，再把具体内容作为 props 或 children 传入：

```tsx
import Section from "./components/layout/Section";
import Event from "./components/elements/Event";
import List from "./components/elements/List";
import Contact from "./components/elements/Contact";
import ThemeProvider from "./theme/ThemeProvider";
import { FaEnvelope, FaGithub } from "react-icons/fa";

export default function App() {
  return (
    <ThemeProvider>
      <div className="cv-container">
        <Contact.Root>
          <Contact.Item icon={<FaEnvelope />} href="mailto:hello@example.com">
            hello@example.com
          </Contact.Item>
          <Contact.Item icon={<FaGithub />} href="https://github.com/example">
            example
          </Contact.Item>
        </Contact.Root>

        <Section title="项目经历">
          <Event
            title="alta-cv-react"
            organization="个人项目"
            date="2025 - 至今"
          >
            <List>
              <List.Item>用 React 组件复刻 AltaCV 的简历排版结构</List.Item>
              <List.Item>通过 CSS 变量维护主题、间距和打印样式</List.Item>
            </List>
          </Event>
        </Section>
      </div>
    </ThemeProvider>
  );
}
```

## 动态简历内容方案

现在的内容是静态 TSX：灵活、类型友好，也方便使用 React 组件。但如果希望把“简历内容部分”动态化，可以按可信程度和可编辑需求选择不同方案。

### 方案 A：JSON/Schema 驱动，推荐给不可信输入

把简历内容定义为 JSON，然后写一个渲染器把结构映射到现有组件：

```ts
const resume = {
  profile: {
    name: "CornWorld",
    title: "前端开发工程师",
  },
  sections: [
    {
      title: "项目经历",
      events: [
        {
          title: "alta-cv-react",
          organization: "个人项目",
          items: ["React 组件化简历", "CSS 变量主题"],
        },
      ],
    },
  ],
};
```

优点是安全、可校验、适合表单编辑和远程加载；缺点是表达能力弱一些，不能直接写任意 JSX。后续可以配合 Zod、Valibot 或 TypeScript 类型定义约束数据结构。

### 方案 B：MDX 或动态 import，推荐给可信的本地内容

如果简历内容由自己维护，想保留“像写代码一样写简历”的体验，可以把内容拆成 `resume.mdx` 或 `resume.tsx`，再通过 Vite 的动态 import 加载：

```tsx
import React from "react";

const Resume = React.lazy(() => import("./resume.tsx"));

export default function App() {
  return (
    <ThemeProvider>
      <React.Suspense fallback={null}>
        <Resume />
      </React.Suspense>
    </ThemeProvider>
  );
}
```

这不是运行时 `eval`，而是交给 Vite/TypeScript 在开发或构建阶段编译，保留 HMR、类型检查和依赖分析。它适合“本地可信简历内容动态切换”，比如多语言版本、多岗位版本或私有/公开版本。

### 方案 C：运行时 eval/TSX 编译，只适合完全可信内容

可以在浏览器里用 Babel Standalone、Sucrase 或 esbuild-wasm 把字符串形式的 TSX 编译成 JS，再用 `new Function` 执行并渲染。这能实现最接近“在线编辑 TSX 简历”的体验，但风险也最高。

不建议在主窗口直接执行来自用户、接口、数据库或分享链接的内容。原因包括：

- 简历代码可以访问 `window`、`document`、`localStorage` 和页面内 token。
- 可以发起网络请求、劫持点击、读取页面状态。
- React 组件不是安全沙箱，`dangerouslySetInnerHTML` 和 `eval` 都不能隔离权限。

如果确实需要运行时执行代码，建议至少使用 iframe 沙箱：

```html
<iframe sandbox="allow-scripts" />
```

主应用只通过 `postMessage` 发送简历源码或结构化数据，iframe 内部负责编译和渲染。不要给 iframe 加 `allow-same-origin`，除非你已经有独立域名隔离和严格 CSP。更稳妥的路线是把编译放到 Web Worker 或服务端，再把结果限制为可控的 JSON/HTML/组件白名单。

## 推荐路线

1. 只想维护自己的多份简历：使用 `resume.tsx` + 动态 import。
2. 想做在线编辑器或让别人填内容：使用 JSON/Schema 驱动渲染器。
3. 想在线编辑 TSX：使用 iframe/Web Worker 沙箱，并把它当作高风险能力设计权限边界。
4. 不要在主应用上下文中直接 `eval` 不可信简历内容。

## 开发检查

```bash
pnpm lint
pnpm build
```

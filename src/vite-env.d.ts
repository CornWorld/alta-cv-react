/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 是否启用 A4 屏幕模式（保留向后兼容） */
  readonly VITE_A4?: string;
  /** A4 页边距 CSS margin 简写（1/2/3/4 值），如 "12mm 8mm"、"12mm 8mm 10mm 6mm" */
  readonly VITE_A4_MARGIN?: string;
}

/**
 * 构建期由 vite.config.ts 注入的 CF Pages 部署信息。
 * - sharePath：for/<id> 分支的分享路径（如 /for/tencent-wxg），非 for 分支为 null
 * - isProduction：CF_PAGES_BRANCH === "main"（生产构建）
 */
declare const __CV_DEPLOY__: {
  sharePath: string | null;
  isProduction: boolean;
};

/// <reference types="vite/client" />

/**
 * 构建期由 vite.config.ts 注入的 CF Pages 部署信息。
 * - sharePath：for/<id> 分支的分享路径（如 /for/tencent-wxg），非 for 分支为 null
 * - isProduction：CF_PAGES_BRANCH === "main"（生产构建）
 */
declare const __CV_DEPLOY__: {
  sharePath: string | null;
  isProduction: boolean;
};

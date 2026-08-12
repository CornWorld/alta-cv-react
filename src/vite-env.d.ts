/// <reference types="vite/client" />

/**
 * 构建期由 vite.config.ts 注入的 CF Pages 部署信息。
 * - hash：从 CF_PAGES_URL 提取的部署随机 hash（preview 分支有值，生产也可能有但被忽略）
 * - isProduction：CF_PAGES_BRANCH === "main"（生产构建）
 */
declare const __CV_DEPLOY__: {
  hash: string;
  isProduction: boolean;
};

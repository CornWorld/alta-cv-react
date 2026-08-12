import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * 构建期检测 CF Pages 部署信息。
 *
 * 规律：每次部署（生产或 preview）Cloudflare 都分配唯一的
 * https://<hash>.cv-7mm.pages.dev；构建时 CF_PAGES_URL 恒为该部署地址、
 * CF_PAGES_BRANCH 为分支名（main=生产）。hash 与 commit SHA 无函数关系（CF 随机生成），
 * 不可从 git 推导，只能在构建期从 CF_PAGES_URL 提取。
 * 运行时不再解析浏览器 URL，直接使用构建期烙入的 __CV_DEPLOY__。
 */
function detectDeployInfo() {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env ?? {};

  const url = env.CF_PAGES_URL ?? "";
  const branch = env.CF_PAGES_BRANCH ?? "";
  // 与 functions/d/[hash]/[[path]].ts 的 HASH_RE 一致（6–32 位十六进制）
  const hash = url.match(
    /^https:\/\/([0-9a-f]{6,32})\.cv-7mm\.pages\.dev(?:\/|$)/i,
  )?.[1] ?? "";
  const isProduction = branch === "main";

  return { hash, isProduction };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  define: {
    __CV_DEPLOY__: JSON.stringify(detectDeployInfo()),
  },
});

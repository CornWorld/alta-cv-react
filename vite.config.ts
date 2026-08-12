import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * 构建期检测 CF Pages 部署信息。
 *
 * 分享链接来自分支名（构建期）：for/<id> 分支 → 分享路径 /for/<id>
 * （稳定、始终指向该分支最新构建）；main 生产无分享路径、直接访问 cv.corn.im。
 * 运行时不再解析浏览器 URL，直接使用构建期烙入的 __CV_DEPLOY__。
 */
function detectDeployInfo() {
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } })
      .process?.env ?? {};

  const branch = env.CF_PAGES_BRANCH ?? "";
  const isProduction = branch === "main";
  // for/<id> 分支 → 分享路径 /for/<id>；其它分支无分享链接
  const sharePath =
    branch.startsWith("for/") && branch.length > 4
      ? `/for/${branch.slice(4)}`
      : null;

  return { sharePath, isProduction };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  define: {
    __CV_DEPLOY__: JSON.stringify(detectDeployInfo()),
  },
});

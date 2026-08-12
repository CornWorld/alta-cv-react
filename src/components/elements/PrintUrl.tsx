/**
 * 打印右上角的「线上预览链接」。
 *
 * hash 的来源（构建期）：Cloudflare 每次部署随机分配唯一地址
 * https://<hash>.cv-7mm.pages.dev，构建时由 CF_PAGES_URL 提供、CF_PAGES_BRANCH 区分
 * 生产(main)/preview。vite.config.ts 在构建期把 { hash, isProduction } 烙入
 * __CV_DEPLOY__，本组件只读取该常量，不解析浏览器 URL。
 */
function getPrintUrl() {
  const { hash, isProduction } = __CV_DEPLOY__;

  // preview 分支：链接指向隐私代理的稳定地址
  if (hash && !isProduction) {
    return {
      text: `cv.corn.im/d/${hash}`,
      href: `https://cv.corn.im/d/${hash}`,
    };
  }

  // 生产（main 分支）
  if (isProduction) {
    return { text: "cv.corn.im", href: "https://cv.corn.im" };
  }

  // 本地开发（无 CF 构建期变量）：无线上链接，不显示
  return null;
}

export default function PrintUrl() {
  const info = getPrintUrl();
  if (!info) return null;

  return (
    <a className="cv-print-url" href={info.href} target="_blank" rel="noreferrer">
      {info.text}
    </a>
  );
}

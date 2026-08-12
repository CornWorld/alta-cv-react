/**
 * 打印右上角的「线上预览链接」。
 *
 * 分享链接来自分支名（构建期）：
 * - for/<id> 分支 → cv.corn.im/for/<id>（稳定、始终指向该分支最新构建）
 * - main 生产 → cv.corn.im
 * vite.config.ts 在构建期把 { sharePath, isProduction } 烙入 __CV_DEPLOY__，
 * 本组件只读取该常量，不解析浏览器 URL。
 */
function getPrintUrl() {
  const { sharePath, isProduction } = __CV_DEPLOY__;

  // for/<id> 分支：打印稳定的分享链接
  if (sharePath) {
    return {
      text: `cv.corn.im${sharePath}`,
      href: `https://cv.corn.im${sharePath}`,
    };
  }

  // 生产（main 分支）
  if (isProduction) {
    return { text: "cv.corn.im", href: "https://cv.corn.im" };
  }

  // 本地开发 / 其它分支：无线上链接，不显示
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

/**
 * 脚本化确定性 PDF 导出（headless Chromium，与 Chrome 手动打印同一引擎）。
 *
 * 用法：
 *   node scripts/export-pdf.mjs <url> [-o export/resume.pdf] [--max-pages N]
 *   pnpm export:pdf -- http://localhost:4173 -o export/resume.pdf --max-pages 2
 *
 * 确定性来源：
 *   - print 媒体仿真 + networkidle + document.fonts.ready（Google Fonts 远程字体必须等就绪）
 *   - 页边距从页面运行时读取（window.CV.a4Margin() → --a4-margin-* 同源），
 *     与注入的 @page { margin } 字面量一致，参数固化、不经打印对话框
 *   - 溢出守卫：实际产出 PDF 的页数 vs --max-pages，超页即退出码 1（量最终产物，零估算）
 */

import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const DEFAULT_URL = "http://localhost:4173/";
const DEFAULT_OUTPUT = "export/resume.pdf";
const DEFAULT_MARGIN = "12mm";

// ---------- CLI ----------
function parseArgs(argv) {
  const args = { url: DEFAULT_URL, output: DEFAULT_OUTPUT, maxPages: null };
  const rest = [...argv];
  const pos = [];
  while (rest.length > 0) {
    const a = rest.shift();
    if (a === "-o" || a === "--output") args.output = rest.shift();
    else if (a === "--max-pages") args.maxPages = Number(rest.shift());
    else if (a === "-h" || a === "--help") args.help = true;
    else pos.push(a);
  }
  if (pos.length > 0) args.url = pos[0];
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(
    "usage: node scripts/export-pdf.mjs [url] [-o out.pdf] [--max-pages N]",
  );
  process.exit(0);
}
if (!Number.isInteger(args.maxPages) || args.maxPages < 1) {
  if (process.argv.includes("--max-pages")) {
    console.error(`--max-pages 需要正整数，收到 "${args.maxPages}"`);
    process.exit(1);
  }
  args.maxPages = null;
}

// ---------- 定位 Chromium ----------
function findChromium() {
  const cacheRoot = path.join(
    process.env.HOME ?? "",
    "Library",
    "Caches",
    "ms-playwright",
  );
  const candidates = [
    process.env.CHROME_PATH,
    ...(existsSync(cacheRoot)
      ? readdirSync(cacheRoot)
          .filter((n) => n.startsWith("chromium_headless_shell-"))
          .sort()
          .reverse()
          .map((v) =>
            path.join(
              cacheRoot,
              v,
              "chrome-headless-shell-mac-arm64",
              "chrome-headless-shell",
            ),
          )
      : []),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  return candidates.find((p) => p && existsSync(p));
}

const executablePath = findChromium();
if (!executablePath) {
  console.error(
    "未找到 Chromium：设置 CHROME_PATH 指向 Chrome 可执行文件后重试，" +
      "或运行 `pnpm exec playwright-core install chromium-headless-shell`。",
  );
  process.exit(1);
}

// ---------- 边距简写展开（"12mm" | "12mm 8mm" | ... → 四值） ----------
function expandShorthand(shorthand) {
  const parts = shorthand.trim().split(/\s+/);
  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[2],
        left: parts[1],
      };
    case 4:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[2],
        left: parts[3],
      };
    default:
      return null;
  }
}

// ---------- 主流程 ----------
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  // 先切 print 媒体再导航，首帧即打印布局
  await page.emulateMedia({ media: "print" });
  await page.goto(args.url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);

  // 边距事实源：页面运行时（与 --a4-margin-* / @page 注入同源）
  const shorthand = await page.evaluate(() => {
    const api = window.CV?.a4Margin?.();
    if (typeof api === "string" && api.trim()) return api;
    const cs = getComputedStyle(document.documentElement);
    const v = (k) => cs.getPropertyValue(k).trim();
    const four = [v("--a4-margin-top"), v("--a4-margin-right"), v("--a4-margin-bottom"), v("--a4-margin-left")];
    return four.every(Boolean) ? four.join(" ") : null;
  });
  const margin = expandShorthand(shorthand ?? DEFAULT_MARGIN);
  if (!margin) {
    console.error(`无法解析边距简写 "${shorthand}"`);
    process.exit(1);
  }

  await page.pdf({
    path: args.output,
    format: "A4",
    printBackground: true,
    margin,
  });

  // 溢出守卫：数实际产出的 PDF 页数（Chrome 输出中 /Type /Page 为明文对象）
  const buf = await readFile(args.output);
  const text = buf.toString("latin1");
  const pages = (text.match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []).length;

  console.log(
    `PDF 导出完成: ${args.output}\n` +
      `  边距(margin): ${shorthand ?? DEFAULT_MARGIN}（来自页面运行时配置）\n` +
      `  页数(pages): ${pages || "未知（PDF 解析失败，请人工核对）"}\n` +
      `  Chromium: ${executablePath}`,
  );

  if (args.maxPages && pages > 0 && pages > args.maxPages) {
    console.error(
      `溢出守卫触发：实际 ${pages} 页 > 上限 ${args.maxPages} 页。` +
        `请精简内容或调整 --max-pages。`,
    );
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}

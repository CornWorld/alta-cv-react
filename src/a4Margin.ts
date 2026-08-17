/**
 * A4 页边距配置：支持 CSS margin 简写语法（1/2/3/4 个值）。
 *
 * 用法：
 *   - 环境变量（构建期）：VITE_A4_MARGIN="12mm 8mm 10mm 8mm" pnpm dev:a4
 *   - 控制台调试 API（运行时）：window.CV.a4Margin("12mm 8mm")
 *
 * 解析后写入 <html> 的 --a4-margin-top/right/bottom/left 四个 CSS 变量，
 * 并注入 <style id="cv-page-margin"> 覆盖打印 @page 边距。
 * 注意：@page 规则在 Chrome 中不解析 var()，所以必须用字面量注入。
 */

export interface CssMargin {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export const DEFAULT_A4_MARGIN = "12mm";

const STYLE_ID = "cv-page-margin";

/** 允许的 CSS 长度单位（不含 %：% 在 padding/calc/@page 中语义不一致，会破坏跨媒体一致性） */
const UNIT_WHITELIST = new Set([
  "px",
  "pt",
  "mm",
  "cm",
  "in",
  "pc",
  "q",
  "em",
  "rem",
  "ex",
  "ch",
  "vw",
  "vh",
  "vmin",
  "vmax",
]);

/**
 * 校验单个 CSS 长度值：
 * - 0 可省略单位（CSS 规范允许）
 * - 非 0 必须带白名单内的单位（拒绝无单位非零值、垃圾单位）
 * - 支持符号（+/-）与小数
 */
function isValidLength(value: string): boolean {
  if (/^[+-]?0(?:\.0+)?$/.test(value)) return true;
  const m = /^[+-]?(\d+(?:\.\d+)?|\.\d+)([a-z%]+)$/i.exec(value);
  if (!m) return false;
  const unit = m[2].toLowerCase();
  return UNIT_WHITELIST.has(unit);
}

/**
 * 解析 CSS margin 简写为四边。
 *
 * 支持语法（与 CSS margin 一致）：
 *   - 1 值：`12mm`             → 四边相同
 *   - 2 值：`12mm 8mm`         → 上下 / 左右
 *   - 3 值：`12mm 8mm 10mm`    → 上 / 左右 / 下
 *   - 4 值：`12mm 8mm 10mm 6mm`→ 上 / 右 / 下 / 左
 *
 * 非法输入回退默认并 console.warn。
 */
export function parseCssMargin(input: string): CssMargin {
  const parts = (input ?? DEFAULT_A4_MARGIN)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length < 1 || parts.length > 4) {
    console.warn(
      `[a4Margin] 非法边距简写 "${input}"，回退默认 "${DEFAULT_A4_MARGIN}"`
    );
    return expandShorthand(DEFAULT_A4_MARGIN);
  }

  // 每个值必须是合法 CSS 长度（仅支持长度单位，不支持 auto/calc()/%）
  if (!parts.every(isValidLength)) {
    console.warn(
      `[a4Margin] 非法边距值 "${parts.find(
        (p) => !isValidLength(p)
      )}"，回退默认 "${DEFAULT_A4_MARGIN}"`
    );
    return expandShorthand(DEFAULT_A4_MARGIN);
  }

  switch (parts.length) {
    case 1:
      return {
        top: parts[0],
        right: parts[0],
        bottom: parts[0],
        left: parts[0],
      };
    case 2:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[0],
        left: parts[1],
      };
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
      // 理论不可达：parts.length 已在前面约束为 1-4
      return expandShorthand(DEFAULT_A4_MARGIN);
  }
}

/** 单一值简写 → 四边（内部辅助） */
function expandShorthand(value: string): CssMargin {
  return { top: value, right: value, bottom: value, left: value };
}

/**
 * 读取待应用的简写配置（传入参数优先，其次环境变量，最后默认）。
 * 注意：这只是"解析配置"的辅助函数；如需读取当前已生效的边距，
 * 请用 getA4Margin()。
 */
export function resolveA4Margin(margin?: string): string {
  const env = import.meta.env.VITE_A4_MARGIN;
  return margin?.trim() || env?.trim() || DEFAULT_A4_MARGIN;
}

/** 当前已生效的规范化简写（applyA4Margin 之后更新） */
let currentShorthand = DEFAULT_A4_MARGIN;

/** 读取当前已生效的 A4 边距简写（无副作用） */
export function getA4Margin(): string {
  return currentShorthand;
}

/**
 * 应用 A4 页边距配置：
 *  1. 写入 --a4-margin-top/right/bottom/left CSS 变量（驱动屏幕 A4 预览）
 *  2. 注入/更新 <style id="cv-page-margin"> @page { margin: ... }（驱动打印）
 *
 * @param margin 可选，CSS margin 简写；缺省时读 VITE_A4_MARGIN，再回退默认
 * @returns 实际生效的简写（规范化后）
 */
export function applyA4Margin(margin?: string): string {
  const shorthand = resolveA4Margin(margin);
  const { top, right, bottom, left } = parseCssMargin(shorthand);
  const normalized = `${top} ${right} ${bottom} ${left}`;

  const root = document.documentElement;
  root.style.setProperty("--a4-margin-top", top);
  root.style.setProperty("--a4-margin-right", right);
  root.style.setProperty("--a4-margin-bottom", bottom);
  root.style.setProperty("--a4-margin-left", left);

  // @page 在 Chrome 中不解析 var()，必须注入字面量（保留 size: A4）
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `@page { size: A4; margin: ${normalized}; }`;

  currentShorthand = normalized;
  return normalized;
}

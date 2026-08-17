import React from "react";
import type { ElementType } from "react";

// 字号阶梯（相对 --font-size-base 的 rem 缩放，打印/A4 自动等比）：
//   name(36px) → section(24px) → subsection 一级 Event(20px)
//   → subsubsection 二级 Event(18px) → body·org·正文(16px) → 细节 meta(14/12px)
type TypographyVariant =
  | "name" // 最大标题，用于姓名
  | "tagline" // 副标题，用于简介
  | "section" // 大标题，用于分区
  | "subsection" // 小标题，用于一级 Event/公司
  | "subsubsection" // 子子标题，用于二级/嵌套 Event 标题
  | "body" // 正文
  | "caption"; // 说明文字

interface TypographyProps {
  variant: TypographyVariant;
  component?: ElementType;
  children: React.ReactNode;
  className?: string;
}

const defaultComponents: Record<TypographyVariant, ElementType> = {
  name: "h1",
  tagline: "h2",
  section: "h2",
  subsection: "h3",
  subsubsection: "h4",
  body: "p",
  caption: "span",
};

const Typography: React.FC<TypographyProps> = ({
  variant,
  component,
  children,
  className = "",
}) => {
  const styles = {
    name: "text-4xl font-[800] text-cv-name leading-tight",
    tagline: "text-base font-bold text-cv-tagline",
    section: "text-2xl font-bold text-cv-heading",
    subsection: "text-xl font-bold text-cv-subheading",
    subsubsection: "text-lg font-bold text-cv-subheading",
    body: "text-base text-cv-body leading-relaxed",
    caption: "text-base text-cv-body",
  } as const;

  const Component = component || defaultComponents[variant];

  return (
    <Component className={`${styles[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export default Typography;

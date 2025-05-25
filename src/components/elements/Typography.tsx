import React from 'react';
import type { ElementType } from 'react';

type TypographyVariant = 
  | 'name'        // 最大标题，用于姓名
  | 'tagline'     // 副标题，用于简介
  | 'section'     // 大标题，用于分区
  | 'subsection'  // 小标题，用于子分区
  | 'body'        // 正文
  | 'caption';    // 说明文字

interface TypographyProps {
  variant: TypographyVariant;
  component?: ElementType;
  children: React.ReactNode;
  className?: string;
}

const defaultComponents: Record<TypographyVariant, ElementType> = {
  name: 'h1',
  tagline: 'h2',
  section: 'h2',
  subsection: 'h3',
  body: 'p',
  caption: 'span'
};

const Typography: React.FC<TypographyProps> = ({
  variant,
  component,
  children,
  className = ''
}) => {
  const styles = {
    name: 'text-4xl font-[800] text-cv-name leading-tight',
    tagline: 'text-base font-bold text-cv-tagline',
    section: 'text-2xl font-bold text-cv-heading',
    subsection: 'text-xl font-bold text-cv-subheading',
    body: 'text-base text-cv-body leading-relaxed',
    caption: 'text-base text-cv-body'
  } as const;

  const Component = component || defaultComponents[variant];

  return (
    <Component 
      className={`${styles[variant]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Typography; 
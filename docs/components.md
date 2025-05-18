# AltaCV React 组件设计

## 1. 设计原则

1. **原子化**
   - 每个组件只负责单一功能
   - 组件提供合理的默认样式
   - 组件间通过组合构建复杂功能
   - 用户可以完全控制布局

2. **样式控制**
   - 所有样式都可以通过 className 覆盖
   - 使用 CSS Variables 定义主题
   - 提供响应式设计支持
   - 确保打印样式的稳定性

3. **类型安全**
   - 完整的 TypeScript 类型定义
   - Props 接口清晰明确
   - 合理的默认值
   - 运行时类型检查

## 2. 基础组件

### 2.1 主题系统

从 LaTeX 源码分析，AltaCV 定义了以下颜色变量：
```latex
\colorlet{accent}{blue!70!black}
\colorlet{emphasis}{black}
\colorlet{heading}{black}
\colorlet{headingrule}{black}
\colorlet{subheading}{emphasis}
\colorlet{body}{black!80!white}
\colorlet{name}{heading}
\colorlet{tagline}{accent}
```

React 实现：
```typescript

// components/ThemeProvider.tsx
interface ThemeProviderProps {
  theme?: typeof defaultTheme;
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = defaultTheme,
  children
}) => {
  const cssVars = React.useMemo(() => {
    return {
      '--cv-accent': theme.colors.accent,
      '--cv-emphasis': theme.colors.emphasis,
      // ... other variables
    };
  }, [theme]);

  return (
    <div style={cssVars}>
      {children}
    </div>
  );
};
```

### 2.2 Typography

LaTeX 源码定义了多种字体样式：
```latex
\newcommand{\namefont}{\Huge\bfseries}
\newcommand{\taglinefont}{\large\bfseries}
\newcommand{\personalinfofont}{\footnotesize\bfseries}
\newcommand{\cvsectionfont}{\LARGE\bfseries}
\newcommand{\cvsubsectionfont}{\large\bfseries}
```

React 实现：
```typescript
// components/elements/Typography.tsx
type TypographyVariant = 
  | 'name'        // 最大标题，用于姓名
  | 'tagline'     // 副标题，用于简介
  | 'section'     // 大标题，用于分区
  | 'subsection'  // 小标题，用于子分区
  | 'body'        // 正文
  | 'caption';    // 说明文字

interface TypographyProps {
  variant: TypographyVariant;
  component?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
}

const Typography = ({
  variant,
  component,
  children,
  className
}: TypographyProps) => {
  const styles = {
    name: 'text-4xl font-bold text-name',
    tagline: 'text-xl font-bold text-tagline',
    section: 'text-2xl font-bold text-heading uppercase',
    subsection: 'text-xl font-bold text-subheading',
    body: 'text-base text-body',
    caption: 'text-sm text-body'
  };

  const Component = component || defaultComponents[variant] || 'div';

  return (
    <Component className={`${styles[variant]} ${className || ''}`}>
      {children}
    </Component>
  );
};
```

### 2.3 Divider

LaTeX 源码：
```latex
\newcommand{\divider}{\textcolor{body!30}{\hdashrule{\linewidth}{0.6pt}{0.5ex}}\medskip}
```

React 实现：
```typescript
// components/elements/Divider.tsx
interface DividerProps {
  className?: string;
  color?: string;
  spacing?: string;
}

const Divider = ({
  className,
  color = 'var(--cv-body)',
  spacing = '1rem'
}: DividerProps) => {
  return (
    <hr
      className={`
        w-full
        border-0
        border-t
        border-opacity-30
        my-${spacing}
        ${className || ''}
      `}
      style={{ borderColor: color }}
    />
  );
};
```

### 2.4 Icon

LaTeX 源码使用 FontAwesome 5：
```latex
\RequirePackage[fixed]{fontawesome5}
\newcommand{\cvDateMarker}{\faCalendar[regular]}
\newcommand{\cvLocationMarker}{\faMapMarker}
```

React 实现：
```typescript
// components/elements/Icon.tsx
import { IconType } from 'react-icons';
import * as Icons from 'react-icons/fa';

interface IconProps {
  icon: IconType | string;
  label?: string;
  href?: string;
  className?: string;
}

const Icon = ({
  icon,
  label,
  href,
  className
}: IconProps) => {
  const IconComponent = typeof icon === 'string' 
    ? Icons[icon as keyof typeof Icons]
    : icon;

  const content = (
    <span className={`
      inline-flex
      items-center
      gap-1
      text-accent
      ${className || ''}
    `}>
      <IconComponent aria-hidden="true" />
      {label && <span>{label}</span>}
    </span>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-accent-dark"
    >
      {content}
    </a>
  ) : content;
};
```

## 3. 布局组件

### 3.1 Section

LaTeX 源码：
```latex
\newcommand{\cvsection}[2][]{%
  \nointerlineskip\bigskip%
  \ifstrequal{#1}{}{}{\marginpar{\vspace*{\dimexpr1pt-\baselineskip}\raggedright\input{#1}}}%
  {\color{heading}\cvsectionfont\MakeUppercase{#2}}\\[-1ex]%
  {\color{headingrule}\rule{\linewidth}{2pt}\par}\medskip
}
```

React 实现：
```typescript
// components/layout/Section.tsx
interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section = ({
  title,
  icon,
  sidebar,
  children,
  className
}: SectionProps) => {
  return (
    <section className={`mb-8 ${className || ''}`}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-accent">{icon}</span>
        )}
        <Typography
          variant="section"
          component="h2"
          className="text-heading"
        >
          {title}
        </Typography>
      </div>
      <div className="h-0.5 w-full bg-headingRule mt-2 mb-4" />
      <div className="flex gap-4">
        <div className="flex-grow">{children}</div>
        {sidebar && (
          <div className="w-1/4">{sidebar}</div>
        )}
      </div>
    </section>
  );
};
```

### 3.2 Grid

LaTeX 使用 paracol 包实现多列布局。在 React 中，我们使用 CSS Grid：

```typescript
// components/layout/Grid.tsx
interface GridProps {
  columns?: number | string;
  gap?: string;
  children: React.ReactNode;
  className?: string;
}

const Grid = ({
  columns = 1,
  gap = '1rem',
  children,
  className
}: GridProps) => {
  const gridCols = typeof columns === 'number'
    ? `grid-cols-${columns}`
    : columns;

  return (
    <div
      className={`
        grid
        ${gridCols}
        ${className || ''}
      `}
      style={{ gap }}
    >
      {children}
    </div>
  );
};
```

## 4. 数据展示组件

这些组件将在后续实现，每个都需要仔细分析 LaTeX 源码：

1. Timeline（时间线）
2. SkillMatrix（技能矩阵）
3. Bibliography（参考文献）
4. WheelChart（轮盘图表）

## 5. 打印优化

所有组件都需要考虑打印场景：

```typescript
// styles/print.css
@media print {
  :root {
    --cv-page-width: 210mm;
    --cv-page-height: 297mm;
    --cv-page-margin: 2cm;
  }

  body {
    width: var(--cv-page-width);
    height: var(--cv-page-height);
    margin: 0;
    padding: var(--cv-page-margin);
  }

  .page-break {
    break-before: page;
  }

  .no-break {
    break-inside: avoid;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

## 6. 使用示例

```tsx
// cv.tsx
const CV = () => {
  return (
    <ThemeProvider>
      <div className="max-w-[var(--cv-page-width)] mx-auto p-8">
        <Header
          name="John Doe"
          tagline="Senior Developer"
          photo="/avatar.jpg"
        />
        
        <Grid columns={2} className="gap-8">
          <div className="space-y-6">
            <Section title="Experience">
              <Timeline>
                <Timeline.Event
                  title="Senior Developer"
                  organization="Tech Corp"
                  date="2020-Present"
                />
              </Timeline>
            </Section>
          </div>
          
          <div className="space-y-6">
            <Section title="Skills">
              <div className="grid grid-cols-2 gap-4">
                <SkillCard title="React" level={5} />
                <SkillCard title="TypeScript" level={4} />
              </div>
            </Section>
          </div>
        </Grid>
      </div>
    </ThemeProvider>
  );
}; 
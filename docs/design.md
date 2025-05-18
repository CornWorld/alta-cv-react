# AltaCV React 版本设计文档

## 1. 项目愿景

将 AltaCV 转换为 React 组件库的核心目标是为用户提供灵活且易用的简历构建工具。我们不是要完全复制 LaTeX 的严格布局系统，而是要充分利用 Web 技术的优势，让用户能够更自由地控制简历的结构和样式。

### 1.1 核心理念

1. **组件原子化**
   - 提供小而精的基础组件
   - 每个组件专注于单一功能
   - 组件之间低耦合，高内聚
   - 用户可以自由组合构建复杂布局

2. **用户控制优先**
   - 布局控制权交给用户
   - 组件提供合理的默认值
   - 样式高度可定制
   - 支持渐进式增强

3. **Web 技术优势**
   - 利用现代 CSS 特性
   - 响应式设计
   - 实时预览
   - 打印优化

## 2. 用户需求分析

### 2.1 目标用户画像

1. **Web 开发者**
   - 熟悉 React 和现代前端技术
   - 希望快速构建个人简历
   - 需要高度定制化的能力
   - 重视代码质量和类型安全

2. **设计师**
   - 关注视觉效果和排版
   - 需要精确控制样式
   - 希望能快速调整设计
   - 重视响应式和打印效果

3. **内容创作者**
   - 频繁更新简历内容
   - 需要多个简历版本
   - 重视内容的组织和展示
   - 希望能快速切换主题

### 2.2 用户场景

1. **初始简历创建**
   ```tsx
   // cv.tsx
   import { Grid, Section, Timeline, Header } from 'alta-cv-react'
   
   const CV = () => {
     return (
       <div className="max-w-[210mm] mx-auto p-8">
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
                 {/* More events */}
               </Timeline>
             </Section>
           </div>
           
           <div className="space-y-6">
             <Section title="Skills">
               {/* User-defined skill layout */}
               <div className="grid grid-cols-2 gap-4">
                 <SkillCard title="React" level={5} />
                 <SkillCard title="TypeScript" level={4} />
               </div>
             </Section>
           </div>
         </Grid>
       </div>
     )
   }
   ```

2. **样式定制**
   ```css
   /* styles/themes/custom.css */
   @layer theme {
     :root[data-theme="custom"] {
       --color-cv-accent: #2E2E2E;
       --color-cv-emphasis: #333333;
       --color-cv-heading: #1A1A1A;
       --color-cv-heading-rule: #666666;
       --color-cv-subheading: #2E2E2E;
       --color-cv-body: #4D4D4D;
       --color-cv-name: #000000;
       --color-cv-tagline: #2E2E2E;
     }
   }
   
   /* cv.tsx */
   const CV = () => {
     return (
       <ThemeProvider initialTheme="custom">
         {/* CV content */}
       </ThemeProvider>
     )
   }
   ```

3. **内容管理**
   ```tsx
   // data/experience.ts
   export const experiences = [
     {
       id: 'tech-corp',
       title: 'Senior Developer',
       company: 'Tech Corp',
       date: '2020-Present',
       tags: ['web', 'leadership'],
       highlights: [
         'Led team of 5 developers',
         'Improved performance by 50%',
       ]
     },
     // ...
   ]
   
   // cv.tsx
   const CV = () => {
     const filteredExperience = experiences.filter(
       exp => exp.tags.includes('web')
     )
     
     return (
       <Section title="Experience">
         <Timeline>
           {filteredExperience.map(exp => (
             <Timeline.Event key={exp.id} {...exp} />
           ))}
         </Timeline>
       </Section>
     )
   }
   ```

### 2.3 用户痛点

1. **布局控制**
   - LaTeX 的布局系统过于严格
   - 难以实现响应式设计
   - 调整间距和对齐繁琐
   - 需要学习特定语法

2. **样式定制**
   - 修改样式需要了解 LaTeX 命令
   - 颜色和字体设置复杂
   - 缺乏实时预览
   - 主题切换困难

3. **内容管理**
   - 内容和样式混合
   - 版本管理不便
   - 复用内容困难
   - 条件渲染复杂

## 3. 解决方案

### 3.1 组件设计原则

1. **原子化设计**
   - 每个组件只负责一个具体功能
   - 组件提供合理的默认样式
   - 支持通过 props 和 className 覆盖默认值
   - 组件间通过组合而非继承关联

2. **布局自由度**
   - 不强制使用特定布局系统
   - 支持 CSS Grid 和 Flexbox
   - 提供辅助布局组件
   - 响应式设计友好

3. **样式系统**
   - 使用 CSS Variables 定义主题
   - 支持 Tailwind 工具类
   - 提供预设主题
   - 打印样式优化

### 3.2 组件分类

1. **原子组件**
   - Typography：文本样式
   - Divider：分隔线
   - Icon：图标
   - Badge：标签
   - Rating：评分

2. **布局组件**
   - Grid：网格布局
   - Stack：垂直/水平堆叠
   - Section：带标题的区块
   - Column：分栏布局

3. **复合组件**
   - Timeline：时间线
   - SkillMatrix：技能矩阵
   - Header：页眉
   - Bibliography：参考文献

### 3.3 使用方式

1. **基础用法**
   ```tsx
   import { Section, Timeline } from 'alta-cv-react'
   
   const Experience = () => (
     <Section title="Experience" className="space-y-4">
       <Timeline>
         <Timeline.Event
           title="Senior Developer"
           organization="Tech Corp"
           date="2020-Present"
         />
       </Timeline>
     </Section>
   )
   ```

2. **自定义布局**
   ```tsx
   const Skills = () => (
     <Section title="Skills">
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         {skills.map(skill => (
           <div key={skill.name} className="p-4 border rounded">
             <h3 className="font-bold">{skill.name}</h3>
             <Rating value={skill.level} />
           </div>
         ))}
       </div>
     </Section>
   )
   ```

3. **主题定制**
   ```tsx
   const theme = {
     colors: {
       primary: 'var(--cv-primary, #2E2E2E)',
       accent: 'var(--cv-accent, #8F0D0D)',
     },
     spacing: {
       section: 'var(--cv-section-spacing, 1.5rem)',
     }
   }
   ```

## 4. 技术实现

### 4.1 核心技术

1. **React + TypeScript**
   - 类型安全
   - 组件复用
   - 开发效率
   - 良好的 IDE 支持

2. **Tailwind CSS**
   - 原子化 CSS
   - 响应式设计
   - 主题定制
   - 打印优化

3. **CSS Variables**
   - 动态主题
   - 样式复用
   - 打印适配
   - 降级方案

### 4.2 开发规范

1. **组件设计**
   - Props 接口清晰
   - 合理的默认值
   - 支持样式覆盖
   - 考虑边界情况

2. **样式管理**
   - 使用 Tailwind 工具类
   - 避免内联样式
   - 合理使用 CSS Variables
   - 打印样式分离

3. **文档和测试**
   - 详细的使用说明
   - 丰富的示例
   - 完整的类型定义
   - 视觉回归测试

## 5. 后续规划

1. **核心功能**
   - 完整的组件库
   - 主题系统
   - 打印优化
   - 示例模板

2. **增强功能**
   - 数据管理
   - 国际化支持
   - 更多图表组件
   - 性能优化

3. **工具支持**
   - CLI 工具
   - VS Code 插件
   - 调试工具
   - 性能监控 
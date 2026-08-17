import React from "react";

interface SubProjectProps {
  title: string;
  date?: string;
  techStack?: string;
  children: React.ReactNode;
  className?: string;
}

// 子项目卡片：左窄栏（标题/时间/技术栈）+ 右宽栏（bullet），约 0.382/0.618 局部比例分割
const SubProject: React.FC<SubProjectProps> = ({
  title,
  date,
  techStack,
  children,
  className = "",
}) => {
  return (
    <div className={`cv-subproject gap-4 mb-3 last:mb-0 ${className}`}>
      <div>
        <div className="font-bold text-cv-emphasis text-sm leading-snug">{title}</div>
        {date && <div className="text-xs text-cv-body mt-1">{date}</div>}
        {techStack && <div className="text-xs text-cv-accent mt-1 leading-snug">{techStack}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SubProject;

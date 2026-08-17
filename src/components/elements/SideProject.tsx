import React from "react";
import { FaGithub, FaStar } from "react-icons/fa";

interface SideProjectProps {
  /** 项目名称 */
  title: string;
  /** 仓库标识，如 "CornWorld/dove-desktop" */
  repo?: string;
  /** 仓库链接 */
  href?: string;
  /** star 数，如 "3.6K"，跟随 repo 显示 */
  stars?: string;
  /** 角色，如 "维护者"，作为元信息行的一段 */
  role?: string;
  /** 技术栈一行字 */
  tech?: string;
  /** 一到两行描述 */
  children?: React.ReactNode;
  className?: string;
}

/**
 * 侧栏紧凑型项目条目。
 * 结构：标题行 → 元信息行（repo · ★star · 角色，淡色小字）→ 描述 → 技术栈。
 * 不使用 badge/Tag，star 与角色作为元信息内联呈现，与左栏 Event 的
 * date/location 元信息行视觉同构。
 */
const SideProject: React.FC<SideProjectProps> = ({
  title,
  repo,
  href,
  stars,
  role,
  tech,
  children,
  className = "",
}) => {
  return (
    <div className={`mb-[var(--cv-item-spacing-y)] ${className}`}>
      <div className="font-bold text-cv-heading">{title}</div>
      {(repo || stars || role) && (
        <div className="mt-0.5 flex items-center gap-1.5 text-sm text-cv-body flex-wrap">
          {repo && (
            <a
              href={href}
              className="inline-flex items-center gap-1 text-cv-accent break-keep"
            >
              <FaGithub className="w-3 h-3" />
              <span>{repo}</span>
            </a>
          )}
          {stars && (
            <>
              <span className="opacity-50">·</span>
              <span className="inline-flex items-center gap-0.5 break-keep">
                <FaStar className="w-3 h-3 text-[var(--color-cv-accent)]" />
                <span>{stars}</span>
              </span>
            </>
          )}
          {role && (
            <>
              <span className="opacity-50">·</span>
              <span className="break-keep">{role}</span>
            </>
          )}
        </div>
      )}
      {children && (
        <div className="mt-0.5 text-sm text-cv-body">{children}</div>
      )}
      {tech && (
        <div className="mt-0.5 text-xs text-cv-body opacity-75">{tech}</div>
      )}
    </div>
  );
};

export default SideProject;

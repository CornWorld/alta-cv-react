import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
  return (
    <span 
      className={`
        inline-flex 
        items-center 
        px-2 
        py-1 
        rounded-md 
        text-sm 
        mr-2 
        mb-2
        bg-[color-mix(in_oklch,var(--color-cv-accent),transparent_90%)]
        text-[var(--color-cv-accent)]
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Tag; 
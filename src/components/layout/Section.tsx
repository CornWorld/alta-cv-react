import React from 'react';
import Typography from '../elements/Typography';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  sidebar
}) => {
  return (
    <section className={`relative ${className}`}>
      {sidebar && (
        <div 
          className="absolute right-full mr-4 text-right" 
          style={{ width: 'calc(var(--size-column-sep) * 2)' }}
        >
          {sidebar}
        </div>
      )}

      <div>
        <Typography variant="section" className="font-serif">
          {title}
        </Typography>
        
        <div className="h-0.5 mt-1 mb-4 bg-[var(--color-cv-heading-rule)]" />

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;

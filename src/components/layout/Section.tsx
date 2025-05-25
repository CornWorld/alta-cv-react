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
    <section className={`cv-section relative ${className}`}>
      {sidebar && (
        <div className="cv-section-sidebar">
          {sidebar}
        </div>
      )}

      <div>
        <Typography variant="section" className="cv-section-title">
          {title}
        </Typography>
        <div className="cv-section-rule" />
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;

import React from 'react';
import type { IconType } from 'react-icons';
import Typography from './Typography';

interface AchievementProps {
  icon: IconType;
  title: string;
  description: string;
  className?: string;
}

const Achievement: React.FC<AchievementProps> = ({
  icon: Icon,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`flex items-start gap-2 mb-4 ${className}`}>
      <div className="h-full flex m-auto items-center justify-center text-cv-accent flex-shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <Typography variant="subsection">
          {title}
        </Typography>
        <div className="mt-1 text-sm text-cv-body">
          {description}
        </div>
      </div>
    </div>
  );
};

export default Achievement; 
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
      <div className="h-full w-6 m-auto text-cv-accent">
        <Icon size={22} />
      </div>
      <div className='flex-grow'>
        <Typography variant="subsection" className='text-sm font-bold'>
          {title}
        </Typography>
        <div className="text-sm text-cv-body">
          {description}
        </div>
      </div>
    </div>
  );
};

export default Achievement; 
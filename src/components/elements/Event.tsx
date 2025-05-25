import React from 'react';
import Typography from './Typography';
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface EventProps {
  title: string;
  organization?: string;
  date?: string;
  location?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: IconType | React.ReactNode;
}

const Event: React.FC<EventProps> = ({
  title,
  organization,
  date,
  location,
  children,
  className = '',
  icon
}) => {
  return (
    <div className={`mb-[var(--cv-item-spacing-y)] ${className}`}>
      <div>
        <Typography variant="subsection" className={icon?'flex gap-2':''}>
          {icon && (
            <div className='text-base my-auto w-6'>
              {React.isValidElement(icon) ? icon : React.createElement(icon as IconType)}
            </div>
          )}
          {title}
        </Typography>
        {organization && (
          <div className="text-base font-bold text-cv-accent mt-1">
            {organization}
          </div>
        )}
        <div className="text-base mt-2 flex flex-row flex-auto gap-4 flex-wrap">
          {date && (
            <div className="flex items-center gap-2 text-cv-body break-keep">
              <FaCalendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-cv-body break-keep">
              <FaMapMarkerAlt className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default Event; 
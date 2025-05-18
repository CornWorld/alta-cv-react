import React from 'react';
import Typography from './Typography';
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

interface EventProps {
  title: string;
  organization?: string;
  date?: string;
  location?: string;
  children?: React.ReactNode;
  className?: string;
}

const Event: React.FC<EventProps> = ({
  title,
  organization,
  date,
  location,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-[var(--cv-item-spacing)] ${className}`}>
      <div>
        <Typography variant="subsection">
          {title}
        </Typography>
        {organization && (
          <div className="text-sm font-bold text-cv-accent mt-1">
            {organization}
          </div>
        )}
        <div className="text-sm mt-2 flex flex-row flex-auto gap-4 flex-wrap">
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
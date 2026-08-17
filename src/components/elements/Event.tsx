import React, { createContext, useContext } from "react";
import Typography from "./Typography";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

// 嵌套层级上下文：顶层 Event 为 0，每嵌套一层 +1；用于决定 title 字号（顶层 subsection / 嵌套 subsubsection）
const EventDepthContext = createContext(0);

interface EventProps {
  title: string;
  organization?: string;
  date?: string;
  location?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  inlineMeta?: boolean;
}

const Event: React.FC<EventProps> = ({
  title,
  organization,
  date,
  location,
  children,
  className = "",
  icon,
  inlineMeta = false,
}) => {
  const depth = useContext(EventDepthContext);
  const titleVariant = depth === 0 ? "subsection" : "subsubsection";
  const metadata = (
    <>
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
    </>
  );

  return (
    <EventDepthContext.Provider value={depth + 1}>
      <div className={`mb-[var(--cv-item-spacing-y)] ${className}`}>
        <div
          className={
            inlineMeta ? "flex items-center justify-between gap-x-4" : ""
          }
        >
          <Typography
            variant={titleVariant}
            className={`${inlineMeta ? "min-w-0 flex-1" : ""}${
              icon ? " flex gap-2" : ""
            }`}
          >
            {icon && <div className="text-base my-auto w-6">{icon}</div>}
            {title}
          </Typography>
          {inlineMeta && (date || location) && (
            <div className="flex shrink-0 flex-row flex-wrap justify-end gap-x-4 gap-y-1 text-base">
              {metadata}
            </div>
          )}
        </div>
        {organization && (
          <div className="text-base font-bold text-cv-accent mt-1">
            {organization}
          </div>
        )}
        {!inlineMeta && (date || location) && (
          <div className="text-base mt-2 flex flex-row flex-auto gap-4 flex-wrap">
            {metadata}
          </div>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </EventDepthContext.Provider>
  );
};

export default Event;

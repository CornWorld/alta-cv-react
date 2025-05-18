import React from 'react';

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return (
    <hr className={`cv-divider ${className}`} />
  );
};

export default Divider; 
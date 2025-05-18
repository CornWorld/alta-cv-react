import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(currentTheme === 'default' ? 'dark' : 'default');
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md bg-[var(--color-cv-accent)] text-white"
    >
      Switch to {currentTheme === 'default' ? 'Dark' : 'Light'} Theme
    </button>
  );
};

export default ThemeToggle; 
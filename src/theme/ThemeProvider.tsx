import React, { createContext, useContext, useEffect } from 'react';

// Import base styles
import '../styles/base.css';

// Import all theme styles
import '../styles/themes/dark.css';

type ThemeName = 'default' | 'dark';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'default',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  initialTheme?: ThemeName;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = 'default',
  children
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 
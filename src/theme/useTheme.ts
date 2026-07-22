import { createContext, useContext } from "react";

export type ThemeName = "default" | "dark";

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "default",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

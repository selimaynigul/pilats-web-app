import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { Theme } from "../theme/themeTypes";
import { lightTheme, darkTheme } from "../theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  getTheme: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  getTheme?: () => Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getInitialTheme = (): Theme =>
    localStorage.getItem("app-theme") === "dark" ? darkTheme : lightTheme;

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("app-theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: any) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  const getTheme = () => (theme === darkTheme ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

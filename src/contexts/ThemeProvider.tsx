import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

interface Theme {
  bodyBg: string;
  text: string;
  header: string;
  primary: string;
  inputBg: string;
  inputBorder: string;
}

const lightTheme: Theme = {
  bodyBg: "#ffffff",
  text: "#000000",
  header: "#f6f5ff",
  primary: "#5d46e5",
  inputBg: "white",
  inputBorder: "white",
};

const darkTheme: Theme = {
  bodyBg: "#14102b",
  text: "#ffffff",
  header: "#ffffff",
  primary: "#5d46e5",
  inputBg: "#1e1840",
  inputBorder: "#1e1840",
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getInitialTheme = (): Theme =>
    localStorage.getItem("app-theme") === "dark" ? darkTheme : lightTheme;

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("app-theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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

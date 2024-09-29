// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  DefaultTheme,
} from "styled-components";

interface Theme {
  background: string;
  color: string;
}

const lightTheme: Theme = {
  background: "#ffffff",
  color: "#000000",
};

const darkTheme: Theme = {
  background: "#000000",
  color: "#ffffff",
};

interface ThemeContextType {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
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

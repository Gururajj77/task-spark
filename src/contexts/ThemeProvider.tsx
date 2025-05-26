
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>; // Allow direct setting
  resolvedTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light", // Default to light if system preference can't be determined server-side
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme", // Using vite-ui-theme as a common key
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark");
      let effectiveTheme = currentTheme;
      if (currentTheme === "system") {
        effectiveTheme = mediaQuery.matches ? "dark" : "light";
      }
      root.classList.add(effectiveTheme);
      setResolvedTheme(effectiveTheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, currentTheme);
      }
    };

    updateTheme(theme); // Initial theme update

    const handleChange = () => {
      // Only update if current theme is 'system'
      if (theme === "system") {
        updateTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, storageKey]);


  // Custom setTheme that also updates localStorage
  const setTheme: Dispatch<SetStateAction<Theme>> = (newThemeOrUpdater) => {
    setThemeState(prevTheme => {
      const newTheme = typeof newThemeOrUpdater === 'function' 
        ? newThemeOrUpdater(prevTheme) 
        : newThemeOrUpdater;
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
      // Effect hook will handle applying class and updating resolvedTheme
      return newTheme;
    });
  };


  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

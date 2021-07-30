import { useState, createContext, useEffect } from "react";

export const useThemeState = () => {
  const [themeMode, setThemeMode] = useState("light");

  const setMode = (mode: string) => {
    window.localStorage.setItem("theme", mode);
    setThemeMode(mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme ? setMode(localTheme) : setMode("light");
  }, []);

  return { themeMode, themeToggler };
};

export const ThemeToggleContext = createContext<null | (() => void)>(null);

import { useState, createContext, useEffect } from "react";

export const useThemeState = () => {
  const [themeMode, setThemeMode] = useState("dark");

  const setMode = (mode: string) => {
    window.localStorage.setItem("theme", mode);
    setThemeMode(mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setMode(newTheme);
    });

    const localTheme = window.localStorage.getItem("theme");

    if (localTheme) {
      setMode(localTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  return { themeMode, themeToggler };
};

export const ThemeToggleContext = createContext<null | (() => void)>(null);

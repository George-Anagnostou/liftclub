import { useEffect, useState, createContext } from "react";
import { lightTheme, darkTheme } from "./Themes";

export const useThemeState = () => {
  const [themeMode, setThemeMode] = useState("light");

  const setMode = (mode) => {
    window.localStorage.setItem("theme", mode);
    setThemeMode(mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      setMode(localTheme);
    } else {
      setMode("light");
    }
  }, []);

  return { themeMode, themeToggler };
};

export const ThemeToggleContext = createContext({});

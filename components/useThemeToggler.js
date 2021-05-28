import { useEffect } from "react";
import { useStoreDispatch, useStoreState } from "../store";

export const useThemeToggler = () => {
  const { themeMode } = useStoreState();
  const dispatch = useStoreDispatch();

  const setMode = (mode) => {
    dispatch({ type: "TOGGLE_THEME", payload: { themeMode: mode } });
    window.localStorage.setItem("theme", mode);
  };

  const themeToggler = () => {
    themeMode === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme ? setMode(localTheme) : setMode("light");
  }, []);

  return themeToggler;
};

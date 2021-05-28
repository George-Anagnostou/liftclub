import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import { useStoreDispatch, loginUser } from "../store";
// Theme
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./Themes";
import { useThemeState, ThemeToggleContext } from "./useThemeState";

export default function Layout({ title = "Workout App", children }) {
  const router = useRouter();

  const dispatch = useStoreDispatch();

  const { themeMode, themeToggler } = useThemeState();
  const themes = themeMode === "light" ? lightTheme : darkTheme;

  // Check local storage for user_id for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");

    // If local storage workoutID exists, login user
    user_id ? loginUser(dispatch, user_id) : router.push("/");
  }, []);

  return (
    <ThemeProvider theme={themes}>
      <ThemeToggleContext.Provider value={themeToggler}>
        <GlobalStyles />

        <SeoHead title={title} />

        <MainContainer>
          <NavBar />
          {children}
        </MainContainer>
      </ThemeToggleContext.Provider>
    </ThemeProvider>
  );
}

const MainContainer = styled.main`
  text-align: center;
  margin-bottom: 10vh;
`;

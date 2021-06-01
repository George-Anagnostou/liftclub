import { useEffect } from "react";
import { useRouter } from "next/router";
import styled, { ThemeProvider } from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import { useStoreDispatch, loginUser } from "../store";
// Theme
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./Themes/Themes";
import { useThemeState, ThemeToggleContext } from "./Themes/useThemeState";

export default function Layout({ title = "Ananostou Lift Club", children }) {
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

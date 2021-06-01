import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled, { ThemeProvider } from "styled-components";
// Context
import { useStoreState, useStoreDispatch, loginUser } from "../store";
// Components
import Login from "../components/HomePage/Login";
import SeoHead from "../components/SeoHead";
import Branding from "../components/HomePage/Branding";
import { GlobalStyles } from "../components/GlobalStyles";
import { useThemeState } from "../components/Themes/useThemeState";
import { darkTheme, lightTheme } from "../components/Themes/Themes";
import CreateAcc from "../components/HomePage/CreateAcc";

export default function Home() {
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const { themeMode } = useThemeState();
  const themes = themeMode === "light" ? lightTheme : darkTheme;

  const [formType, setFormType] = useState("login");

  const handleLinkClick = () => setFormType(formType === "login" ? "create" : "login");

  // Route to workoutLog
  const routeToWorkoutLog = () => setTimeout(() => router.push("/workoutLog"), 2000);

  const persistLogin = async (user_id) => {
    const loginSuccess = await loginUser(dispatch, user_id);
    if (loginSuccess) routeToWorkoutLog();
  };

  // Check local storage for username for persistant login
  useEffect(() => {
    const user_id = localStorage.getItem("workoutID");
    // If local storage workoutID exists, login user
    if (user_id) persistLogin(user_id);
  }, []);

  return (
    <ThemeProvider theme={themes}>
      <MainContainer>
        <SeoHead title="Anagnostou Lift Club" />
        <GlobalStyles />

        {user ? (
          <WelcomeMessage>
            <h1>Welcome {user.username}</h1>
            <p>You have logged {user.workoutLog.length} workouts.</p>
          </WelcomeMessage>
        ) : (
          <>
            <Branding />

            {formType === "login" && (
              <Login routeToWorkoutLog={routeToWorkoutLog} handleLinkClick={handleLinkClick} />
            )}
            {formType === "create" && (
              <CreateAcc routeToWorkoutLog={routeToWorkoutLog} handleLinkClick={handleLinkClick} />
            )}
          </>
        )}
      </MainContainer>
    </ThemeProvider>
  );
}

const MainContainer = styled.div`
  font-family: Tahoma, Helvetica;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const WelcomeMessage = styled.div`
  text-align: center;
`;

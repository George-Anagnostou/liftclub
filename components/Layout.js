import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import {
  useStoreDispatch,
  loginUser,
  useStoreState,
  setIsUsingPWA,
  setPlatformToiOS,
} from "../store";
// Styles
import { GlobalStyles } from "./GlobalStyles";

export default function Layout({ title = "Ananostou Lift Club", children }) {
  const router = useRouter();

  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const routeToWorkoutLog = () => router.push("/workoutLog");

  const persistLogin = async (user_id) => {
    const loginSuccess = await loginUser(dispatch, user_id);
    if (loginSuccess && router.pathname === "/") routeToWorkoutLog();
  };

  // Check local storage for user_id for persistant login
  const checkLocalStorage = async () => {
    const user_id = localStorage.getItem("workoutID");

    // If local storage workoutID exists, login user
    user_id ? persistLogin(user_id) : router.push("/");
  };

  useEffect(() => {
    checkLocalStorage();
  }, [router.pathname]);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setIsUsingPWA(dispatch);

    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      console.log(userAgent);
      return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInStandaloneMode = () =>
      "standalone" in window.navigator && window.navigator.standalone;

    if (isIos() && isInStandaloneMode()) {
      // offer app installation here
      setPlatformToiOS(dispatch);
    }
  }, []);

  return (
    <>
      <GlobalStyles />

      <SeoHead title={title} />

      <MainContainer>
        {children}
        {user && <NavBar />}
      </MainContainer>
    </>
  );
}

const MainContainer = styled.main`
  text-align: center;
  padding-bottom: 7vh;
  position: relative;
`;

import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import {
  useStoreDispatch,
  loginWithID,
  useStoreState,
  setIsUsingPWA,
  setPlatformToiOS,
} from "../store";
// Styles
import { GlobalStyles } from "./GlobalStyles";

interface Props {
  children?: React.ReactNode;
  title?: string;
}

const Layout: React.FC<Props> = ({ title = "Lift Club", children }) => {
  const router = useRouter();

  const dispatch = useStoreDispatch();
  const { user, platform, isUsingPWA } = useStoreState();

  const routeToWorkoutLog = () => router.push("/log");

  const persistLogin = async (user_id: string) => {
    const loginSuccess = await loginWithID(dispatch, user_id);
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
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detects if device is in standalone mode
    const isInStandaloneMode = "standalone" in window.navigator && window.navigator["standalone"];

    if (isIos() && isInStandaloneMode) setPlatformToiOS(dispatch);
    if (isInStandaloneMode) setIsUsingPWA(dispatch);
  }, []);

  return (
    <>
      <GlobalStyles />

      <SeoHead title={title} />

      <MainContainer className={platform === "ios" && isUsingPWA ? "ios-safe-area" : ""}>
        {children}
        {user && <NavBar />}
      </MainContainer>
    </>
  );
};
export default Layout;

const MainContainer = styled.main`
  text-align: center;
  padding-bottom: 3rem;
  position: relative;

  &.ios-safe-area {
    padding-bottom: 4rem;
  }
`;

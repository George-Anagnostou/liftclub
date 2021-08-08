import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import {
  useStoreDispatch,
  loginWithToken,
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
  const { user, platform, isUsingPWA, isSignedIn } = useStoreState();

  const persistLogin = async (token: string) => {
    const loginSuccess = await loginWithToken(dispatch, token);
    loginSuccess ? router.push("/log") : router.push("/"), localStorage.removeItem("authToken");
  };

  // Check local storage for user_id for persistant login
  const checkLocalStorageForAuthId = async () => {
    const token = localStorage.getItem("authToken");
    // If local storage workoutID exists, login user
    token ? persistLogin(token) : router.push("/");
  };

  useEffect(() => {
    if (!isSignedIn) checkLocalStorageForAuthId();
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

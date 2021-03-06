import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Context
import {
  useUserDispatch,
  loginWithToken,
  useUserState,
  setIsUsingPWA,
  setPlatformToiOS,
} from "../store";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Styles
import { GlobalStyles } from "./GlobalStyles";
// API
import { removeAuthToken, getAuthToken } from "../api-lib/auth/token";

const MarketingPages = { "/purpose": 1 };

interface Props {
  children?: React.ReactNode;
  title?: string;
}

const Layout: React.FC<Props> = ({ title = "Lift Club", children }) => {
  const router = useRouter();

  const dispatch = useUserDispatch();
  const { user, platform, isUsingPWA, isSignedIn } = useUserState();

  const isOnMarketingPage = Boolean(MarketingPages[router.pathname]);

  const loginWithAuthToken = async (token: string) => {
    const loginSuccess = await loginWithToken(dispatch, token);

    if (loginSuccess) {
      if (router.pathname === "/") router.push("/log");
    } else {
      router.push("/");
      removeAuthToken();
    }
  };

  useEffect(() => {
    if (isOnMarketingPage) return;

    if (!isSignedIn) {
      const token = getAuthToken();
      token ? loginWithAuthToken(token) : router.push("/");
    }
  }, [router.pathname]);

  useEffect(() => {
    // Detects if device is on iOS
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    // Detects if device is in standalone mode (using downloaded PWA)
    const isPWA = "standalone" in window.navigator && window.navigator["standalone"];

    if (isIos) setPlatformToiOS(dispatch);
    if (isPWA) setIsUsingPWA(dispatch);
  }, []);

  return (
    <>
      <GlobalStyles />

      <SeoHead title={title} />

      <MainContainer
        className={platform === "ios" && isUsingPWA ? "ios-safe-area" : ""}
        style={{ maxWidth: isOnMarketingPage ? "100%" : "700px" }}
      >
        {children}

        {user && router.pathname !== "/" && <NavBar />}
      </MainContainer>
    </>
  );
};
export default Layout;

const MainContainer = styled.main`
  text-align: center;
  padding-bottom: 3rem;
  position: relative;
  margin: auto;

  &.ios-safe-area {
    padding-bottom: 4rem;
  }
`;

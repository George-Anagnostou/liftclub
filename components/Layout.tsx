import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
// Components
import SeoHead from "./SeoHead";
import NavBar from "./NavBar";
// Context
import {
  useUserDispatch,
  loginWithToken,
  useUserState,
  setIsUsingPWA,
  setPlatformToiOS,
} from "../store";
// Styles
import { GlobalStyles } from "./GlobalStyles";

const MarketingPages = { "/purpose": 1 };

interface Props {
  children?: React.ReactNode;
  title?: string;
}

const Layout: React.FC<Props> = ({ title = "Lift Club", children }) => {
  const router = useRouter();

  const dispatch = useUserDispatch();
  const { user, platform, isUsingPWA, isSignedIn } = useUserState();

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    return token;
  };

  const loginWithAuthToken = async (token: string) => {
    const loginSuccess = await loginWithToken(dispatch, token);

    if (loginSuccess) {
      router.pathname === "/" && router.push("/log");
    } else {
      router.push("/");
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    if (MarketingPages[router.pathname]) return;

    if (!isSignedIn) {
      const token = getAuthToken();
      if (token) {
        loginWithAuthToken(token);
      } else {
        router.push("/");
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    // Detects if device is on iOS
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

    // Detects if device is in standalone mode (using downloaded PWA)
    const isPWA = "standalone" in window.navigator && window.navigator["standalone"];

    if (isIos && isPWA) setPlatformToiOS(dispatch);

    if (isPWA) setIsUsingPWA(dispatch);
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

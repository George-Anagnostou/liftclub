import { StoreProvider } from "../store";
import { ThemeProvider } from "styled-components";
// Theme
import { lightTheme, darkTheme } from "../components/Themes/Themes";
import { useThemeState, ThemeToggleContext } from "../components/Themes/useThemeState";
// Components
import Layout from "../components/Layout";
import React, { useEffect } from "react";

const MyApp = ({ Component, pageProps }) => {
  const { themeMode, themeToggler } = useThemeState();
  const themes = themeMode === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    navigator.serviceWorker?.register("/sw.js").then(
      (registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      },
      (err) => {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  }, []);

  return (
    <StoreProvider>
      <ThemeProvider theme={themes}>
        <ThemeToggleContext.Provider value={themeToggler}>
          <Layout>
            <Component pageProps={pageProps} />
          </Layout>
        </ThemeToggleContext.Provider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default MyApp;

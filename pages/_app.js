import { StoreProvider } from "../store";
import { ThemeProvider } from "styled-components";
// Theme
import { lightTheme, darkTheme } from "../components/Themes/Themes";
import { useThemeState, ThemeToggleContext } from "../components/Themes/useThemeState";
// Components
import Layout from "../components/Layout";

const MyApp = ({ Component, pageProps }) => {
  const { themeMode, themeToggler } = useThemeState();
  const themes = themeMode === "light" ? lightTheme : darkTheme;

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

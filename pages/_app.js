import SeoHead from "../components/SeoHead";
import { StoreProvider } from "../store";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider>
      <SeoHead />
      <Component {...pageProps} />
    </StoreProvider>
  );
};

export default MyApp;

import SeoHead from "../components/SeoHead";
import { StoreProvider } from "../store";

const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider>
      <SeoHead />
      <Component {...pageProps} />
    </StoreProvider>
  );
};

export default MyApp;

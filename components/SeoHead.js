import Head from "next/head";

const SeoHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.jpeg" />
      <link rel="apple-touch-icon" href="/favicon.jpeg" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default SeoHead;

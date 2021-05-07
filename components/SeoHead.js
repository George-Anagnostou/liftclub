import Head from "next/head";

const SeoHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.jpeg" />
      <link rel="apple-touch-icon" href="/favicon.jpeg" />
    </Head>
  );
};

export default SeoHead;

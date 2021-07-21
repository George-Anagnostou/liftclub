import Head from "next/head";

interface Props {
  title: string;
}

const SeoHead: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.jpeg" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default SeoHead;

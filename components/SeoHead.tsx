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

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,900;1,400&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};

export default SeoHead;

import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

import { Toaster } from "react-hot-toast";

const ConfigWrappers = dynamic(() => import("@/components/wrapper"), {
  ssr: false,
});

import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Akord TGA POC</title>
        <meta name="description" content={`Akord TGA POC`} />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:image" content={`https://akord.com/favicon.ico`} />
        <meta name="twitter:title" content={`Akord TGA POC`} />
        <meta name="twitter:url" content={`https://akord.com`}></meta>
        <meta name="twitter:description" content={`Akord TGA POC`} />

        <meta property="og:card" content="summary" />
        <meta property="og:image" content={`https://akord.com/favicon.ico`} />
        <meta property="og:title" content={`Akord TGA POC`} />
        <meta property="og:url" content={`https://akord.com/`} />
        <meta property="og:description" content={`Akord TGA POC`} />
      </Head>
      <ConfigWrappers>
        <Component {...pageProps} />
        <Toaster />
      </ConfigWrappers>
    </>
  );
}

export default MyApp;

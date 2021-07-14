import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../src/utils/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css"
          rel="stylesheet"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
export default MyApp;

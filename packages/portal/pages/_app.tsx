import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

import "../styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../src/utils/firebase";
import muiTheme from "../src/muiTheme";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css"
          rel="stylesheet"
        />
      </Head>

      {/* https://material-ui.com/guides/interoperability/#controlling-priority-3 */}
      <StylesProvider injectFirst={true}>
        <MuiThemeProvider theme={muiTheme}>
          <Component {...pageProps} />
        </MuiThemeProvider>
      </StylesProvider>
    </>
  );
}
export default MyApp;

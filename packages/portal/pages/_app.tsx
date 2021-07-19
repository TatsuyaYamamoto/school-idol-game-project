import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

import "../styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "tippy.js/dist/tippy.css";

import "../src/utils/firebase";
import "../src/utils/i18n";

import muiTheme from "../src/muiTheme";
import useQuery from "../src/components/hooks/useQuery";
import { pageview } from "../src/utils/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { value: hostLanguageQueryValue } = useQuery("hl", [
    "ja",
    "en",
  ] as const);

  useEffect(() => {
    // https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  useEffect(() => {
    const language = hostLanguageQueryValue || "ja";
    i18n.changeLanguage(language);
  }, [i18n, hostLanguageQueryValue]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
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

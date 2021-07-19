import Document, { Html, Head, Main, NextScript } from "next/document";

import { ServerStyleSheet as StyledComponentsSheet } from "styled-components";
import { ServerStyleSheets as MaterialServerStyleSheets } from "@material-ui/core/styles";

import { GA_TRACKING_ID } from "../src/utils/gtag";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {process.env.APP_ENV !== "pro" && (
            <meta name="robots" content="noindex" />
          )}

          <link
            href="https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css"
            rel="stylesheet"
          />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {/* https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/**
 * https://github.com/mui-org/material-ui/blob/next/examples/nextjs-with-typescript/pages/_document.tsx
 */
MyDocument.getInitialProps = async (ctx) => {
  const styledComponentsSheet = new StyledComponentsSheet();
  const materialUiSheets = new MaterialServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentsSheet.collectStyles(
            materialUiSheets.collect(<App {...props} />)
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {materialUiSheets.getStyleElement()}
          {styledComponentsSheet.getStyleElement()}
          {initialProps.styles}
        </>
      ),
    };
  } finally {
    styledComponentsSheet.seal();
  }
};

export default MyDocument;

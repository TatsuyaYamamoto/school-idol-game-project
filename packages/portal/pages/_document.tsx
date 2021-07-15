import Document from "next/document";
import { ServerStyleSheet as StyledComponentsSheet } from "styled-components";
import { ServerStyleSheets as MaterialServerStyleSheets } from "@material-ui/core/styles";

class MyDocument extends Document {}

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

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const white = `#ffffff`;
export const mainOrange = `#f57c00`;

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: mainOrange
    },
    secondary: {
      main: mainOrange
    }
  }
});

export default theme;

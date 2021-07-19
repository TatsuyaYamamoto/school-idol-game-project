import { createTheme } from "@material-ui/core/styles";

export const white = `#ffffff`;
export const mainOrange = `#f57c00`;

const theme = createTheme({
  palette: {
    primary: {
      main: mainOrange,
    },
    secondary: {
      main: mainOrange,
    },
  },
});

export default theme;

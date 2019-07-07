import * as React from "react";

import Typography from "@material-ui/core/Typography";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";

import { white } from "../../muiTheme";

const styles = {
  root: {
    backgroundColor: white,
    fontFamily: "PixelMplus"
  }
};

const AppTitle: React.SFC<WithStyles> = prop => (
  <Typography variant="h6" className={prop.classes.root}>
    そこんところ工房ゲームズ ポータル
  </Typography>
);

export default withStyles(styles)(AppTitle);

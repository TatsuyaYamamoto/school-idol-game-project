import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TranslateIcon from "@material-ui/icons/Translate";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";

import AppTitle from "../atoms/AppTitle";
import { white } from "../../muiTheme";

const Root = styled.div``;

interface Props {
  currentPath: string;
  onTabChanged: (page: "ranking" | "help") => void;
  onTranslate: () => void;
}

interface State {
  tabIndex: any;
}

const HeaderSpace = styled.div`
  flex-grow: 1;
`;

const styles = {
  root: {
    backgroundColor: white
  }
};

@AutoBind
class AppBar extends React.Component<Props & WithStyles, State> {
  constructor(props: any) {
    super(props);

    const { currentPath } = this.props;
    let tabIndex = 0;
    if (currentPath.indexOf("help") !== -1) {
      tabIndex = 1;
    }

    this.state = {
      tabIndex
    };
  }

  public render() {
    const { tabIndex } = this.state;
    return (
      <Root>
        <MuiAppBar position="static" className={this.props.classes.root}>
          <Toolbar>
            <AppTitle />

            <HeaderSpace />

            {/*<Button variant="contained" size="small">*/}
            {/*<TwitterIcon />*/}
            {/*ログイン*/}
            {/*</Button>*/}

            <IconButton onClick={this.handleTranslate}>
              <TranslateIcon />
            </IconButton>
          </Toolbar>
          <Tabs value={tabIndex} onChange={this.handleTab} centered={true}>
            <Tab label="ランキング" />
            <Tab label="ヘルプ" />
          </Tabs>
        </MuiAppBar>
      </Root>
    );
  }

  private handleTab(_event: any, tabIndex: any) {
    this.setState({ tabIndex });
    this.props.onTabChanged(tabIndex === 0 ? "ranking" : "help");
  }

  private handleTranslate(_event: any) {
    this.props.onTranslate();
  }
}

export default withStyles(styles)(AppBar);

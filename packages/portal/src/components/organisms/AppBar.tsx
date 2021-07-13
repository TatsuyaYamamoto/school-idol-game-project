import { FC, useState } from "react";
import styled from "styled-components";

import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TranslateIcon from "@material-ui/icons/Translate";

import AppTitle from "../atoms/AppTitle";

const Root = styled.div``;

const StyledMuiAppBar = styled(MuiAppBar)`
  background-color: #ffffff;
`;

interface AppBarProps {
  currentPath: string;
  onTabChanged: (page: "ranking" | "help") => void;
  onTranslate: () => void;
}

const HeaderSpace = styled.div`
  flex-grow: 1;
`;

const styles = {
  root: {
    backgroundColor: "white",
  },
};

const AppBar: FC<AppBarProps> = (props) => {
  const [tabIndex] = useState(0);

  const handleTab = (_event: any, tabIndex: any) => {
    this.setState({ tabIndex });
    this.props.onTabChanged(tabIndex === 0 ? "ranking" : "help");
  };

  const handleTranslate = (_event: any) => {
    this.props.onTranslate();
  };

  return (
    <Root>
      <StyledMuiAppBar position="static">
        <Toolbar>
          <AppTitle />

          <HeaderSpace />

          <IconButton onClick={handleTranslate}>
            <TranslateIcon />
          </IconButton>
        </Toolbar>
        <Tabs value={tabIndex} onChange={handleTab} centered={true}>
          <Tab label="ランキング" />
          <Tab label="ヘルプ" />
        </Tabs>
      </StyledMuiAppBar>
    </Root>
  );
};

export default AppBar;

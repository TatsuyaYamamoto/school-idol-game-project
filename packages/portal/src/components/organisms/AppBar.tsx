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

const HeaderSpace = styled.div`
  flex-grow: 1;
`;

interface AppBarProps {
  tab: "ranking" | "help";
  language: "ja" | "en";
  onTabChanged: (tab: "ranking" | "help") => void;
  onTranslate: (locale: "ja" | "en") => void;
}

const AppBar: FC<AppBarProps> = (props) => {
  const handleTab = (_event: any, newValue: "ranking" | "help") => {
    props.onTabChanged(newValue);
  };

  const handleTranslate = (_event: any) => {
    if (props.language === "ja") {
      props.onTranslate("en");
      return;
    }
    props.onTranslate("ja");
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
        <Tabs value={props.tab} onChange={handleTab} centered={true}>
          <Tab label="ランキング" value="ranking" />
          <Tab label="ヘルプ" value="help" />
        </Tabs>
      </StyledMuiAppBar>
    </Root>
  );
};

export default AppBar;

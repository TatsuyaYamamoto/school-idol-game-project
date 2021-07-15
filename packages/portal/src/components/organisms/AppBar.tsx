import { FC, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from "@material-ui/core";
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
  onTabChanged: (tab: "ranking" | "help") => void;
}

const AppBar: FC<AppBarProps> = (props) => {
  const { tab, onTabChanged } = props;
  const router = useRouter();
  const [
    translateAnchorEl,
    setTranslateAnchorEl,
  ] = useState<null | HTMLElement>(null);

  const handleTab = (_event: any, newValue: "ranking" | "help") => {
    onTabChanged(newValue);
  };

  const onClickTranslateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTranslateAnchorEl(e.currentTarget);
  };

  const handleCloseTranslateButton = () => {
    setTranslateAnchorEl(null);
  };

  const onClickTranslateLanguage = (lang: "ja" | "en") => () => {
    setTranslateAnchorEl(null);
    router.push({ query: { hl: lang } });
  };

  return (
    <>
      <Root>
        <StyledMuiAppBar position="static">
          <Toolbar>
            <AppTitle />

            <HeaderSpace />

            <IconButton onClick={onClickTranslateButton}>
              <TranslateIcon />
            </IconButton>
          </Toolbar>
          <Tabs value={tab} onChange={handleTab} centered={true}>
            <Tab label="ランキング" value="ranking" />
            <Tab label="ヘルプ" value="help" />
          </Tabs>
        </StyledMuiAppBar>
      </Root>
      <Menu
        anchorEl={translateAnchorEl}
        keepMounted
        open={Boolean(translateAnchorEl)}
        onClose={handleCloseTranslateButton}
      >
        <MenuItem onClick={onClickTranslateLanguage("ja")}>日本語</MenuItem>
        <MenuItem onClick={onClickTranslateLanguage("en")}>English</MenuItem>
      </Menu>
    </>
  );
};

export default AppBar;

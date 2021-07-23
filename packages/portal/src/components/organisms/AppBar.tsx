import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
import WebsiteIcon from "@material-ui/icons/Home";

import AppTitle from "../atoms/AppTitle";
import { useTranslation } from "react-i18next";
import { SOKONTOKORO_FACTORY_WEBSITE_URL } from "../../utils/constants";

const StyledMuiAppBar = styled(MuiAppBar)`
  background-color: #ffffff;

  position: sticky;
  top: -${(props) => props.theme.mui.mixins.toolbar.minHeight}px;
`;

const HeaderSpace = styled.div`
  flex-grow: 1;
`;

interface AppBarProps {
  tab: "game-list" | "ranking" | "help";
}

const AppBar: FC<AppBarProps> = (props) => {
  const { tab } = props;
  const router = useRouter();
  const [
    translateAnchorEl,
    setTranslateAnchorEl,
  ] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const handleTab = (_event: any, newValue: "ranking" | "help") => {
    router.push({ pathname: `/portal/${newValue}`, query: router.query });
  };

  const onClickTranslateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTranslateAnchorEl(e.currentTarget);
  };

  const handleCloseTranslateButton = () => {
    setTranslateAnchorEl(null);
  };

  const onClickTranslateLanguage = (lang: "ja" | "en") => () => {
    setTranslateAnchorEl(null);
    router.push({ query: { ...router.query, hl: lang } });
  };

  return (
    <>
      <StyledMuiAppBar position="static">
        <Toolbar>
          <Link href="/">
            <a>
              <AppTitle />
            </a>
          </Link>

          <HeaderSpace />

          <IconButton href={SOKONTOKORO_FACTORY_WEBSITE_URL}>
            <WebsiteIcon />
          </IconButton>
          <IconButton onClick={onClickTranslateButton}>
            <TranslateIcon />
          </IconButton>
        </Toolbar>
        <Tabs value={tab} onChange={handleTab} centered={true}>
          <Tab label={t(`tabs.game_list`)} value="game-list" />
          <Tab label={t(`tabs.ranking`)} value="ranking" />
          <Tab label={t(`tabs.help`)} value="help" />
        </Tabs>
      </StyledMuiAppBar>
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

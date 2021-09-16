import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { ImageList, ImageListItem, ImageListItemBar } from "@material-ui/core";

import GameLinkCard from "./GameLinkCard";
import { GA_QUERY_FROM_APP_LIST } from "../../utils/constants";

const Root = styled.div`
  margin: 50px 0;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
`;

const StyledImageList = styled(ImageList)`
  width: 500px;
`;

const StyledImageListItem = styled(ImageListItem)``;

const StyledImageListItemBar = styled(ImageListItemBar)`
  height: unset;
  .MuiImageListItemBar-titleWrap {
    margin: 16px;
  }
  .MuiImageListItemBar-title {
    white-space: unset;
  }
`;

const data = [
  {
    id: "review-lovelive-cyber-security",
    cols: 2,
    rows: 1,
    videoUrl: "",
    imageUrl: "https://review-lovelive-cyber-security.t28.dev/images/ogp.png",
    appUrl: `https://review-lovelive-cyber-security.t28.dev?${GA_QUERY_FROM_APP_LIST}`,
  },
  {
    id: "replica-ticket",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://replica-ticket.web.app/images/ogp.jpg",
    appUrl: `https://replica-ticket.web.app/?${GA_QUERY_FROM_APP_LIST}`,
  },
  {
    id: "cyazalea-kiss-calc",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://cyazalea-kiss-calc.web.app/ogp.jpg",
    appUrl: `https://cyazalea-kiss-calc.web.app?${GA_QUERY_FROM_APP_LIST}`,
  },
  {
    id: "nijigasaki-school",
    cols: 2,
    rows: 1,
    videoUrl: "",
    imageUrl: "https://nijigasaki-school.web.app/ogp.jpg",
    appUrl: `https://nijigasaki-school.web.app/?${GA_QUERY_FROM_APP_LIST}`,
  },
] as const;

const GameList = () => {
  const { t } = useTranslation();
  const [openLinkCardGameId, setLinkCardGameId] = useState<string | null>(null);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

  const onClickGame = (gameId: string) => () => {
    setLinkCardGameId(gameId);
  };
  const onCloseGameLinkCard = () => {
    setLinkCardGameId(null);
  };
  const onEnterImage = (id: string) => () => {
    setHoveredGameId(id);
  };
  const onEnterLeave = () => () => {
    setHoveredGameId(null);
  };

  return (
    <>
      <Root>
        <StyledImageList rowHeight={160}>
          {data.map((item) => (
            <StyledImageListItem
              key={item.id}
              cols={item.cols}
              rows={item.rows}
              onClick={onClickGame(item.id)}
              onMouseEnter={onEnterImage(item.id)}
              onMouseLeave={onEnterLeave()}
            >
              <img src={item.imageUrl} alt={t(`apps.${item.id}.title`)} />
              {item.id === hoveredGameId && (
                <StyledImageListItemBar title={t(`apps.${item.id}.title`)} />
              )}
            </StyledImageListItem>
          ))}
        </StyledImageList>
      </Root>

      {data.map((item) => (
        <GameLinkCard
          key={item.id}
          open={item.id === openLinkCardGameId}
          title={t(`apps.${item.id}.title`)}
          description={t(`apps.${item.id}.description`)}
          gameUrl={item.appUrl}
          imageUrl={item.imageUrl}
          onClose={onCloseGameLinkCard}
        />
      ))}
    </>
  );
};
export default GameList;

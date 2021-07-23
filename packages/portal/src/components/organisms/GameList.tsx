import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { ImageList, ImageListItem, ImageListItemBar } from "@material-ui/core";

import GameLinkCard from "./GameLinkCard";
import { GA_QUERY_FROM_GAME_LIST } from "../../utils/constants";

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
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://review-lovelive-cyber-security.t28.dev/images/ogp.png",
    gameUrl: `https://review-lovelive-cyber-security.t28.dev?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "rinadoko",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl:
      "https://games.sokontokoro-factory.net/rinadoko/assets/images/ogp.jpg",
    gameUrl: `https://games.sokontokoro-factory.net/rinadoko?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "oimo-no-mikiri",
    cols: 2,
    rows: 1,
    videoUrl: "",
    imageUrl: `https://pbs.twimg.com/media/DRNzFMqU8AAdqDb.jpg`,
    gameUrl: `https://games.sokontokoro-factory.net/oimo?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "yamidori",
    cols: 2,
    rows: 1,
    videoUrl: "",
    imageUrl: "https://pbs.twimg.com/media/DJdHP7-VYAEeZLb.jpg",
    gameUrl: `https://games.sokontokoro-factory.net/yamidori?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "maruten",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://pbs.twimg.com/media/CsmUpAeUkAAgyGh.jpg",
    gameUrl: `https://games.sokontokoro-factory.net/maruten?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "shakarin",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://pbs.twimg.com/media/CXmsUq2UsAEYh6h.jpg",
    gameUrl: `https://games.sokontokoro-factory.net/shakarin?${GA_QUERY_FROM_GAME_LIST}`,
  },
  {
    id: "honocar",
    cols: 1,
    rows: 2,
    videoUrl: "",
    imageUrl: "https://pbs.twimg.com/media/CJYd0RHUYAAUpPv.jpg",
    gameUrl: `https://games.sokontokoro-factory.net/honocar?${GA_QUERY_FROM_GAME_LIST}`,
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
              <img src={item.imageUrl} alt={t(`games.${item.id}.title`)} />
              {item.id === hoveredGameId && (
                <StyledImageListItemBar title={t(`games.${item.id}.title`)} />
              )}
            </StyledImageListItem>
          ))}
        </StyledImageList>
      </Root>

      {data.map((item) => (
        <GameLinkCard
          key={item.id}
          open={item.id === openLinkCardGameId}
          title={t(`games.${item.id}.title`)}
          description={t(`games.${item.id}.description`)}
          gameUrl={item.gameUrl}
          imageUrl={item.imageUrl}
          onClose={onCloseGameLinkCard}
        />
      ))}
    </>
  );
};
export default GameList;

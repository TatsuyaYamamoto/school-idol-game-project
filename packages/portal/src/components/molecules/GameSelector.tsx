import { FC, useRef } from "react";
import Slider, { Settings, CustomArrowProps } from "react-slick";
import styled from "styled-components";

import { GAMES, Game } from "../../utils/tmp_mikan";

import Arrow from "../atoms/GameSelectArrow";
import GameSelectorItem from "./GameSelectorItem";
import { useTranslation } from "react-i18next";

const Root = styled.div`
  max-width: 500px;
  margin: 0px auto;
  padding: 30px;
`;

const NextArrow: FC<CustomArrowProps> = (props) => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

const PrevArrow: FC<CustomArrowProps> = (props) => {
  return (
    <Arrow
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    />
  );
};

interface GameSelectorProps {
  game: Game;
  slickSettings: Settings;
  onSelected: (index: number) => void;
}

const GameSelector: FC<GameSelectorProps> = (props) => {
  // TODO support ranking system yamidori, oimo!
  const games: Game[] = ["honocar", "shakarin", "maruten"];

  const { game, slickSettings } = props;
  const slickRef = useRef<Slider>(null);
  const pendingIdOfOnSelected = useRef<null | number>(null);
  const initialSelectorIndex = games.findIndex((id) => id === game);
  const beforeIndex = useRef(0);
  const { i18n } = useTranslation();

  const beforeChange = (current: number, next: number) => {
    if (beforeIndex.current === next) {
      return;
    }

    beforeIndex.current = next;

    if (pendingIdOfOnSelected.current) {
      clearTimeout(pendingIdOfOnSelected.current);
    }

    pendingIdOfOnSelected.current = window.setTimeout(() => {
      props.onSelected(next);
    }, 500);
  };

  const settings: Settings = {
    infinite: false,
    initialSlide: initialSelectorIndex,
    dots: true,
    arrows: true,
    beforeChange,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    ...slickSettings,
  };

  return (
    <Root>
      <Slider ref={slickRef} {...settings}>
        {games.map((game) => (
          <GameSelectorItem
            key={GAMES[game].url}
            title={GAMES[game].name[i18n.language as "ja" | "en"]}
            imageUrl={GAMES[game].imageUrl}
          />
        ))}
      </Slider>
    </Root>
  );
};

export default GameSelector;

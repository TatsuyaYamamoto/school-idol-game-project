import { FC, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Slider, { CustomArrowProps, Settings } from "react-slick";

import { Button } from "@material-ui/core";

import GameSelectorItem from "../molecules/GameSelectorItem";
import Arrow from "../atoms/GameSelectArrow";
import { Game, GAMES } from "../../utils/tmp_mikan";
import { GA_QUERY_FROM_RANKING } from "../../utils/constants";

const Root = styled.div`
  margin: 50px 0;
  text-align: center;
`;

const GameSelector = styled.div`
  max-width: 500px;
  margin: 0 auto;
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

interface ControlSectionProps {
  game: Game;
  onGameSelected: (index: number) => void;
}

const ControlSection: FC<ControlSectionProps> = (props) => {
  // TODO support ranking system yamidori, oimo!
  const games: Game[] = ["honocar", "shakarin", "maruten"];

  const { game, onGameSelected } = props;
  const { t, i18n } = useTranslation();
  const slickRef = useRef<Slider>(null);
  const initialSelectorIndex = games.findIndex((id) => id === game);

  const afterChange = (currentSlide: number) => {
    onGameSelected(currentSlide);
  };

  const slickSettings: Settings = {
    infinite: false,
    initialSlide: initialSelectorIndex,
    dots: true,
    arrows: true,
    afterChange,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Root>
      <GameSelector>
        <Slider ref={slickRef} {...slickSettings}>
          {games.map((game) => (
            <GameSelectorItem
              key={GAMES[game].url}
              title={GAMES[game].name[i18n.language as "ja" | "en"]}
              imageUrl={GAMES[game].imageUrl}
            />
          ))}
        </Slider>
      </GameSelector>

      <Button
        variant="outlined"
        color="primary"
        href={`${GAMES[game].url}?${GA_QUERY_FROM_RANKING}`}
      >
        {t(`jump_to_game`)}
      </Button>
    </Root>
  );
};

export default ControlSection;

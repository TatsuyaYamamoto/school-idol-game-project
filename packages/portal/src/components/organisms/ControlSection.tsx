import { FC } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Button } from "@material-ui/core";

import { Game } from "../../utils/tmp_mikan";
import GameSelector from "../molecules/GameSelector";

const Root = styled.div`
  margin: 50px 0;
  text-align: center;
`;

interface ControlSectionProps {
  game: Game;
  onGameSelected: (index: number) => void;
  onJumpGame: (e: any) => void;
}

const ControlSection: FC<ControlSectionProps> = (props) => {
  const { game, onGameSelected, onJumpGame } = props;
  const { t } = useTranslation();

  return (
    <Root>
      <GameSelector
        game={game}
        slickSettings={{}}
        onSelected={onGameSelected}
      />

      <Button onClick={onJumpGame} variant="outlined" color="primary">
        {t(`jump_to_game`)}
      </Button>
    </Root>
  );
};

export default ControlSection;

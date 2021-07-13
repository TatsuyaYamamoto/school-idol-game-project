import { FC } from "react";
import styled from "styled-components";
import { Game } from "../../utils/tmp_mikan";

import GameSelector from "../molecules/GameSelector";
import JumpGameButton from "../atoms/JumpGameButton";

const Root = styled.div`
  margin: 50px 0;
`;

interface ControlSectionProps {
  game: Game;
  onGameSelected: (index: number) => void;
  onJumpGame: (e: any) => void;
}

const ControlSection: FC<ControlSectionProps> = (props) => {
  const { game, onGameSelected, onJumpGame } = props;

  return (
    <Root>
      <GameSelector
        game={game}
        slickSettings={{}}
        onSelected={onGameSelected}
      />

      <JumpGameButton onClick={onJumpGame} />
    </Root>
  );
};

export default ControlSection;

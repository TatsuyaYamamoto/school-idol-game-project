import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";
import { Game } from "@sokontokoro/mikan";

import GameSelector from "../molecules/GameSelector";
import JumpGameButton from "../atoms/JumpGameButton";

const Root = styled.div`
  margin: 50px 0;
`;

interface Props {
  game: Game;
  onGameSelected: (index: number) => void;
  onJumpGame: (e: any) => void;
}

interface State {}

@AutoBind
export default class ControlSection extends React.Component<Props, State> {
  public render() {
    const { game, onGameSelected, onJumpGame } = this.props;

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
  }
}

import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import GameSelector from "../molecules/GameSelector";
import { list } from "../pages/Index";
import JumpGameButton from "../atoms/JumpGameButton";

const Root = styled.div`
  margin: 50px 0;
`;

interface Props {
  initialIndex: number;
  onGameSelected: (index: number) => void;
  onJumpGame: (e: any) => void;
}

interface State {}

@AutoBind
export default class ControlSection extends React.Component<Props, State> {
  public render() {
    const { initialIndex, onGameSelected, onJumpGame } = this.props;

    return (
      <Root>
        <GameSelector
          list={list}
          initialIndex={initialIndex}
          slickSettings={{}}
          onSelected={onGameSelected}
        />

        <JumpGameButton onClick={onJumpGame} />
      </Root>
    );
  }
}

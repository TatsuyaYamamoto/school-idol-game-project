import * as React from "react";
import AutoBind from "autobind-decorator";

import GameSelector from "../molecules/GameSelector";
import { list } from "../pages/Index";

interface Props {
  initialIndex: number;
  onGameSelected: (index: number) => void;
}

interface State {}

@AutoBind
export default class ControlSection extends React.Component<Props, State> {
  public render() {
    const { initialIndex, onGameSelected } = this.props;

    return (
      <React.Fragment>
        <GameSelector
          list={list}
          initialIndex={initialIndex}
          slickSettings={{}}
          onSelected={onGameSelected}
        />
      </React.Fragment>
    );
  }
}

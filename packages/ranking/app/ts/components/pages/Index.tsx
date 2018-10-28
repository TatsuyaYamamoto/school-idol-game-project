import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";
import { GAMES, Game, gameIds } from "@sokontokoro/mikan";

import { IndexRouteParams } from "../../App";
import HeaderSection from "../organisms/HeaderSection";
import ControlSection from "../organisms/ControlSection";
import RankingSection from "../organisms/RankingSection";
import FooterSection from "../organisms/FooterSection";

interface Props {}

interface State {
  game: Game;
}

@AutoBind
class Index extends React.Component<
  Props & RouteComponentProps<IndexRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const { game } = this.props.match.params;

    this.state = {
      game
    };
  }

  public render() {
    const { game } = this.state;

    return (
      <React.Fragment>
        <HeaderSection />
        <ControlSection
          game={game}
          onGameSelected={this.onGameSelected}
          onJumpGame={this.onJumpGame}
        />
        <RankingSection game={game} />
        <FooterSection />
      </React.Fragment>
    );
  }

  private onGameSelected(index: number) {
    this.props.history.replace(`/ranking/${gameIds[index]}`);

    this.setState({
      game: gameIds[index]
    });
  }

  private onJumpGame() {
    const { game } = this.props.match.params;
    location.href = GAMES[game].url;
  }
}

export default Index;

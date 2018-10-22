import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import { IndexRouteParams } from "../../App";
import HeaderSection from "../organisms/HeaderSection";
import ControlSection from "../organisms/ControlSection";
import RankingSection from "../organisms/RankingSection";
import FooterSection from "../organisms/FooterSection";

interface Props {}

interface State {
  initialIndex: number;
  game: string;
}

const domain =
  process.env.NODE_ENV === "production"
    ? "games.sokontokoro-factory.net"
    : "games-dev.sokontokoro-factory.net";

export const list = [
  {
    title: "ほのCar",
    gameId: "honocar",
    url: `https://${domain}/honocar/`,
    imageUrl: `http://${domain}/honocar/img/TITLE_LOGO_HONOKA.png`
  },
  {
    title: "しゃかりん",
    gameId: "shakarin",
    url: `https://${domain}/shakarin/`,
    imageUrl: `http://${domain}/shakarin/img/TITLE_LOGO.png`
  },
  {
    title: "まるてん",
    gameId: "maruten",
    url: `https://${domain}/maruten/`,
    imageUrl: `http://${domain}/maruten/img/TITLE_LOGO_HANAMARU.png`
  }
];

@AutoBind
class Index extends React.Component<
  Props & RouteComponentProps<IndexRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const initialIndex = list.findIndex(({ gameId }) => {
      return gameId === this.props.match.params.game;
    });

    this.state = {
      initialIndex,
      game: list[initialIndex].gameId
    };
  }

  public render() {
    const { initialIndex, game } = this.state;

    return (
      <React.Fragment>
        <HeaderSection />
        <ControlSection
          initialIndex={initialIndex}
          onGameSelected={this.onGameSelected}
          onJumpGame={this.onJumpGame}
        />
        <RankingSection game={game} />
        <FooterSection />
      </React.Fragment>
    );
  }

  private onGameSelected(index: number) {
    this.props.history.replace(`/ranking/${list[index].gameId}`);

    this.setState({
      game: list[index].gameId
    });
  }

  private onJumpGame() {
    const index = list.findIndex(({ gameId }) => {
      return gameId === this.props.match.params.game;
    });

    location.href = list[index].url;
  }
}

export default Index;

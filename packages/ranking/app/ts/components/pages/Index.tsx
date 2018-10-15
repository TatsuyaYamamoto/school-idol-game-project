import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import { initAuth } from "@sokontokoro/mikan";

import { IndexRouteParams } from "../../App";
import HeaderSection from "../organisms/HeaderSection";
import ControlSection from "../organisms/ControlSection";
import RankingSection from "../organisms/RankingSection";
import FooterSection from "../organisms/FooterSection";

interface Props {}

interface State {
  initialIndex: number;
  initialized: boolean;
  game: string;
}

export const list = [
  {
    title: "ほのCar",
    gameId: "honocar",
    url: "https://games.sokontokoro-factory.net/honocar/",
    imageUrl:
      "http://games.sokontokoro-factory.net/honocar/img/TITLE_LOGO_HONOKA.png"
  },
  {
    title: "しゃかりん",
    gameId: "shakarin",
    url: "https://games.sokontokoro-factory.net/shakarin/",
    imageUrl: "http://games.sokontokoro-factory.net/shakarin/img/TITLE_LOGO.png"
  },
  {
    title: "まるてん",
    gameId: "maruten",
    url: "https://games.sokontokoro-factory.net/maruten/",
    imageUrl:
      "http://games.sokontokoro-factory.net/maruten/img/TITLE_LOGO_HANAMARU.png"
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
      initialized: false,
      game: list[initialIndex].gameId
    };
  }

  public componentDidMount() {
    this.init();
  }

  public render() {
    const { initialized, initialIndex, game } = this.state;

    return (
      <React.Fragment>
        <HeaderSection />
        <ControlSection
          initialIndex={initialIndex}
          onGameSelected={this.onGameSelected}
          onJumpGame={this.onJumpGame}
        />
        <RankingSection initialized={initialized} game={game} />
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

  private async init() {
    await initAuth();
    this.setState({ initialized: true });
  }
}

export default Index;

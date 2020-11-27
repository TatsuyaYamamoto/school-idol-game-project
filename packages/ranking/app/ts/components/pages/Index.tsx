import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";
import { GAMES, Game, gameIds } from "@sokontokoro/mikan";

import { getLanguage, IndexRouteParams } from "../../App";
import ControlSection from "../organisms/ControlSection";
import RankingSection from "../organisms/RankingSection";
import FooterSection from "../organisms/FooterSection";
import AppBar from "../organisms/AppBar";

interface Props {
  language: "ja" | "en";
}

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
      game,
    };
  }

  public render() {
    const { game } = this.state;

    return (
      <React.Fragment>
        <AppBar
          currentPath={this.props.location.pathname}
          onTabChanged={this.onTabChanged}
          onTranslate={this.onTranslate}
        />

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

  private onTabChanged(page: "ranking" | "help") {
    const { search } = this.props.location;
    this.props.history.push(`/${page}`, {
      search,
    });
  }

  private onTranslate() {
    const language = getLanguage(this.props.location.search);
    const nextLanguage = language === "ja" ? "en" : "ja";
    const params = new URLSearchParams(this.props.location.search);
    params.set("language", nextLanguage);
    let search = "";
    params.forEach((value, key) => {
      search += `${key}=${value}`;
    });

    this.props.history.replace({
      ...this.props.location,
      search,
    });
  }

  private onGameSelected(index: number) {
    this.props.history.replace(`/ranking/${gameIds[index]}`);

    this.setState({
      game: gameIds[index],
    });
  }

  private onJumpGame() {
    const { game } = this.props.match.params;
    location.href = GAMES[game].url;
  }
}

export default Index;

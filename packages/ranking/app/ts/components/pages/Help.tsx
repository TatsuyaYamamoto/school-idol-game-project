import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";
import { GAMES, Game, gameIds } from "@sokontokoro/mikan";

import { HelpRouteParams, IndexRouteParams } from "../../App";
import HeaderSection from "../organisms/HeaderSection";
import ControlSection from "../organisms/ControlSection";
import RankingSection from "../organisms/RankingSection";
import FooterSection from "../organisms/FooterSection";

interface Props {}

interface State {
  language: "ja" | "en";
}

@AutoBind
class Help extends React.Component<
  Props & RouteComponentProps<HelpRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const { language } = this.props.match.params;

    this.state = {
      language
    };
  }

  public render() {
    return (
      <React.Fragment>
        <div>help!</div>
        <FooterSection />
      </React.Fragment>
    );
  }
}

export default Help;

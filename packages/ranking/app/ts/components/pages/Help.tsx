import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import { HelpRouteParams } from "../../App";

import HelpPanel from "../molecules/HelpPanel";

import AppBar from "../organisms/AppBar";
import FooterSection from "../organisms/FooterSection";

interface HelpDoc {
  id: string;
  title: string;
  tags: string[];
  body: string;
}

const helpsJson: {
  ja: HelpDoc[];
  en: HelpDoc[];
} = require("../../../assets/helps.json");

interface Props {}

interface State {
  language: "ja" | "en";
  expandedPanelId?: string;
}

@AutoBind
class Help extends React.Component<
  Props & RouteComponentProps<HelpRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const query = new URLSearchParams(this.props.location.search);
    let language = query.get("language");

    this.state = {
      language:
        !language || (language !== "ja" && language !== "en") ? "ja" : language
    };
  }

  public render() {
    const { language, expandedPanelId } = this.state;
    const helps = helpsJson[language];

    return (
      <React.Fragment>
        <AppBar
          currentPath={this.props.location.pathname}
          onTabChanged={this.onTabChanged}
          onTranslate={this.onTranslate}
        />

        {helps.map(({ id, title, body }) => (
          <HelpPanel
            key={id}
            title={title}
            body={body}
            expanded={id === expandedPanelId}
            onChange={(event, expanded) =>
              this.onPanelExpansionChanged(id, expanded)
            }
          />
        ))}

        <FooterSection />
      </React.Fragment>
    );
  }

  private onPanelExpansionChanged(helpPanelId: string, expanded: boolean) {
    this.setState({ expandedPanelId: expanded ? helpPanelId : undefined });
  }

  private onTabChanged(page: "ranking" | "help") {
    const { search } = this.props.location;
    this.props.history.push(`/${page}`, {
      search
    });
  }

  private onTranslate() {
    const currentLanguage = new URLSearchParams(this.props.location.search).get(
      "language"
    );

    const newLanguage =
      !currentLanguage || (currentLanguage !== "ja" && currentLanguage !== "en")
        ? "ja"
        : currentLanguage !== "ja"
          ? "en"
          : "ja";

    this.props.history.replace({
      search: `?language=${newLanguage}`
    });
  }
}

export default Help;

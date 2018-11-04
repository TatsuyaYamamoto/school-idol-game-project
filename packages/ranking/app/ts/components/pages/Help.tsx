import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import { getLanguage, HelpRouteParams } from "../../App";

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

interface Props {
  language: "ja" | "en";
}

interface State {
  expandedPanelId?: string;
}

@AutoBind
class Help extends React.Component<
  Props & RouteComponentProps<HelpRouteParams>,
  State
> {
  public constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render() {
    const { language } = this.props;
    const { expandedPanelId } = this.state;
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
    const language = getLanguage(this.props.location.search);
    const nextLanguage = language === "ja" ? "en" : "ja";
    const params = new URLSearchParams(this.props.location.search);
    params.set("language", nextLanguage);
    let search = "";
    params.forEach((value, key) => {
      search += `${key}=${value}`;
    });

    this.props.history.replace({
      pathname: this.props.location.pathname,
      search
    });
  }
}

export default Help;

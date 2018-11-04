import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import { getLanguage, HelpRouteParams } from "../../App";

import AppBar from "../organisms/AppBar";
import FooterSection from "../organisms/FooterSection";
import HelpList from "../organisms/HelpList";

interface Props {
  language: "ja" | "en";
}

interface State {}

@AutoBind
class Help extends React.Component<
  Props & RouteComponentProps<HelpRouteParams>,
  State
> {
  public render() {
    const { language } = this.props;

    return (
      <React.Fragment>
        <AppBar
          currentPath={this.props.location.pathname}
          onTabChanged={this.onTabChanged}
          onTranslate={this.onTranslate}
        />

        <HelpList language={language} />

        <FooterSection />
      </React.Fragment>
    );
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

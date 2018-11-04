import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import HelpPanel from "../molecules/HelpPanel";

const Root = styled.div`
  margin: 50px auto;
  max-width: 800px;
`;

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
export default class HelpList extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render() {
    const { language } = this.props;
    const { expandedPanelId } = this.state;
    const helps = helpsJson[language];

    return (
      <Root>
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
      </Root>
    );
  }

  private onPanelExpansionChanged(helpPanelId: string, expanded: boolean) {
    this.setState({ expandedPanelId: expanded ? helpPanelId : undefined });
  }
}

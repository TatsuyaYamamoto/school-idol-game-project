import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import HelpPanel from "../molecules/HelpPanel";
import GotItSnackBar from "../molecules/GotItSnackBar";
import NotGotItDialog from "../molecules/NotGotItDialog";

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
  showHelpDocId?: string;
  onChangeOpenedHelpDoc: (id: string | undefined) => void;
}

interface State {
  gotItSnackBarOpen: boolean;
  notGotItDialogOpen: boolean;
}

@AutoBind
export default class HelpList extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);

    this.state = {
      gotItSnackBarOpen: false,
      notGotItDialogOpen: false
    };
  }

  public render() {
    const { language, showHelpDocId } = this.props;
    const { gotItSnackBarOpen, notGotItDialogOpen } = this.state;
    const helps = helpsJson[language];

    return (
      <Root>
        {helps.map(({ id, title, body }) => (
          <HelpPanel
            key={id}
            title={title}
            body={body}
            language={language}
            expanded={id === showHelpDocId}
            onChange={(event, expanded) =>
              this.onPanelExpansionChanged(id, expanded)
            }
            onGotIt={() => this.onGotIt(id)}
            onNotGotIt={() => this.onNotGotIt(id)}
          />
        ))}

        <GotItSnackBar open={gotItSnackBarOpen} language={language} />

        <NotGotItDialog
          open={notGotItDialogOpen}
          handleClose={this.handleNotGotItDialog}
          language={language}
        />
      </Root>
    );
  }

  private onPanelExpansionChanged(helpPanelId: string, expanded: boolean) {
    this.props.onChangeOpenedHelpDoc(expanded ? helpPanelId : undefined);
  }

  private handleNotGotItDialog() {
    this.setState(state => ({
      notGotItDialogOpen: !state.notGotItDialogOpen
    }));
  }

  private onGotIt(id: string) {
    this.setState({ gotItSnackBarOpen: true });

    setTimeout(() => {
      this.setState({ gotItSnackBarOpen: false });
    }, 3000);
  }

  private onNotGotIt(id: string) {
    this.handleNotGotItDialog();
  }
}

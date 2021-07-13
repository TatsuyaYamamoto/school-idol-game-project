import * as React from "react";

import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import * as ReactMarkDown from "react-markdown";

interface Props {
  title: string;
  body: string;
  expanded: boolean;
  language: "ja" | "en";
  onChange: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
  onGotIt: () => void;
  onNotGotIt: () => void;
}

const HelpPanel: React.SFC<Props> = (props) => {
  const {
    title,
    body,
    expanded,
    language,
    onChange,
    onGotIt,
    onNotGotIt,
  } = props;
  const gotIt = language === "ja" ? "分かった！" : "Got it!";
  const notGotIt = language === "ja" ? "解決しない..." : "Not solved...";

  return (
    <ExpansionPanel expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: "block" }}>
        <ReactMarkDown source={body} />
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button size="small" onClick={onNotGotIt}>
          {notGotIt}
        </Button>
        <Button size="small" color="primary" onClick={onGotIt}>
          {gotIt}
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default HelpPanel;

import * as React from "react";
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const Root = styled.div``;

interface Props {
  title: string;
  body: string;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
}

const HelpPanel: React.SFC<Props> = props => {
  const { title, body, expanded, onChange } = props;

  return (
    <ExpansionPanel expanded={expanded} onChange={onChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>{body}</Typography>
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button size="small">わかんない</Button>
        <Button size="small" color="primary">
          わかった！
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default HelpPanel;

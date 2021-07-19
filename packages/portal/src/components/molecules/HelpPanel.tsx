import { FC } from "react";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import ReactMarkDown from "react-markdown";

interface HelpPanelProps {
  title: string;
  body: string;
  expanded: boolean;
  language: "ja" | "en";
  onChange: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
  onGotIt: () => void;
  onNotGotIt: () => void;
}

const HelpPanel: FC<HelpPanelProps> = (props) => {
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
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: "block" }}>
        <ReactMarkDown>{body}</ReactMarkDown>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" onClick={onNotGotIt}>
          {notGotIt}
        </Button>
        <Button size="small" color="primary" onClick={onGotIt}>
          {gotIt}
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default HelpPanel;

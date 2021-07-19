import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
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
} = require("../../../../help/helps.json");

interface HelpListProps {}

const HelpList: FC<HelpListProps> = (props) => {
  const { i18n } = useTranslation();
  const [showHelpDocId, setShowHelpDocId] = useState<string | null>(null);
  const [gotItSnackBarOpen, handleGotItSnackbar] = useState(false);
  const [notGotItDialogOpen, handleNotGotItDialog] = useState(false);

  const language = i18n.language as "ja" | "en";
  const helps = helpsJson[language];

  const onPanelExpansionChanged = (helpPanelId: string, expanded: boolean) => {
    setShowHelpDocId(expanded ? helpPanelId : null);
  };

  const onGotIt = (id: string) => {
    handleGotItSnackbar(true);

    setTimeout(() => {
      handleGotItSnackbar(false);
    }, 3000);
  };

  const onNotGotIt = (id: string) => {
    handleNotGotItDialog(true);
  };

  return (
    <Root>
      {helps.map(({ id, title, body }) => (
        <HelpPanel
          key={id}
          title={title}
          body={body}
          language={language}
          expanded={id === showHelpDocId}
          onChange={(_, expanded) => onPanelExpansionChanged(id, expanded)}
          onGotIt={() => onGotIt(id)}
          onNotGotIt={() => onNotGotIt(id)}
        />
      ))}

      <GotItSnackBar open={gotItSnackBarOpen} language={language} />

      <NotGotItDialog
        open={notGotItDialogOpen}
        handleClose={() => handleNotGotItDialog(false)}
        language={language}
      />
    </Root>
  );
};

export default HelpList;

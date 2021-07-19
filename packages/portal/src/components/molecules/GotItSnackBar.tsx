import { FC } from "react";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

interface GotItSnackBarProps {
  open: boolean;
  language: "ja" | "en";
}

const GotItSnackBar: FC<GotItSnackBarProps> = (props) => {
  const { open, language } = props;
  const message =
    language === "ja" ? "やったー！（・８・）" : "Yeah! （・８・）";

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
    >
      <SnackbarContent
        message={
          <span>
            <CheckCircleIcon />
            {message}
          </span>
        }
      />
    </Snackbar>
  );
};

export default GotItSnackBar;

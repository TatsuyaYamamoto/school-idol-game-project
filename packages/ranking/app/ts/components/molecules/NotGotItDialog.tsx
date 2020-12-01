import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

interface Props {
  open: boolean;
  language: "ja" | "en";
  handleClose: () => void;
}

const NotGotItDialog: React.SFC<Props> = (props) => {
  const { open, handleClose, language } = props;
  const text =
    language === "ja"
      ? "解決できず、すいません、、、。もしよろしければ、フォームからお問い合わせください。可能な限り対応させていただきます。"
      : "I'm sorry I couldn't be your help. Please contact us if you are OK.";
  const close = language === "ja" ? "とじる" : "Close";
  const form = language === "ja" ? "問い合わせる" : "Inquire";

  const goForm = () => {
    location.href =
      "https://docs.google.com/forms/d/e/1FAIpQLSe5bSPvJ5XQM0IACqZ9NKoHuRUAcC_V1an16JGwHh6HeGd-oQ/viewform";
  };

  return (
    <Dialog open={open} aria-labelledby="responsive-dialog-title">
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {close}
        </Button>
        <Button onClick={goForm} color="primary" autoFocus>
          {form}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotGotItDialog;

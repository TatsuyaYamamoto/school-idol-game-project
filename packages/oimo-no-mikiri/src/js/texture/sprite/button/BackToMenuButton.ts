import { loadTexture } from "@sokontokoro/mikan";
import Button from "../../internal/Button";

import { Ids } from "../../../resources/image";

class BackToMenuButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_MENU_BACK_TO_MENU));
  }
}

export default BackToMenuButton;

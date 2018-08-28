import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class BackToMenuButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_MENU_BACK_TO_MENU));
  }
}

export default BackToMenuButton;

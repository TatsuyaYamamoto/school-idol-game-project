import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class CreditButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_MENU_CREDIT));
  }
}

export default CreditButton;

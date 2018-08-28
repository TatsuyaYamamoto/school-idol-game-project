import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class NoviceLevelButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_LEVEL_NOVICE));
  }
}

export default NoviceLevelButton;

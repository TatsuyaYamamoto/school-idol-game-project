import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class RestartButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GAMEOVER_RESTART));
  }
}

export default RestartButton;

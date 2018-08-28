import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class BeginnerLevelButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_LEVEL_BEGINNER));
  }
}

export default BeginnerLevelButton;

import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class BackToMenuButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_BACK_MENU));
  }
}

export default BackToMenuButton;

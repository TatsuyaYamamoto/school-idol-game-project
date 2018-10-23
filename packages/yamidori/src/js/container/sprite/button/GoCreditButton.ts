import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GoCreditButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_CREDIT));
  }
}

export default GoCreditButton;

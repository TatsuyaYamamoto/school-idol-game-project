import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class SoundButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_SOUND));
  }
}

export default SoundButton;

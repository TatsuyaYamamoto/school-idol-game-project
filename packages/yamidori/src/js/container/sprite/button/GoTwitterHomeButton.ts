import Button from "./Button";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

class GoTwitterHomeButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GO_TWITTER_HOME));
  }
}

export default GoTwitterHomeButton;

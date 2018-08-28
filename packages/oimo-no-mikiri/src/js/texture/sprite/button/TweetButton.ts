import Button from "../../internal/Button";

import { loadTexture } from "@sokontokoro/mikan";

import { Ids } from "../../../resources/image";

class TweetButton extends Button {
  constructor() {
    super(loadTexture(Ids.BUTTON_GAMEOVER_TWEET));
  }
}

export default TweetButton;

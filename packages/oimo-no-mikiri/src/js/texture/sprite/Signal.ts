import Sprite from "../internal/Sprite";

import { loadTexture } from "mikan";

import { Ids } from "../../resources/image";

/**
 * @class
 */
class Signal extends Sprite {
  public constructor() {
    super(loadTexture(Ids.SIGNAL));
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}

export default Signal;

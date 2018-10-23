import { Sprite } from "pixi.js";

import { loadTexture } from "../../../framework/AssetLoader";

import { Ids } from "../../../resources/image";

/**
 * @class
 */
class MenuBackground extends Sprite {
  public constructor() {
    super(loadTexture(Ids.BACKGROUND_MENU));
  }
}

export default MenuBackground;

/* eslint-disable max-classes-per-file */
import { Sprite, extras, Container } from "pixi.js";

import { loadTexture, loadFrames } from "@sokontokoro/mikan";

import AnimatedSprite from "../internal/AnimatedSprite";
import { Ids } from "../../resources/image";

const CLOUD_SPEED = 0.01;

class CloudLayer extends extras.TilingSprite {
  public constructor() {
    super(loadTexture(Ids.BACKGROUND_CLOUD), 1400, 129);
    this.anchor.set(0.5, 0);
  }
}

class SkyLayer extends Sprite {
  public constructor() {
    super(loadTexture(Ids.BACKGROUND_SKY));
    this.anchor.set(0.5);
  }
}

class BeachLayer extends AnimatedSprite {
  public constructor() {
    const frames = loadFrames(Ids.BACKGROUND_BEACH);

    const alternateFrames = [].concat(frames).concat(frames.reverse());

    super(alternateFrames);

    this.animationSpeed = 0.03;
  }
}

/**
 * @class
 */
class BackGround extends Container {
  readonly _skyLayer: SkyLayer;

  readonly _cloudLayer: CloudLayer;

  readonly _beachLayer: BeachLayer;

  public constructor() {
    super();

    this._skyLayer = new SkyLayer();
    this._cloudLayer = new CloudLayer();
    this._cloudLayer.position.set(0, -100);

    this._beachLayer = new BeachLayer();
    this._beachLayer.play();

    this.addChild(this._skyLayer, this._cloudLayer, this._beachLayer);

    this._cloudLayer.position.y = -1 * this.height * 0.5;

    // This background is set in some {@link ViewContainer}s.
    // Because of that, calculate first cloud position not to be difference for each.
    this._cloudLayer.tilePosition.x =
      (Date.now() * CLOUD_SPEED) % this._cloudLayer.width;
  }

  progress(elapsedMS: number): void {
    this._cloudLayer.tilePosition.x += elapsedMS * CLOUD_SPEED;
  }
}

export default BackGround;

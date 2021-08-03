import * as PIXI from "pixi-v6";
import { randomInt } from "../helper/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RhythmTarget extends PIXI.Sprite, PIXI.utils.EventEmitter {}

export class RhythmTarget extends PIXI.Sprite {
  private _state: "normal" | "ng" = "normal";

  public get state(): "normal" | "ng" {
    return this._state;
  }

  public constructor(
    private params: {
      normalTexture: PIXI.Texture;
      touchedTexture: PIXI.Texture;
      ngTextures: PIXI.Texture[];
    }
  ) {
    super(params.normalTexture);
    this.anchor.set(0.5);
    this.interactive = true;
    this.visible = false;
  }

  show(state: "normal" | "ng"): void {
    if (state === "normal") {
      this.texture = this.params.normalTexture;
    }
    if (state === "ng") {
      const ngTextureSize = this.params.ngTextures.length;
      const randomIndex = randomInt(ngTextureSize);
      this.texture = this.params.ngTextures[randomIndex];
    }

    this._state = state;
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  touch(): void {
    if (this.state === "normal") {
      this.texture = this.params.touchedTexture;
    }
  }
}

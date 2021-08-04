import * as PIXI from "pixi-v6";
import { randomInt } from "../helper/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RhythmTarget extends PIXI.Sprite, PIXI.utils.EventEmitter {}

export class RhythmTarget extends PIXI.Sprite {
  private _state: "normal" | "ng" = "normal";

  private isPlayingSuccessAnimation = false;

  public get state(): "normal" | "ng" {
    return this._state;
  }

  public get tappable(): boolean {
    return (
      this.state === "normal" && this.visible && !this.isPlayingSuccessAnimation
    );
  }

  public constructor(
    private params: {
      normalTexture: PIXI.Texture;
      touchedTextures: PIXI.Texture[];
      ngTextures: PIXI.Texture[];
    }
  ) {
    super(params.normalTexture);
    this.anchor.set(0.5);
    this.interactive = true;
    this.visible = false;
  }

  show(state: "normal" | "ng"): void {
    this.isPlayingSuccessAnimation = false;
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

  showSuccessAnimation(): void {
    this.isPlayingSuccessAnimation = true;
    const touchedTextureSize = this.params.touchedTextures.length;
    const randomIndex = randomInt(touchedTextureSize);
    this.texture = this.params.touchedTextures[randomIndex];
  }
}

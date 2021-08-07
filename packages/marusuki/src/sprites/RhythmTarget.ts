import * as PIXI from "pixi-v6";
import { randomInt } from "../helper/utils";
import { SpriteMap } from "../helper/loader";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RhythmTarget extends PIXI.Sprite, PIXI.utils.EventEmitter {}

export class RhythmTarget extends PIXI.Sprite {
  private _state: "normal" | "ng" = "normal";

  private isPlayingSuccessAnimation = false;

  private normalTexture: PIXI.Texture;

  private touchedTextures: PIXI.Texture[];

  private ngTextures: PIXI.Texture[];

  public get state(): "normal" | "ng" {
    return this._state;
  }

  public get tappable(): boolean {
    return (
      this.state === "normal" && this.visible && !this.isPlayingSuccessAnimation
    );
  }

  public constructor(params: { spriteMap: SpriteMap }) {
    super();

    this.normalTexture = params.spriteMap.touch_target_ok_takoyaki_1
      .texture as PIXI.Texture;
    this.touchedTextures = [
      params.spriteMap.touch_target_effect_blue.texture as PIXI.Texture,
      params.spriteMap.touch_target_effect_green.texture as PIXI.Texture,
      params.spriteMap.touch_target_effect_orange.texture as PIXI.Texture,
      params.spriteMap.touch_target_effect_pink.texture as PIXI.Texture,
      params.spriteMap.touch_target_effect_skyblue.texture as PIXI.Texture,
    ];
    this.ngTextures = [
      params.spriteMap.touch_target_ng_piman_1.texture as PIXI.Texture,
      params.spriteMap.touch_target_ng_piman_2.texture as PIXI.Texture,
    ];

    this.texture = this.normalTexture;
    this.anchor.set(0.5);
    this.interactive = true;
    this.visible = false;
  }

  show(state: "normal" | "ng"): void {
    if (state === "normal") {
      this.texture = this.normalTexture;
    }
    if (state === "ng") {
      const randomIndex = randomInt(this.ngTextures.length - 1);
      this.texture = this.ngTextures[randomIndex];
    }
    this.isPlayingSuccessAnimation = false;
    this._state = state;
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  showSuccessAnimation(): void {
    this.isPlayingSuccessAnimation = true;
    const randomIndex = randomInt(this.touchedTextures.length - 1);
    this.texture = this.touchedTextures[randomIndex];
  }
}

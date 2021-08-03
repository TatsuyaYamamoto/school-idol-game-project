import * as PIXI from "pixi-v6";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RhythmTarget extends PIXI.Sprite, PIXI.utils.EventEmitter {}

export class RhythmTarget extends PIXI.Sprite {
  private _state: "normal" | "ng" = "normal";

  public get state(): "normal" | "ng" {
    return this._state;
  }

  public constructor(
    private textures: {
      normal: PIXI.Texture;
      normalTouched: PIXI.Texture;
      ng: PIXI.Texture;
      ngTouched: PIXI.Texture;
    }
  ) {
    super(textures.normal);
    this.anchor.set(0.5);
    this.interactive = true;
    this.visible = false;
    this.scale.set(0.5);
  }

  show(state: "normal" | "ng"): void {
    this.texture = this.textures[state];
    this._state = state;
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  touch(): void {
    if (this.state === "normal") {
      this.texture = this.textures.normalTouched;
    }

    if (this.state === "ng") {
      this.texture = this.textures.ngTouched;
    }
  }
}

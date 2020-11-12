import * as PIXI from "pixi.js";

import { SelectArrow } from "./SelectArrow";

export class RinaCandidate {
  private _container: PIXI.Container;
  private _candidateBox: PIXI.Sprite;
  private _fukidashi: PIXI.Sprite;
  private _selectArrow;

  public constructor(
    private context: {
      scale: number;
      screen: { width: number; height: number };
      textures: {
        hako1: PIXI.Texture;
        hako2: PIXI.Texture;
        fukidashiNiko: PIXI.Texture;
        fukidashiShun: PIXI.Texture;
      };
    }
  ) {
    this._container = new PIXI.Container();

    this._candidateBox = PIXI.Sprite.from(context.textures.hako1);
    this._candidateBox.anchor.set(0.5, 0.5);
    this._candidateBox.scale.set(context.scale);

    this._fukidashi = PIXI.Sprite.from(context.textures.fukidashiNiko);
    this._fukidashi.anchor.set(0.5);
    this._fukidashi.scale.set(this.context.scale);
    this._fukidashi.x = this.context.screen.width * 0.1;
    this._fukidashi.y = -this.context.screen.height * 0.05;

    this._selectArrow = new SelectArrow();
    this._selectArrow.graphics.y = -this.context.screen.height * 0.1;

    this._container.addChild(this._candidateBox);
  }

  public get container() {
    return this._container;
  }

  public get boxSprite() {
    return this._candidateBox;
  }

  public clickHandler(callback: (() => void) | null) {
    const turnOff = () => {
      this._candidateBox.interactive = false;
      this._candidateBox.buttonMode = false;
      this._candidateBox.off("pointerover");
      this._candidateBox.off("pointerout");
      this._candidateBox.off("pointerdown");
    };

    if (!callback) {
      turnOff();
      return;
    }

    this._candidateBox.interactive = true;
    this._candidateBox.buttonMode = true;

    this._candidateBox.on("pointerover", e => {
      this.showArrow();
    });
    this._candidateBox.on("pointerout", e => {
      this.hideArrow();
    });
    this._candidateBox.on("pointerdown", e => {
      turnOff();

      callback();
    });
  }

  public showUnknownBox() {
    this._candidateBox.texture = this.context.textures.hako1;
  }

  public showWinBox() {
    this._candidateBox.texture = this.context.textures.hako2;
  }

  public showWinFukidashi() {
    this._fukidashi.texture = this.context.textures.fukidashiNiko;
    this._container.addChild(this._fukidashi);
  }

  public showLoseFukidashi() {
    this._fukidashi.texture = this.context.textures.fukidashiShun;
    this._container.addChild(this._fukidashi);
  }

  public hideFukidashi() {
    this._container.removeChild(this._fukidashi);
  }

  public showArrow() {
    this._container.addChild(this._selectArrow.graphics);
  }

  public hideArrow() {
    this._container.removeChild(this._selectArrow.graphics);
  }
}

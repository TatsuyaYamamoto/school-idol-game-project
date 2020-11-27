import { Container, Sprite, Texture } from "pixi.js";
import { TimelineMax } from "gsap";

import { SelectArrow } from "./SelectArrow";

export class RinaCandidate {
  private _container: Container;
  private _rinaBody: Sprite;
  private _candidateBox: Sprite;
  private _fukidashi: Sprite;
  private _selectArrow;

  public constructor(
    private context: {
      scale: number;
      screen: { width: number; height: number };
      inContainRina: boolean;
      textures: {
        rina1: Texture;
        hako1: Texture;
        hako2: Texture;
        fukidashiNiko: Texture;
        fukidashiShun: Texture;
      };
    }
  ) {
    this._container = new Container();

    this._rinaBody = Sprite.from(context.textures.rina1);
    this._rinaBody.anchor.set(0.5);
    this._rinaBody.scale.set(this.context.scale);

    this._candidateBox = Sprite.from(context.textures.hako1);
    this._candidateBox.anchor.set(0.5, 0.5);
    this._candidateBox.scale.set(context.scale);
    this._candidateBox.alpha = 0;

    this._fukidashi = Sprite.from(context.textures.fukidashiNiko);
    this._fukidashi.anchor.set(0.5);
    this._fukidashi.scale.set(this.context.scale);
    this._fukidashi.x = this.context.screen.width * 0.1;
    this._fukidashi.y = -this.context.screen.height * 0.05;

    this._selectArrow = new SelectArrow();
    this._selectArrow.graphics.y = -this.context.screen.height * 0.1;

    if (context.inContainRina) {
      this._container.addChild(this._rinaBody);
    }
    this._container.addChild(this._candidateBox);
  }

  public get container() {
    return this._container;
  }

  public get boxSprite() {
    return this._candidateBox;
  }

  public get inContainRina(): boolean {
    return this.context.inContainRina;
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

    this._candidateBox.on("pointerover", (e) => {
      console.log(e);
      this.showArrow();
    });
    this._candidateBox.on("pointerout", (e) => {
      this.hideArrow();
    });
    this._candidateBox.on("pointerdown", (e) => {
      turnOff();

      callback();
    });
  }

  public showCoverBoxAnime(): Promise<void> {
    const timeline = new TimelineMax({ paused: true });
    timeline.fromTo(
      this._candidateBox,
      1,
      { alpha: 0, y: -this.context.screen.height * 0.05 },
      { alpha: 1, y: 0 }
    );

    const p = new Promise<void>((resolve) => {
      timeline.eventCallback("onComplete", () => {
        timeline.eventCallback("onComplete", null);

        // ダンボールで覆ったら、リナちゃんは消す
        this._rinaBody.alpha = 0;

        resolve();
      });
    });
    timeline.play();
    return p;
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

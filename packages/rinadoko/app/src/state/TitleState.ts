import * as PIXI from "pixi.js";
import { State } from "../";

export class TitleState implements State {
  public static nodeKey = "@title";

  constructor(private app: PIXI.Application) {}

  onEnter() {
    const resources = this.app.loader.resources;

    const selectArrow = new PIXI.Graphics();
    selectArrow.beginFill(0xff3300);
    selectArrow.lineStyle(4, 0xffd900, 1);
    selectArrow.moveTo(-50, 0);
    selectArrow.lineTo(50, 0);
    selectArrow.lineTo(0, 50);
    selectArrow.lineTo(-50, 0);
    selectArrow.closePath();
    selectArrow.endFill();

    const fukidashiNikoTexture = resources["fukidashi-niko"].texture;
    const fukidashiNiko = PIXI.Sprite.from(fukidashiNikoTexture);
    fukidashiNiko.anchor.set(0.5);
    fukidashiNiko.scale.set(0.2);
    fukidashiNiko.x = 120;
    fukidashiNiko.y = -100;

    const boxes = Array.from(new Array(3)).map(() => {
      const container = new PIXI.Container();

      const candidateBoxTexture = resources["hako-1"].texture;
      const candidateBox = PIXI.Sprite.from(candidateBoxTexture);
      candidateBox.anchor.set(0.5);
      candidateBox.scale.set(0.2);
      candidateBox.interactive = true;
      candidateBox.buttonMode = true;

      const correctBoxTexture = resources["hako-2"].texture;

      candidateBox.on("pointerover", e => {
        selectArrow.y = -100;
        container.addChild(selectArrow);
      });
      candidateBox.on("pointerout", e => {
        container.removeChild(selectArrow);
      });
      candidateBox.on("pointerdown", e => {
        candidateBox.texture = correctBoxTexture;
        container.removeChild(selectArrow);
        container.addChild(fukidashiNiko);
      });

      container.addChild(candidateBox);

      return container;
    });

    boxes[0].x = 100;
    boxes[0].y = 300;

    boxes[1].x = 400;
    boxes[1].y = 300;

    boxes[2].x = 700;
    boxes[2].y = 300;

    this.app.stage.addChild(...boxes);
  }
  onExit() {}
}

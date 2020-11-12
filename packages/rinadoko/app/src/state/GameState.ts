import * as PIXI from "pixi.js";
import { TweenMax, TimelineMax } from "gsap";
import { State, stateMachineService } from "../";

export class GameState implements State {
  public static nodeKey = "@game";

  private candidates: {
    container: PIXI.Container;
    box: PIXI.Sprite;
  }[];
  private selectArrow: PIXI.Graphics;
  private fukidashiNiko: PIXI.Sprite;
  private candidateBoxTexture: PIXI.Texture;
  private correctBoxTexture: PIXI.Texture;

  constructor(private app: PIXI.Application) {}

  onEnter() {
    const resources = this.app.loader.resources;

    this.selectArrow = new PIXI.Graphics();
    this.selectArrow.beginFill(0xff3300);
    this.selectArrow.lineStyle(4, 0xffd900, 1);
    this.selectArrow.moveTo(-50, 0);
    this.selectArrow.lineTo(50, 0);
    this.selectArrow.lineTo(0, 50);
    this.selectArrow.lineTo(-50, 0);
    this.selectArrow.closePath();
    this.selectArrow.endFill();

    const fukidashiNikoTexture = resources["fukidashi-niko"].texture;
    this.fukidashiNiko = PIXI.Sprite.from(fukidashiNikoTexture);
    this.fukidashiNiko.anchor.set(0.5);
    this.fukidashiNiko.scale.set(0.2);
    this.fukidashiNiko.x = 120;
    this.fukidashiNiko.y = -100;

    this.candidates = Array.from(new Array(3)).map(() => {
      const container = new PIXI.Container();

      this.candidateBoxTexture = resources["hako-1"].texture;
      const candidateBox = PIXI.Sprite.from(this.candidateBoxTexture);
      candidateBox.anchor.set(0.5);
      candidateBox.scale.set(0.2);

      this.correctBoxTexture = resources["hako-2"].texture;

      container.addChild(candidateBox);

      return {
        container,
        box: candidateBox
      };
    });

    this.candidates[0].container.x = 100;
    this.candidates[0].container.y = 300;

    this.candidates[1].container.x = 400;
    this.candidates[1].container.y = 300;

    this.candidates[2].container.x = 700;
    this.candidates[2].container.y = 300;

    this.app.stage.addChild(
      ...this.candidates.map(({ container }) => container)
    );

    this.startShuffle();
  }
  onExit() {}

  startShuffle() {
    this.candidates.map(({ container, box }) => {
      box.texture = this.candidateBoxTexture;
      container.removeChild(this.fukidashiNiko);
    });

    const timelines = this.candidates.map(() => {
      return new TimelineMax({});
    });

    const timelinePromises = timelines.map(t => {
      return new Promise(resolve => {
        t.eventCallback("onComplete", () => {
          resolve();
        });
      });
    });

    Promise.all(timelinePromises).then(() => {
      this.startSelect();
    });

    const position_1 = 100;
    const position_2 = 400;
    const position_3 = 700;
    const unitMoveTime = 0.5;

    timelines[0]
      .set(this.candidates[0].container, { x: position_1 })
      .to(this.candidates[0].container, unitMoveTime, { x: position_2 })
      .to(this.candidates[0].container, unitMoveTime, { x: position_1 })
      .to(this.candidates[0].container, unitMoveTime, { x: position_3 })
      .to(this.candidates[0].container, unitMoveTime, { x: position_2 });

    timelines[1]
      .set(this.candidates[1].container, { x: position_2 })
      .to(this.candidates[1].container, unitMoveTime, { x: position_3 })
      .to(this.candidates[1].container, unitMoveTime, { x: position_1 })
      .to(this.candidates[1].container, unitMoveTime, { x: position_2 })
      .to(this.candidates[1].container, unitMoveTime, { x: position_1 });

    timelines[2]
      .set(this.candidates[2].container, { x: position_3 })
      .to(this.candidates[2].container, unitMoveTime, { x: position_1 })
      .to(this.candidates[2].container, unitMoveTime, { x: position_3 })
      .to(this.candidates[2].container, unitMoveTime, { x: position_1 })
      .to(this.candidates[2].container, unitMoveTime, { x: position_3 });

    timelines.forEach(t => t.play());
  }

  startSelect() {
    console.log("start select!!");

    this.candidates.forEach(({ container, box }, index) => {
      box.interactive = true;
      box.buttonMode = true;

      box.on("pointerover", e => {
        this.selectArrow.y = -100;
        container.addChild(this.selectArrow);
      });
      box.on("pointerout", e => {
        container.removeChild(this.selectArrow);
      });
      box.on("pointerdown", e => {
        this.candidates.forEach(({ box }) => {
          box.interactive = false;
          box.buttonMode = false;
          box.off("pointerover");
          box.off("pointerout");
          box.off("pointerdown");
        });
        this.checkResult(index);
      });
    });
  }

  checkResult(index: number) {
    const { container, box } = this.candidates[index];
    box.texture = this.correctBoxTexture;
    container.removeChild(this.selectArrow);
    container.addChild(this.fukidashiNiko);

    setTimeout(() => {
      this.startShuffle();
    }, 1000);
  }
}

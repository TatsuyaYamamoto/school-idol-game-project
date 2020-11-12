import * as PIXI from "pixi.js";
import { TweenMax, TimelineMax } from "gsap";
import { State, stateMachineService } from "../";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameState implements State {
  public static nodeKey = "@game";

  private candidates: RinaCandidate[];
  private fukidashiNiko: PIXI.Sprite;
  private candidateBoxTexture: PIXI.Texture;
  private correctBoxTexture: PIXI.Texture;

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter() {
    const resources = this.context.app.loader.resources;

    const fukidashiNikoTexture = resources["fukidashi-niko"].texture;
    this.fukidashiNiko = PIXI.Sprite.from(fukidashiNikoTexture);
    this.fukidashiNiko.anchor.set(0.5);
    this.fukidashiNiko.scale.set(this.context.scale);
    this.fukidashiNiko.x = this.context.app.screen.width * 0.1;
    this.fukidashiNiko.y = -this.context.app.screen.height * 0.05;

    this.candidates = Array.from(new Array(3)).map(() => {
      return new RinaCandidate({
        scale: this.context.scale,
        screen: {
          width: this.context.app.screen.width,
          height: this.context.app.screen.height
        },
        textures: {
          hako1: resources["hako-1"].texture,
          hako2: resources["hako-2"].texture,
          fukidashiNiko: resources["fukidashi-niko"].texture
        }
      });
    });

    console.log(this.context.app.screen);

    this.candidates[0].container.x = this.context.app.screen.width * 0.2;
    this.candidates[0].container.y = this.context.app.screen.height * 0.5;

    this.candidates[1].container.x = this.context.app.screen.width * 0.5;
    this.candidates[1].container.y = this.context.app.screen.height * 0.5;

    this.candidates[2].container.x = this.context.app.screen.width * 0.8;
    this.candidates[2].container.y = this.context.app.screen.height * 0.5;

    this.context.app.stage.addChild(
      ...this.candidates.map(({ container }) => container)
    );

    this.startShuffle();
  }
  onExit() {}

  startShuffle() {
    this.candidates.map(c => {
      c.hideArrow();
      c.hideFukidashi();
      c.showUnknownBox();
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

    const position_1 = this.context.app.screen.width * 0.2;
    const position_2 = this.context.app.screen.width * 0.5;
    const position_3 = this.context.app.screen.width * 0.8;
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

    this.candidates.forEach((rina, index) => {
      rina.clickHandler(() => {
        this.candidates.forEach(rina => {
          rina.clickHandler(null);
        });

        this.checkResult(index);
      });
    });
  }

  checkResult(index: number) {
    const candidate = this.candidates[index];
    candidate.hideArrow();
    candidate.showWinFukidashi();
    candidate.showWinBox();

    setTimeout(() => {
      this.startShuffle();
    }, 1000);
  }
}

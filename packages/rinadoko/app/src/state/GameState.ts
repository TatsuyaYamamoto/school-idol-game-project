import * as PIXI from "pixi.js";
import { TweenMax, TimelineMax } from "gsap";
import { State, stateMachineService } from "../";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameState implements State {
  public static nodeKey = "@game";

  private candidates: RinaCandidate[];
  private candidateNumber = 3;
  private correctIndex: number;

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter() {
    const resources = this.context.app.loader.resources;

    this.correctIndex = this.createRandomInteger(0, 3);
    this.candidates = Array.from(new Array(this.candidateNumber)).map(() => {
      return new RinaCandidate({
        scale: this.context.scale,
        screen: {
          width: this.context.app.screen.width,
          height: this.context.app.screen.height
        },
        textures: {
          hako1: resources["hako-1"].texture,
          hako2: resources["hako-2"].texture,
          fukidashiNiko: resources["fukidashi-niko"].texture,
          fukidashiShun: resources["fukidashi-shun"].texture
        }
      });
    });

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

    const shuffleData = this.generateShuffleData(this.candidateNumber);

    shuffleData.forEach((data, index) => {
      const timeline = timelines[index];
      const target = this.candidates[index];

      data.forEach(({ x, duration }, index) => {
        if (index === 0) {
          timeline.set(target.container, { x });
        } else {
          timeline.to(target.container, duration, { x });
        }
      });
    });

    timelines.forEach(t => t.play());
  }

  startSelect() {
    this.candidates.forEach((rina, index) => {
      rina.clickHandler(() => {
        this.candidates.forEach(rina => {
          rina.clickHandler(null);
        });

        this.checkResult(index);
      });
    });
  }

  checkResult(selectedIndex: number) {
    if (this.correctIndex === selectedIndex /* 正解！ */) {
      const rina = this.candidates[selectedIndex];
      rina.hideArrow();
      rina.showWinFukidashi();
      rina.showWinBox();

      setTimeout(() => {
        this.startShuffle();
      }, 1000);
    } /*不正解*/ else {
      const rina = this.candidates[this.correctIndex];
      rina.hideArrow();
      rina.showLoseFukidashi();
    }
  }

  createRandomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generateShuffleData(
    candidateNumber: number = 3
  ): { x: number; duration: number }[][] {
    const data: { x: number; duration: number }[][] = [];
    const positions = [
      this.context.app.screen.width * 0.2,
      this.context.app.screen.width * 0.5,
      this.context.app.screen.width * 0.8
    ];
    const unitMoveTime = 0.5;
    const moveTime = 5;

    Array.from(new Array(candidateNumber)).forEach((_, candidateIndex) => {
      data.push([]);
    });

    Array.from(new Array(moveTime)).forEach((_, moveIndex) => {
      const positionIndexes = [0, 1, 2];

      Array.from(new Array(candidateNumber)).forEach((_, candidateIndex) => {
        const random = this.createRandomInteger(0, 3 - candidateIndex);
        const positionIndex = positionIndexes[random];
        positionIndexes.splice(random, 1);
        const x = positions[positionIndex];
        data[candidateIndex].push({
          x,
          duration: unitMoveTime
        });
      });
    });

    return data;
  }
}

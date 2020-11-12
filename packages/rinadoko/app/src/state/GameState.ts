import * as PIXI from "pixi.js";
import { TimelineMax } from "gsap";
import { State } from "../";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameState implements State {
  public static nodeKey = "@game";

  private candidates: RinaCandidate[];
  private candidateNumber = 3;
  private titleElement;
  private selectGuideElement;

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter() {
    const resources = this.context.app.loader.resources;
    const correctIndex = this.createRandomInteger(0, 3);
    this.candidates = Array.from(new Array(this.candidateNumber)).map(
      (_, index) => {
        return new RinaCandidate({
          inContainRina: index === correctIndex,
          scale: this.context.scale,
          screen: {
            width: this.context.app.screen.width,
            height: this.context.app.screen.height
          },
          textures: {
            rina1: resources["rina-1"].texture,
            hako1: resources["hako-1"].texture,
            hako2: resources["hako-2"].texture,
            fukidashiNiko: resources["fukidashi-niko"].texture,
            fukidashiShun: resources["fukidashi-shun"].texture
          }
        });
      }
    );

    const shuffleData = this.generateShuffleData(this.candidateNumber);
    this.candidates.forEach((rina, index) => {
      rina.container.x = shuffleData[index][0].x;
      rina.container.y = this.context.app.screen.height * 0.5;
    });

    this.context.app.stage.addChild(
      ...this.candidates.map(({ container }) => container)
    );

    this.titleElement = document.getElementById("title");
    this.selectGuideElement = document.getElementById("select-guide");
    window.addEventListener("pointerdown", this.initGame);
  }

  onExit() {}

  initGame = () => {
    window.removeEventListener("pointerdown", this.initGame);
    this.titleElement.classList.add("container--hide");
    this.coverBox();
  };

  coverBox() {
    const coverAnimePromise = this.candidates.map((rina, index) =>
      rina.showCoverBoxAnime()
    );

    Promise.all(coverAnimePromise).then(() => {
      this.startShuffle();
    });
  }

  startShuffle() {
    const shuffleData = this.generateShuffleData(this.candidateNumber);

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

    shuffleData.forEach((data, index) => {
      const timeline = timelines[index];
      const target = this.candidates[index];

      data.forEach(({ x, duration }, index) => {
        if (index === 0) {
          // ignore
        } else {
          timeline.to(target.container, duration, { x });
        }
      });
    });

    timelines.forEach(t => t.play());
  }

  startSelect() {
    this.showSelectGuide();

    this.candidates.forEach((rina, index) => {
      rina.clickHandler(() => {
        this.candidates.forEach(rina => {
          rina.clickHandler(null);
        });

        this.checkResult(index);
        this.hideSelectGuide();
      });
    });
  }

  checkResult(selectedIndex: number) {
    const selectedCandidate = this.candidates[selectedIndex];
    selectedCandidate.hideArrow();
    if (selectedCandidate.inContainRina /* 正解！ */) {
      selectedCandidate.showWinFukidashi();
      selectedCandidate.showWinBox();

      setTimeout(() => {
        selectedCandidate.hideFukidashi();
        selectedCandidate.showUnknownBox();
        this.startShuffle();
      }, 1000);
    } /*不正解*/ else {
      this.candidates.forEach(c => {
        if (c.inContainRina) {
          c.showLoseFukidashi();
        }
      });
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

  private showSelectGuide() {
    this.selectGuideElement.style.display = "block";
  }

  private hideSelectGuide() {
    this.selectGuideElement.style.display = "none";
  }
}

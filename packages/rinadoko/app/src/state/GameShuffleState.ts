import { TimelineMax } from "gsap";
import { Application } from "pixi.js";
import PIXISound from "pixi-sound";

import { State, StateEnterParams, stateMachineService } from "../index";
import { generateShuffleData } from "../utils";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameShuffleState implements State {
  public static nodeKey = "@game-shuffle";

  private rinaCandidates: RinaCandidate[];

  constructor(private context: { app: Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    const { candidateNumber, rinaCandidates, moveDuration } = context;
    const moveSound = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_move1"]
    );

    this.rinaCandidates = rinaCandidates;
    const shuffleData = generateShuffleData(
      [
        this.context.app.screen.width * 0.2,
        this.context.app.screen.width * 0.5,
        this.context.app.screen.width * 0.8
      ],
      5
    );

    const timelines = this.rinaCandidates.map(() => {
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
      this.onStartSelect();
    });

    shuffleData.forEach((data, candidateIndex) => {
      const timeline = timelines[candidateIndex];
      const target = this.rinaCandidates[candidateIndex];

      data.forEach(({ x }) => {
        timeline.to(target.container, moveDuration, {
          x,
          onStart: () => {
            if (candidateIndex === 0) {
              moveSound.play();
            }
          }
        });
      });
    });

    timelines.forEach(t => t.play());
  }

  onExit({ context }) {}

  onStartSelect() {
    stateMachineService.send("SHUFFLE_COMPLETED");
  }
}

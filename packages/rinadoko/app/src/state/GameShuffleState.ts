import { TimelineMax } from "gsap";
import PIXISound from "pixi-sound";

import {
  State,
  StateContext,
  StateEnterParams,
  stateMachineService,
} from "../index";
import { generateShuffleData } from "../utils";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameShuffleState implements State {
  public static nodeKey = "@game-shuffle";

  private stateContext: StateContext;

  private rinaCandidates: RinaCandidate[];

  constructor(context: StateContext) {
    this.stateContext = context;
  }

  onEnter({ context }: StateEnterParams): void {
    const { rinaCandidates, moveDuration } = context;
    const moveSound = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_move1
    );

    this.rinaCandidates = rinaCandidates;
    const shuffleData = generateShuffleData(
      [
        this.stateContext.app.screen.width * 0.2,
        this.stateContext.app.screen.width * 0.5,
        this.stateContext.app.screen.width * 0.8,
      ],
      5
    );

    const timelines = this.rinaCandidates.map(() => {
      return new TimelineMax({});
    });

    const timelinePromises = timelines.map((t) => {
      return new Promise((resolve) => {
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
          },
        });
      });
    });

    timelines.forEach((t) => t.play());
  }

  onExit(): void {
    // do nothing
  }

  onStartSelect(): void {
    stateMachineService.send("SHUFFLE_COMPLETED");
  }
}

import PIXISound from "pixi-sound";

import {
  State,
  StateContext,
  StateEnterParams,
  stateMachineService,
} from "../index";
import { createRandomInteger, generateShuffleData } from "../utils";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameTitle implements State {
  public static nodeKey = "@game-title";

  private stateContext: StateContext;

  private pixiState: HTMLElement;

  private titleElement: HTMLElement;

  private soundButton1: PIXISound.Sound;

  private soundBgm1: PIXISound.Sound;

  constructor(context: StateContext) {
    this.stateContext = context;
  }

  onEnter({ context }: StateEnterParams): void {
    const { resources } = this.stateContext.app.loader;
    const { candidateNumber } = context;
    const correctIndex = createRandomInteger(0, candidateNumber);

    this.titleElement = document.getElementById("title");
    this.pixiState = document.getElementById("pixi");

    this.soundButton1 = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_button1
    );
    this.soundBgm1 = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_bgm1
    );

    const rinaCandidates = Array.from(new Array(candidateNumber)).map(
      (_, index) => {
        return new RinaCandidate({
          inContainRina: index === correctIndex,
          scale: this.stateContext.scale,
          screen: {
            width: this.stateContext.app.screen.width,
            height: this.stateContext.app.screen.height,
          },
          textures: {
            rina1: resources["rina-1"].texture,
            hako1: resources["hako-1"].texture,
            hako2: resources["hako-2"].texture,
            fukidashiNiko: resources["fukidashi-niko"].texture,
            fukidashiShun: resources["fukidashi-shun"].texture,
          },
        });
      }
    );
    stateMachineService.send("rinaCandidates.UPDATE", { rinaCandidates });

    const shuffleData = generateShuffleData(
      [
        this.stateContext.app.screen.width * 0.2,
        this.stateContext.app.screen.width * 0.5,
        this.stateContext.app.screen.width * 0.8,
      ],
      1
    );
    rinaCandidates.forEach((rina, index) => {
      /* eslint-disable no-param-reassign */
      rina.container.x = shuffleData[index][0].x;
      rina.container.y = this.stateContext.app.screen.height * 0.5;
      /* eslint-enable no-param-reassign */
    });

    this.stateContext.app.stage.addChild(
      ...rinaCandidates.map(({ container }) => container)
    );
    this.showTitle();

    this.soundBgm1.play({ volume: 0.2, loop: true });
    setTimeout(() => {
      this.pixiState.addEventListener("pointerdown", this.onGameStart);
    });
  }

  onExit(): void {
    this.hideTitle();
    this.pixiState.removeEventListener("pointerdown", this.onGameStart);
  }

  onGameStart = (): void => {
    this.soundButton1.play();
    this.soundBgm1.stop();

    stateMachineService.send("GAME_START");
  };

  showTitle(): void {
    this.titleElement.classList.remove("container--hide");
  }

  hideTitle(): void {
    this.titleElement.classList.add("container--hide");
  }
}

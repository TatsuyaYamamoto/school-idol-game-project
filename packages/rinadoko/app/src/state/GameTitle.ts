import { Application } from "pixi.js";
import PIXISound from "pixi-sound";

import { State, StateEnterParams, stateMachineService } from "../index";
import { createRandomInteger, generateShuffleData } from "../utils";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameTitle implements State {
  public static nodeKey = "@game-title";

  private pixiState: HTMLElement;
  private soundButton1: PIXISound.Sound;
  private soundBgm1: PIXISound.Sound;

  constructor(private context: { app: Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    const resources = this.context.app.loader.resources;
    const { candidateNumber } = context;
    const correctIndex = createRandomInteger(0, candidateNumber);

    this.pixiState = document.getElementById("pixi");
    this.soundButton1 = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_button1"]
    );
    this.soundBgm1 = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_bgm1"]
    );

    const rinaCandidates = Array.from(new Array(candidateNumber)).map(
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
    stateMachineService.send("rinaCandidates.UPDATE", { rinaCandidates });

    const shuffleData = generateShuffleData(
      [
        this.context.app.screen.width * 0.2,
        this.context.app.screen.width * 0.5,
        this.context.app.screen.width * 0.8
      ],
      1
    );
    rinaCandidates.forEach((rina, index) => {
      rina.container.x = shuffleData[index][0].x;
      rina.container.y = this.context.app.screen.height * 0.5;
    });

    this.context.app.stage.addChild(
      ...rinaCandidates.map(({ container }) => container)
    );

    // this.soundBgm1.play({ volume: 0.2, loop: true });
    setTimeout(() => {
      this.pixiState.addEventListener("pointerdown", this.onGameStart);
    });
  }
  onExit({ context }) {
    this.hideTitle();
    this.pixiState.removeEventListener("pointerdown", this.onGameStart);
  }
  onGameStart = () => {
    this.soundButton1.play();
    stateMachineService.send("GAME_START");
  };
  showTitle() {
    const titleElement = document.getElementById("title");
  }
  hideTitle() {
    const titleElement = document.getElementById("title");
    titleElement.classList.add("container--hide");
  }
}

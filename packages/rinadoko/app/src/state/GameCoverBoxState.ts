import * as PIXI from "pixi.js";
import { State, StateEnterParams, stateMachineService } from "../index";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameCoverBoxState implements State {
  public static nodeKey = "@game-cover-box";

  private rinaCandidates: RinaCandidate[];

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    this.rinaCandidates = context.rinaCandidates;
    const coverAnimePromise = this.rinaCandidates.map((rina, index) =>
      rina.showCoverBoxAnime()
    );

    Promise.all(coverAnimePromise).then(() => {
      this.onStartShuffle();
    });
  }
  onExit({ context }) {}

  onStartShuffle() {
    stateMachineService.send("COVER_BOX_COMPLETED");
  }
}

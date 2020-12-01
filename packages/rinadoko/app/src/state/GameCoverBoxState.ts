import {
  State,
  StateContext,
  StateEnterParams,
  stateMachineService,
} from "../index";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameCoverBoxState implements State {
  public static nodeKey = "@game-cover-box";

  private stateContext: StateContext;

  private rinaCandidates: RinaCandidate[];

  constructor(context: StateContext) {
    this.stateContext = context;
  }

  onEnter({ context }: StateEnterParams): void {
    this.rinaCandidates = context.rinaCandidates;
    const coverAnimePromise = this.rinaCandidates.map((rina) =>
      rina.showCoverBoxAnime()
    );

    Promise.all(coverAnimePromise).then(() => {
      this.onStartShuffle();
    });
  }

  onExit(): void {
    // do nothing
  }

  onStartShuffle(): void {
    stateMachineService.send("COVER_BOX_COMPLETED");
  }
}

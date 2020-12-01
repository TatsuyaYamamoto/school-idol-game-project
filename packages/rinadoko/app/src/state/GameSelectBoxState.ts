import PIXISound from "pixi-sound";

import {
  State,
  StateContext,
  StateEnterParams,
  stateMachineService,
} from "../index";
import { RinaCandidate } from "../model/RinaCandidate";
import { wait } from "../utils";

export class GameSelectBoxState implements State {
  public static nodeKey = "@game-select-box";

  private stateContext: StateContext;

  private rinaCandidates: RinaCandidate[];

  private soundOk: PIXISound.Sound;

  private soundNg: PIXISound.Sound;

  constructor(ctx: StateContext) {
    this.stateContext = ctx;
  }

  onEnter({ context }: StateEnterParams): void {
    this.rinaCandidates = context.rinaCandidates;
    this.soundOk = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_ok
    );
    this.soundNg = PIXISound.Sound.from(
      this.stateContext.app.loader.resources.sound_ng
    );
    this.showGuide();

    this.rinaCandidates.forEach((rina, index) => {
      rina.clickHandler(() => {
        this.rinaCandidates.forEach((r) => {
          r.clickHandler(null);
        });

        this.hideGuide();
        this.checkResult(index);
      });
    });
  }

  onExit(): void {
    // do nothing
  }

  private checkResult(selectedIndex: number) {
    const selectedCandidate = this.rinaCandidates[selectedIndex];
    selectedCandidate.hideArrow();
    if (selectedCandidate.inContainRina /* 正解！ */) {
      this.soundOk.play();
      selectedCandidate.showWinFukidashi();
      selectedCandidate.showWinBox();

      Promise.resolve()
        .then(() => wait(1000))
        .then(() => {
          selectedCandidate.hideFukidashi();
          selectedCandidate.showUnknownBox();
        })
        .then(() => wait(500))
        .then(() => {
          stateMachineService.send("BOX_SELECTED_OK");
        });
    } /* 不正解 */ else {
      this.soundNg.play();

      this.rinaCandidates.forEach((c) => {
        if (c.inContainRina) {
          c.showLoseFukidashi();
        }
      });

      setTimeout(() => {
        stateMachineService.send("BOX_SELECTED_NG");
      }, 1000);
    }
  }

  private showGuide(): void {
    const selectGuideElement = document.getElementById("select-guide");
    selectGuideElement.style.display = "block";
  }

  private hideGuide(): void {
    const selectGuideElement = document.getElementById("select-guide");
    selectGuideElement.style.display = "none";
  }
}

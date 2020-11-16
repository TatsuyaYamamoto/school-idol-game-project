import { Application } from "pixi.js";
import PIXISound from "pixi-sound";

import { State, StateEnterParams, stateMachineService } from "../index";
import { RinaCandidate } from "../model/RinaCandidate";
import { wait } from "../utils";

export class GameSelectBoxState implements State {
  public static nodeKey = "@game-select-box";

  private rinaCandidates: RinaCandidate[];
  private soundOk: PIXISound.Sound;
  private soundNg: PIXISound.Sound;

  constructor(private context: { app: Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    this.rinaCandidates = context.rinaCandidates;
    this.soundOk = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_ok"]
    );
    this.soundNg = PIXISound.Sound.from(
      this.context.app.loader.resources["sound_ng"]
    );
    this.showGuide();

    this.rinaCandidates.forEach((rina, index) => {
      rina.clickHandler(() => {
        this.rinaCandidates.forEach(rina => {
          rina.clickHandler(null);
        });

        this.hideGuide();
        this.checkResult(index);
      });
    });
  }
  onExit({ context }) {}

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
    } /*不正解*/ else {
      this.soundNg.play();

      this.rinaCandidates.forEach(c => {
        if (c.inContainRina) {
          c.showLoseFukidashi();
        }
      });

      setTimeout(() => {
        stateMachineService.send("BOX_SELECTED_NG");
      }, 1000);
    }
  }

  private showGuide() {
    const selectGuideElement = document.getElementById("select-guide");
    selectGuideElement.style.display = "block";
  }
  private hideGuide() {
    const selectGuideElement = document.getElementById("select-guide");
    selectGuideElement.style.display = "none";
  }
}

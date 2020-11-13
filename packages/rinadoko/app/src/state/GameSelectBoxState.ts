import * as PIXI from "pixi.js";

import { State, StateEnterParams, stateMachineService } from "../index";
import { RinaCandidate } from "../model/RinaCandidate";

export class GameSelectBoxState implements State {
  public static nodeKey = "@game-select-box";

  private rinaCandidates: RinaCandidate[];

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    this.rinaCandidates = context.rinaCandidates;
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
      selectedCandidate.showWinFukidashi();
      selectedCandidate.showWinBox();

      setTimeout(() => {
        selectedCandidate.hideFukidashi();
        selectedCandidate.showUnknownBox();

        stateMachineService.send("BOX_SELECTED_OK");
      }, 1000);
    } /*不正解*/ else {
      this.rinaCandidates.forEach(c => {
        if (c.inContainRina) {
          c.showLoseFukidashi();
        }
      });

      stateMachineService.send("BOX_SELECTED_NG");
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

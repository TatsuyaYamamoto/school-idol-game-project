import * as PIXI from "pixi.js";
import { State, StateEnterParams, stateMachineService } from "../index";
import { Result } from "../model/Result";

export class GameResultState implements State {
  public static nodeKey = "@game-result";

  private pixiState: HTMLElement;
  private result: Result;

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    const { resources } = this.context.app.loader;
    this.result = new Result({
      scale: this.context.scale,
      screen: {
        width: this.context.app.screen.width,
        height: this.context.app.screen.height
      },
      textures: {
        result0: resources["last-1"].texture,
        result1: resources["last-2"].texture,
        result2: resources["last-3"].texture
      }
    });

    this.result.point = context.correctSelectCount;

    this.context.app.stage.removeChild(
      ...context.rinaCandidates.map(r => r.container)
    );
    this.context.app.stage.addChild(this.result.container);

    this.pixiState = document.getElementById("pixi");
    this.pixiState.addEventListener("pointerdown", this.onTapStage);
  }
  onExit({ context }) {
    this.context.app.stage.removeChild(this.result.container);
    this.pixiState.removeEventListener("pointerdown", this.onTapStage);
  }

  onTapStage() {
    stateMachineService.send("RESTART");
  }
}

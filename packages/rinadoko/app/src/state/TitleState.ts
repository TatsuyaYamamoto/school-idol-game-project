import * as PIXI from "pixi.js";
import { State, stateMachineService } from "../";

const basicText = new PIXI.Text("START GAME!!");
basicText.interactive = true;

export class TitleState implements State {
  public static nodeKey = "@title";

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter() {
    basicText.addListener("pointerdown", e => {
      this.onStartGame();
    });
    basicText.x = 50;
    basicText.y = 100;

    this.context.app.stage.addChild(...[basicText]);
  }

  onExit() {
    this.context.app.stage.removeChild(...[basicText]);
  }

  onStartGame() {
    stateMachineService.send("START_GAME");
  }
}

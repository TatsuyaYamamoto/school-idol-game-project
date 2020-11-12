import * as PIXI from "pixi.js";
import { State, stateMachineService } from "../";

const basicText = new PIXI.Text("START GAME!!");
basicText.interactive = true;

export class TitleState implements State {
  public static nodeKey = "@title";

  constructor(private app: PIXI.Application) {}

  onEnter() {
    basicText.addListener("pointerdown", e => {
      this.onStartGame();
    });
    basicText.x = 50;
    basicText.y = 100;

    this.app.stage.addChild(...[basicText]);
  }

  onExit() {
    this.app.stage.removeChild(...[basicText]);
  }

  onStartGame() {
    stateMachineService.send("START_GAME");
  }
}

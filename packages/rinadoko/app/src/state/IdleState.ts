import * as PIXI from "pixi.js";
import { State } from "../";

export class IdleState implements State {
  public static nodeKey = "@idle";

  constructor(private app: PIXI.Application) {}
  onEnter() {}
  onExit() {}
}

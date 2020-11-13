import * as PIXI from "pixi.js";
import { State, StateEnterParams } from "../";

export class IdleState implements State {
  public static nodeKey = "@idle";

  constructor(private context: { app: PIXI.Application; scale: number }) {}
  onEnter({ context }: StateEnterParams) {}
  onExit({ context }) {}
}

import { Application } from "pixi.js";
import { State, StateEnterParams } from "../";

export class IdleState implements State {
  public static nodeKey = "@idle";

  constructor(private context: { app: Application; scale: number }) {}
  onEnter({ context }: StateEnterParams) {}
  onExit({ context }) {}
}

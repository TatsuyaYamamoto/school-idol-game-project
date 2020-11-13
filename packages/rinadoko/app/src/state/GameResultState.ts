import * as PIXI from "pixi.js";
import { State, StateEnterParams } from "../index";
import { Result } from "../model/Result";

export class GameResultState implements State {
  public static nodeKey = "@game-result";

  constructor(private context: { app: PIXI.Application; scale: number }) {}

  onEnter({ context }: StateEnterParams) {
    const { resources } = this.context.app.loader;
    const result = new Result({
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

    result.point = context.correctSelectCount;
    this.context.app.stage.addChild(result.container);
  }
  onExit({ context }) {}
}

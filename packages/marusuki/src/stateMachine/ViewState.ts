import * as PIXI from "pixi-v6";
import { Interpreter, StateSchema } from "xstate";

import { AppContext, AppEvent } from ".";

export abstract class ViewState {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected context: {
      app: PIXI.Application;
      machineService: Interpreter<AppContext, StateSchema, AppEvent>;
    }
  ) {}

  protected abstract onEnter(): void;

  protected abstract onExit(): void;

  protected sendEvent(e: AppEvent): void {
    this.context.machineService.send(e);
  }
}

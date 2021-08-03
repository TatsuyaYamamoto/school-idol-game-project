import { Interpreter, StateSchema } from "xstate";

import { AppContext, AppEvent } from ".";
import { GameApp } from "../GameApp";

export abstract class ViewState {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected context: {
      app: GameApp;
      machineService: Interpreter<AppContext, StateSchema, AppEvent>;
    }
  ) {}

  protected abstract onEnter(): void;

  protected abstract onExit(): void;

  protected sendEvent(e: AppEvent): void {
    this.context.machineService.send(e);
  }
}

import { State, StateContext } from "..";

export class IdleState implements State {
  public static nodeKey = "@idle";

  private stateContext: StateContext;

  constructor(context: StateContext) {
    this.stateContext = context;
  }

  onEnter(): void {
    // do nothing
  }

  // eslint-disable-next-line
  onExit({ context }): void {
    // do nothing
  }
}

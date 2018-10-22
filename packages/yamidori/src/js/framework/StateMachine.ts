import State from "./State";

/**
 * Handle {@code State}.
 *
 * @class
 */
class StateMachine {
  private _currentState: State;
  private _states: Map<String, State> = new Map();

  constructor(states: { [key: string]: State }) {
    Object.keys(states).forEach(key => {
      this._states.set(key, states[key]);
    });
  }

  public update(elapsedTime: number): void {
    this._currentState.update(elapsedTime);
  }

  public init(firstStateTag): void {
    this._currentState = this._states.get(firstStateTag);
    this._currentState.onEnter();
  }

  public change(stateTag: string): void {
    const nextState = this._states.get(stateTag);
    if (!nextState) {
      throw new Error("Provided tag is not supported on the state machine.");
    }
    this._currentState.onExit();
    this._currentState = nextState;
    this._currentState.onEnter();
  }
}

export default StateMachine;

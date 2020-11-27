import State from "./State";
import Deliverable from "./Deliverable";

/**
 * Function type to convert {@link Deliverable} instance provided from {@link State#onExit}.
 */
export type DeliverableConverter = (source?: Deliverable) => Deliverable;

/**
 * Handle {@code State}.
 *
 * @class
 */
class StateMachine<S extends State> {
  private _currentState: S | undefined;

  private _states: Map<string | number, S> = new Map();

  public get current(): S | undefined {
    return this._currentState;
  }

  public update(elapsedTime: number): void {
    if (this._currentState) {
      this._currentState.update(elapsedTime);
    }
  }

  public add(states: { [key: string]: S }): void {
    Object.keys(states).forEach((key) => {
      this._states.set(key, states[key]);
    });
  }

  public clear(): void {
    this._states.clear();
  }

  public set(states: { [key: string]: S }): void {
    this.clear();
    this.add(states);
  }

  /**
   * Change state.
   * If there is not previous state, this method makes the state machine initialize.
   * Provided {@link params} is set as args of {@State#onEnter}.
   *
   * @param {string} stateTag
   * @param {D} params
   * @returns {S}
   */
  public change<D extends Deliverable>(
    stateTag: string | number,
    params?: D
  ): S {
    const nextState = this._states.get(stateTag);

    // Check provide state is defined.
    if (!nextState) {
      throw new Error("Provided tag is not supported on the state machine.");
    }

    // Make state exit, if there is previous state.
    if (this._currentState) {
      this._currentState.onExit();
    }

    // Set next state and make new state enter.
    this._currentState = nextState;
    this._currentState.onEnter(params || {});

    return this._currentState;
  }
}

export default StateMachine;

/**
 * Application state.
 * This is handled with {@code StateMachine}
 *
 * @interface
 */
interface State {
  /**
   * Fire when StateMachine that has the state is update.
   * @param elapsedTime
   */
  update(elapsedTime: number): void;

  /**
   * Fire when the state become current state in StateMachine.
   */
  onEnter(): void;

  /**
   * Fire when the state is no longer current state in StateMachine.
   */
  onExit(): void;
}

export default State;

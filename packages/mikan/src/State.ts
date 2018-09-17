/**
 * Application state.
 * This is handled with {@code StateMachine}
 *
 * @interface
 */
import Deliverable from "./Deliverable";

interface State {
  /**
   * Fire when StateMachine that has the state is update.
   * @param elapsedMS Time elapsed in milliseconds from last frame to this frame.
   */
  update(elapsedMS: number): void;

  /**
   * Fire when the state become current state in StateMachine.
   *
   * @param {Deliverable} params
   */
  onEnter(params: Deliverable): void;

  /**
   * Fire when the state is no longer current state in StateMachine.
   */
  onExit(): void;
}

export default State;

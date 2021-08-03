import { ViewState } from "../ViewState";

export class TitleState extends ViewState {
  onEnter(): void {
    setTimeout(() => {
      this.sendEvent({ type: "START_GAME" });
    }, 500);
  }

  onExit(): void {
    //
  }
}

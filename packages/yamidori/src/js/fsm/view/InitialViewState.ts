import ViewContainer from "../../framework/ViewContainer";
import Text from "../../container/sprite/text/Text";

import { Events } from "../ApplicationState";
import { dispatchEvent } from "../../framework/EventUtils";
import { isIOS, isSupportTouchEvent } from "../../framework/utils";
import { Ids } from "../../resources/string";
import { t } from "../../framework/i18n";

class InitialViewState extends ViewContainer {
  public static TAG = "InitialViewState";

  private _tapInfo: Text;

  /**
   * @inheritDoc
   */
  update(elapsedTime: number): void {}

  /**
   * @inheritDoc
   */
  onEnter(): void {
    super.onEnter();

    // TODO: Check login?

    if (isIOS()) {
      this._tapInfo = new Text(t(Ids.TAP_DISPLAY_INFO));
      this._tapInfo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
      this.addChild(this._tapInfo);

      window.addEventListener(
        isSupportTouchEvent() ? "touchstart" : "click",
        this._handleGoNextStateAction
      );
    } else {
      this._handleGoNextStateAction();
    }
  }

  /**
   * @inheritDoc
   */
  onExit(): void {
    super.onExit();

    if (isIOS()) {
      window.removeEventListener(
        isSupportTouchEvent() ? "touchstart" : "click",
        this._handleGoNextStateAction
      );
    }
  }

  private _handleGoNextStateAction(): void {
    dispatchEvent(Events.INITIALIZED);
  }
}

export default InitialViewState;

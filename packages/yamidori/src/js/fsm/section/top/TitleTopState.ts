import Sound from "pixi-sound/lib/Sound";
import { tracePage } from "@sokontokoro/mikan";

import { Events } from "../../view/TopViewState";
import { dispatchEvent } from "../../../framework/EventUtils";

import ViewContainer from "../../../framework/ViewContainer";
import TitleLogo from "../../../container/sprite/logo/TitleLogo";
import Text from "../../../container/sprite/text/Text";

import { isSupportTouchEvent } from "../../../framework/utils";
import { loadSound } from "../../../framework/AssetLoader";
import { t } from "../../../framework/i18n";

import { Ids } from "../../../resources/string";
import { Ids as SoundIds } from "../../../resources/sound";
import { TRACK_PAGES } from "../../../resources/tracker";

const { version } = require("../../../../../package.json");

class TitleTopState extends ViewContainer {
  public static TAG = "TitleTopState";

  private _titleLog: TitleLogo;
  private _appVersion: Text;
  private _tapInfoText: Text;

  private _okSound: Sound;

  /**
   * @inheritDoc
   */
  update(elapsedTimeMillis: number): void {}

  /**
   * @inheritDoc
   */
  onEnter(): void {
    super.onEnter();

    tracePage(TRACK_PAGES.TOP);

    this._titleLog = new TitleLogo();
    this._titleLog.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

    this._appVersion = new Text(`v${version}`, {
      fontSize: 40
    });
    this._appVersion.position.set(this.viewWidth * 0.1, this.viewHeight * 0.95);

    this._tapInfoText = new Text(t(Ids.TAP_DISPLAY_INFO), {
      fontSize: 40
    });
    this._tapInfoText.position.set(this.viewWidth * 0.5, this.viewHeight * 0.9);

    this.applicationLayer.addChild(
      this._titleLog,
      this._appVersion,
      this._tapInfoText
    );

    this._okSound = loadSound(SoundIds.SOUND_OK);

    window.addEventListener(
      isSupportTouchEvent() ? "touchstart" : "click",
      this.onWindowTap
    );
  }

  /**
   * @inheritDoc
   */
  onExit(): void {
    super.onExit();
  }

  private onWindowTap = (): void => {
    this._okSound.play();
    dispatchEvent(Events.REQUEST_GO_TO_MENU);
    window.removeEventListener(
      isSupportTouchEvent() ? "touchstart" : "click",
      this.onWindowTap
    );
  };
}

export default TitleTopState;

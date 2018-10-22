import { parse } from "query-string";

import {
  Deliverable,
  dispatchEvent,
  t,
  play,
  tracePage
} from "@sokontokoro/mikan";

import TopViewState from "./TopViewState";
import { Events } from "../TopView";

import TitleLogo from "../../../texture/sprite/TitleLogo";
import Text from "../../../texture/internal/Text";

import { VirtualPageViews } from "../../../helper/tracker";

import Mode from "../../../models/Mode";

import { Ids as SoundIds } from "../../../resources/sound";
import { Ids as StringIds } from "../../../resources/string";

const { version } = require("../../../../../package.json");

class TitleState extends TopViewState {
  private _titleLogo: TitleLogo;
  private _appVersion: Text;
  private _tapInfoText: Text;

  /**
   * @override
   */
  update(elapsedMS: number): void {
    super.update(elapsedMS);
    this.background.progress(elapsedMS);
  }

  /**
   * @override
   */
  onEnter(params: Deliverable): void {
    super.onEnter(params);

    // Tracking
    tracePage(VirtualPageViews.TITLE);

    this._titleLogo = new TitleLogo();
    this._titleLogo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);

    this._appVersion = new Text(`v${version}`, {
      fontSize: 20,
      stroke: "#ffffff",
      strokeThickness: 1
    });
    this._appVersion.position.set(this.viewWidth * 0.9, this.viewHeight * 0.95);

    this._tapInfoText = new Text(t(StringIds[StringIds.TAP_DISPLAY_INFO]), {
      fontSize: 40,
      stroke: "#ffffff",
      strokeThickness: 2
    });
    this._tapInfoText.position.set(this.viewWidth * 0.5, this.viewHeight * 0.9);

    this.backGroundLayer.addChild(this.background);
    this.applicationLayer.addChild(
      this._titleLogo,
      this._tapInfoText,
      this._appVersion
    );

    const { gameId } = parse(window.location.search);
    this.clearQueryString();

    if (!gameId) {
      this.addClickWindowEventListener(this._handleTapWindow);
    } else {
      const mode = Mode.MULTI_ONLINE;
      dispatchEvent(Events.FIXED_PLAY_MODE, { mode, gameId });
    }
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();
    this.removeClickWindowEventListener(this._handleTapWindow);
  }

  private _handleTapWindow = () => {
    dispatchEvent(Events.TAP_TITLE);

    play(SoundIds.SOUND_OK);
  };

  private clearQueryString = () => {
    const url = `${location.protocol}//${location.host}${location.pathname}`;
    history.replaceState(null, null, url);
  };
}

export default TitleState;

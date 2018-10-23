import Sound from "pixi-sound/lib/Sound";
import {
  tracePage,
  trackEvent,
  Playlog,
  tweetByWebIntent,
  convertYyyyMmDd,
  createUrchinTrackingModuleQuery
} from "@sokontokoro/mikan";

import { Events as ApplicationEvents } from "../../ApplicationState";
import { dispatchEvent } from "../../../framework/EventUtils";

import ViewContainer from "../../../framework/ViewContainer";
import GameOverLogo from "../../../container/sprite/logo/GameOverLogo";
import GameRestartButton from "../../../container/sprite/button/GameRestartButton";
import GoBackHomeButton from "../../../container/sprite/button/GoBackHomeButton";
import ResultTweetButton from "../../../container/sprite/button/ResultTweetButton";
import GamePointCount from "../../../container/components/GamePointCount";

import { getRandomInteger } from "../../../framework/utils";
import { loadSound } from "../../../framework/AssetLoader";
import { getGamePoint } from "../../../helper/GlobalState";
import { t } from "../../../framework/i18n";

import { URL } from "../../../Constants";
import { Ids as SoundIds } from "../../../resources/sound";
import { Ids } from "../../../resources/string";
import { TRACK_ACTION, TRACK_PAGES } from "../../../resources/tracker";

class OverGameState extends ViewContainer {
  public static TAG = "OverGameState";

  private _gameOverLogo: GameOverLogo;
  private _gameRestartButton: GameRestartButton;
  private _goBackHomeButton: GoBackHomeButton;
  private _resultTweetButton: ResultTweetButton;

  private _gamePointCount: GamePointCount;

  private _gameOverSound: Sound;
  private _okSound: Sound;
  private _cancelSound: Sound;

  update(elapsedTime: number): void {}

  onEnter(): void {
    super.onEnter();
    const point = getGamePoint();

    tracePage(TRACK_PAGES.GAMEOVER);

    trackEvent(TRACK_ACTION.GAMEOVER, {
      label: "single",
      value: point
    });

    Playlog.save("yamidori", "kotori", point);

    this._gameOverLogo = new GameOverLogo();
    this._gameOverLogo.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.5
    );

    this._gameRestartButton = new GameRestartButton();
    this._gameRestartButton.position.set(
      this.viewWidth * 0.15,
      this.viewHeight * 0.45
    );
    this._gameRestartButton.setOnClickListener(this.handleTapRestartGame);

    this._goBackHomeButton = new GoBackHomeButton();
    this._goBackHomeButton.position.set(
      this.viewWidth * 0.85,
      this.viewHeight * 0.45
    );
    this._goBackHomeButton.setOnClickListener(this.handleTapGoBackHome);

    this._resultTweetButton = new ResultTweetButton();
    this._resultTweetButton.position.set(
      this.viewWidth * 0.85,
      this.viewHeight * 0.15
    );
    this._resultTweetButton.setOnClickListener(this.handleTapResultTweet);

    this._gamePointCount = new GamePointCount();
    this._gamePointCount.position.set(
      this.viewWidth * 0.22,
      this.viewHeight * 0.15
    );
    this._gamePointCount.rotation = -1 * Math.PI * 0.02;
    this._gamePointCount.point = getGamePoint();

    this.applicationLayer.addChild(
      this._gameOverLogo,
      this._gameRestartButton,
      this._goBackHomeButton,
      this._resultTweetButton,
      this._gamePointCount
    );

    this._gameOverSound = loadSound(SoundIds.SOUND_GAME_END);
    this._okSound = loadSound(SoundIds.SOUND_OK);
    this._cancelSound = loadSound(SoundIds.SOUND_CANCEL);

    this._gameOverSound.play();
  }

  onExit(): void {
    super.onExit();
    this._gameOverSound.stop();
  }

  private handleTapGoBackHome = () => {
    this._cancelSound.play();

    trackEvent(TRACK_ACTION.CLICK, { label: "back_from_gameover" });
    dispatchEvent(ApplicationEvents.BACK_TO_TOP_REQUEST);
  };

  private handleTapRestartGame = () => {
    this._okSound.play();

    trackEvent(TRACK_ACTION.CLICK, { label: "restart" });
    dispatchEvent(ApplicationEvents.GAME_START_REQUEST);
  };

  /**
   * Request to tweet game result with game point.
   *
   * @private
   */
  private handleTapResultTweet = () => {
    trackEvent(TRACK_ACTION.CLICK, { label: "tweet" });

    let text = t(Ids.GAME_RESULT_TWEET_ZERO_POINT);

    if (getGamePoint() !== 0) {
      switch (getRandomInteger(0, 2)) {
        case 0:
          text = t(Ids.GAME_RESULT_TWEET1);
          break;
        case 1:
          text = t(Ids.GAME_RESULT_TWEET2);
          break;
        case 2:
          text = t(Ids.GAME_RESULT_TWEET3);
          break;
      }
      text = text.replace(/%s/, `${getGamePoint()}`);
    }

    const yyyymmdd = convertYyyyMmDd(new Date());
    const utmQuery = createUrchinTrackingModuleQuery({
      campaign: `result-share_${yyyymmdd}`,
      source: "twitter",
      medium: "social"
    });
    const url = `${URL.YAMIDORI}?${utmQuery.join("&")}`;

    tweetByWebIntent({
      text,
      url,
      hashtags: ["やみどり", "そこんところ工房"]
    });
  };
}

export default OverGameState;

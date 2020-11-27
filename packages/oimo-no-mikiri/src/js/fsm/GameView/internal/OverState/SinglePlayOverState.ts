import {
  convertYyyyMmDd,
  createUrchinTrackingModuleQuery,
  getRandomInteger,
  Playlog,
  t,
  trackEvent,
  tweetByWebIntent,
} from "@sokontokoro/mikan";

import {
  default as OverState,
  EnterParams as AbstractEnterParams,
} from "./OverState";

import TweetButton from "../../../../texture/sprite/button/TweetButton";
import StraightWins from "../../../../texture/containers/GameResultPaper/StraightWins";

import { Action, Category } from "../../../../helper/tracker";
import { Ids as StringIds } from "../../../../resources/string";
import { URL } from "../../../../Constants";

export interface EnterParams extends AbstractEnterParams {
  straightWins: number;
}

class SinglePlayOverState extends OverState {
  private _straightWins: StraightWins;
  private _tweetButton: TweetButton;

  protected get straightWins(): StraightWins {
    return this._straightWins;
  }

  protected get tweetButton(): TweetButton {
    return this._tweetButton;
  }

  onEnter(params: EnterParams): void {
    super.onEnter(params);

    this._straightWins = new StraightWins(params.straightWins);
    this._straightWins.position.set(0, -1 * this.resultPaper.height * 0.3);

    this._tweetButton = new TweetButton();
    this._tweetButton.position.set(
      this.viewWidth * 0.15,
      this.viewHeight * 0.2
    );
    this._tweetButton.setOnClickListener(() =>
      this._onClickTweetButton(bestTime, straightWins)
    );

    this.resultPaper.addChild(this.straightWins);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this.restartButton,
      this.backToTopButton,
      this.resultPaper,
      this.tweetButton,
      this.gameOverLogo
    );

    const { bestTime, straightWins, mode, round } = params;

    // logging
    Playlog.save("oimo-no-mikiri", "hanamaru", bestTime, {
      mode,
      straightWins,
      round,
    }).then(() => {});
  }

  private _onClickTweetButton = (bestTime: number, wins: number) => {
    trackEvent(Action.TAP, {
      category: Category.BUTTON,
      label: "result_tweet",
    });

    let tweetText =
      getRandomInteger(0, 1) === 0
        ? t(StringIds[StringIds.GAME_RESULT_TWEET1], { bestTime, wins })
        : t(StringIds[StringIds.GAME_RESULT_TWEET2], { bestTime, wins });

    if (wins === 0) {
      tweetText = t(StringIds[StringIds.GAME_RESULT_TWEET_ZERO_POINT], {
        wins,
      });
    }

    if (wins === 5) {
      tweetText = t(StringIds[StringIds.GAME_RESULT_TWEET_COMPLETE], {
        bestTime,
        wins,
      });
    }

    const yyyymmdd = convertYyyyMmDd(new Date());
    const utmQuery = createUrchinTrackingModuleQuery({
      campaign: `result-share_${yyyymmdd}`,
      source: "twitter",
      medium: "social",
    });
    const url = `${URL.OIMO_NO_MIKIRI}?${utmQuery.join("&")}`;
    const hashtags = ["おいものみきり", "そこんところ工房"];
    tweetByWebIntent({
      text: tweetText,
      url,
      hashtags,
    });
  };
}

export default SinglePlayOverState;

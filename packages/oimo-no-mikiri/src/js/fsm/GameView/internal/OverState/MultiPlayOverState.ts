import {
  convertYyyyMmDd,
  createUrchinTrackingModuleQuery,
  t,
  trackEvent,
  tweetByWebIntent,
} from "@sokontokoro/mikan";

import OverState, { EnterParams as AbstractEnterParams } from "./OverState";

import PlayerWins from "../../../../texture/containers/GameResultPaper/PlayerWins";
import TweetButton from "../../../../texture/sprite/button/TweetButton";

import Actor from "../../../../models/Actor";

import { Action, Category } from "../../../../helper/tracker";
import { Ids as StringIds } from "../../../../resources/string";
import { URL } from "../../../../Constants";

export interface EnterParams extends AbstractEnterParams {
  onePlayerWins: number;
  twoPlayerWins: number;
}

class MultiPlayOverState extends OverState {
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    const { winner, onePlayerWins, twoPlayerWins } = params;

    const onePlayerWinsText = new PlayerWins(1, params.onePlayerWins);
    onePlayerWinsText.position.set(
      -1 * this.resultPaper.width * 0.25,
      -1 * this.resultPaper.height * 0.3
    );

    const twoPlayerWinsText = new PlayerWins(2, params.twoPlayerWins);
    twoPlayerWinsText.position.set(
      this.resultPaper.width * 0.25,
      -1 * this.resultPaper.height * 0.3
    );

    const tweetButton = new TweetButton();
    tweetButton.position.set(this.viewWidth * 0.15, this.viewHeight * 0.2);
    tweetButton.setOnClickListener(() =>
      this._onClickTweetButton(
        winner,
        Math.max(onePlayerWins, twoPlayerWins),
        Math.min(onePlayerWins, twoPlayerWins)
      )
    );

    this.resultPaper.addChild(onePlayerWinsText, twoPlayerWinsText);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this.restartButton,
      this.backToTopButton,
      this.resultPaper,
      this.gameOverLogo,
      tweetButton
    );
  }

  private _onClickTweetButton = (winner: Actor, winnerWins, loserWins) => {
    trackEvent(Action.TAP, {
      category: Category.BUTTON,
      label: "result_tweet",
    });

    let tweetText;
    if (winner === Actor.PLAYER) {
      tweetText = t(StringIds[StringIds.MULTI_GAME_RESULT_TWEET_HANAMARU_WIN], {
        winnerWins,
        loserWins,
      });
    }

    if (winner === Actor.OPPONENT) {
      tweetText = t(StringIds[StringIds.MULTI_GAME_RESULT_TWEET_RUBY_WIN], {
        winnerWins,
        loserWins,
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

export default MultiPlayOverState;

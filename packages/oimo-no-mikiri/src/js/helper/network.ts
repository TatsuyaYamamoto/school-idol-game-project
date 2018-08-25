/**
 * @fileOverview convenience functions related to network, WebAPI and browser location.
 */
import { t, getRandomInteger } from "mikan";

import Mode from "../models/Mode";
import Actor from "../models/Actor";

import { Ids as StringIds } from "../resources/string";
import { APP_SERVER_BASE_URL, URL } from "../Constants";

/**
 * Convenience function to change browser location.
 *
 * @param {string} href
 */
export function goTo(href: string): void {
  window.location.href = href;
}

/**
 * Change browser location to ResultState tweet view in Twitter.
 *
 * @param {number} bestTime
 * @param {number} wins
 */
export function tweetGameResult(bestTime: number, wins: number): void {
  let tweetText =
    getRandomInteger(0, 1) === 0
      ? t(StringIds.GAME_RESULT_TWEET1, { bestTime, wins })
      : t(StringIds.GAME_RESULT_TWEET2, { bestTime, wins });

  if (wins === 0) {
    tweetText = t(StringIds.GAME_RESULT_TWEET_ZERO_POINT, { wins });
  }

  if (wins === 5) {
    tweetText = t(StringIds.GAME_RESULT_TWEET_COMPLETE, { bestTime, wins });
  }

  goTo(
    `${
      URL.TWITTER_TWEET_PAGE
    }?hashtags=おいものみきり+%23そこんところ工房&text=${tweetText}&url=${
      URL.OIMO_NO_MIKIRI
    }`
  );
}

export function tweetMultiPlayResult(winner: Actor, winnerWins, loserWins) {
  if (winner === Actor.PLAYER) {
    const tweetText = t(StringIds.MULTI_GAME_RESULT_TWEET_HANAMARU_WIN, {
      winnerWins,
      loserWins
    });
    goTo(
      `${
        URL.TWITTER_TWEET_PAGE
      }?hashtags=おいものみきり+%23そこんところ工房&text=${tweetText}&url=${
        URL.OIMO_NO_MIKIRI
      }`
    );
    return;
  }

  if (winner === Actor.OPPONENT) {
    const tweetText = t(StringIds.MULTI_GAME_RESULT_TWEET_RUBY_WIN, {
      winnerWins,
      loserWins
    });
    goTo(
      `${
        URL.TWITTER_TWEET_PAGE
      }?hashtags=おいものみきり+%23そこんところ工房&text=${tweetText}&url=${
        URL.OIMO_NO_MIKIRI
      }`
    );
    return;
  }
}

/**
 * Post play log to Sokontokoro app server
 * Before connecting, format bestTime, mode and straightWins to supporting Integer.
 *
 *
 * @param {number} bestTime
 * @param {"beginner" | "novice" | "expert" | "two-players"} mode
 * @param {number} straightWins
 * @return {Promise<Response>}
 * @see https://github.com/TatsuyaYamamoto/lovelive-ranking/blob/master-javaee/src/main/java/net/sokontokoro_factory/lovelive/persistence/entity/ScoreEntity.java
 */
export function postPlayLog(
  bestTime: number,
  mode: Mode,
  straightWins: number
): Promise<Response> {
  // TODO: implements Mode.MULTI_ONLINE case
  const numberLevel =
    mode === Mode.MULTI_LOCAL
      ? 4
      : mode === Mode.SINGLE_BEGINNER
        ? 1
        : mode === Mode.SINGLE_NOVICE
          ? 2
          : 3;

  const point = `${bestTime}${numberLevel}${straightWins}`;

  return fetch(`${APP_SERVER_BASE_URL}scores/oimo/playlog/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ point })
  });
}

export function showTweetView(text: string, url?: string) {
  // TODO Support URL scheme.

  tweetByWebIntent({
    text,
    url,
    hashtags: ["おいものみきり", "そこんところ工房"]
  });
}

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
type webIntentParams = {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
};

let windowObjectReference = null;

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
export function tweetByWebIntent(params: webIntentParams) {
  const endpoint = "https://twitter.com/intent/tweet";
  const hashtags = encodeURIComponent(params.hashtags.join(","));
  const text = encodeURIComponent(params.text);
  const url = encodeURIComponent(params.url);

  const intentUrl = `${endpoint}?text=${text}&url=${url}&hashtags=${hashtags}`;

  console.log(intentUrl);

  if (!windowObjectReference || windowObjectReference.closed) {
    windowObjectReference = window.open(intentUrl, "TwitterIntentWindowName");
  } else {
    windowObjectReference.focus();
  }
}

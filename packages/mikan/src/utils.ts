/**
 * @fileOverview Convenience utilities.
 */
import config from "./config";
import { getLogger } from "./logger";

const logger = getLogger("mikan:util");

/**
 * Detecting iOS
 * Return true if the user's device is iOS.
 *
 * @see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
 */
export function isIOS(): boolean {
  return !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Return current view size in according to calculated aspect ratio with {@link config}.
 *
 * @returns {{width: number; height: number}}
 */
export function getCurrentViewSize(): { width: number; height: number } {
  const currentWindowAspectRatio = window.innerWidth / window.innerHeight;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const aspectRatio = config.basicImageWidth / config.basicImageHeight;

  // horizontally long then expected ratio.
  if (aspectRatio < currentWindowAspectRatio) {
    width = window.innerHeight * aspectRatio;
  }

  // vertically long then expected ratio.
  if (currentWindowAspectRatio < aspectRatio) {
    height = window.innerWidth / aspectRatio;
  }

  return { width, height };
}

/**
 * Return view size ratio of current window size to application basic size.
 *
 * @return {number}
 */
export function getScale(): number {
  const { width } = getCurrentViewSize();
  return width / config.basicImageWidth;
}

export function isSupportPointerEvents(): boolean {
  return "onpointerdown" in window;
}

/**
 * Return true if running browser is supporting touch events.
 * @see https://github.com/Modernizr/Modernizr/blob/v3.3.1/feature-detects/touchevents.js
 * @return {boolean}
 */
export function isSupportTouchEvents(): boolean {
  return "ontouchstart" in window;
}

/**
 * @deprecated
 */
export function isSupportTouchEvent(): boolean {
  return "ontouchstart" in window;
}

export const pointerdown: "pointerdown" | "touchstart" | "mousedown" = (() => {
  if (isSupportPointerEvents()) {
    return "pointerdown";
  }
  if (isSupportTouchEvents()) {
    return "touchstart";
  }

  return "mousedown";
})();

/**
 * Get integer. this value is generated randomly between min and max.
 *
 * @param min
 * @param max
 * @return {number}
 */
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

/**
 * Copy text to clipboard.
 *
 * @param text
 * @return {boolean}
 */
export function copyTextToClipboard(text: string): boolean {
  const copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;

  document.body.appendChild(copyFrom);

  copyFrom.focus();
  copyFrom.setSelectionRange(0, text.length);

  const isSucceed = document.execCommand("copy");

  if (isSucceed) {
    console.log(`Succeed to copy to clipboard. target: ${text}`);
  } else {
    console.error(`Failed to copy to clipboard.  target: ${text}`);
  }

  document.body.removeChild(copyFrom);

  return isSucceed;
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });
}

export function vibrate(patternMillis: number | number[]) {
  if (!navigator.vibrate) {
    console.warn("Vibrate API is not supporting.");
    return;
  }

  const isSucceed = navigator.vibrate(patternMillis);

  if (!isSucceed) {
    console.error("Failed to vibrate.");
  }
}

export function getCurrentUrl(
  option: { path: boolean; hash: boolean } = { path: true, hash: true }
): string {
  const protocol = location.protocol;
  const host = location.hostname;
  const path = option.path ? location.pathname : "";
  const hash = option.hash ? location.hash : "";
  const port =
    !location.port || location.port === "80" ? `` : `:${location.port}`;

  return protocol + "//" + host + port + path + hash;
}

/**
 * @see https://support.google.com/analytics/answer/1033863?hl=ja
 * @see https://support.google.com/urchin/answer/28307?hl=en
 */
export interface UrchinTrackingModuleParams {
  // プロパティにトラフィックを誘導した広告主、サイト、出版物、その他を識別します（Google、ニュースレター 4、屋外広告など）
  // 例) summer-mailer: サマーセール用のメール キャンペーン経由のトラフィックを識別
  source: string;
  // 広告メディアやマーケティング メディアを識別します（CPC 広告、バナー、メール ニュースレターなど）。
  // 例) email: メール キャンペーンとアプリ内キャンペーン経由のトラフィックを識別
  medium: string;
  // 商品のキャンペーン名、テーマ、プロモーション コードなどを指定します。
  // 例) summer-sale: キャンペーン全体のトラフィックを識別
  campaign: string;

  // 有料検索向けキーワードを特定します。検索広告キャンペーンにタグを設定する場合は、utm_term を使用してキーワードを指定することができます。
  term?: string;
  // 似通ったコンテンツや同じ広告内のリンクを区別するために使用します。
  // たとえば、メールのメッセージに行動を促すフレーズのリンクが 2 つある場合は、utm_content を使用して別々の値を設定し、どちらが効果的か判断できます。
  content?: string;
}

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 * @see https://ga-dev-tools.appspot.com/campaign-url-builder/
 */
export interface WebIntentParams {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

const TWITTER_INTENT_ENDPOINT = "https://twitter.com/intent/tweet";

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
export function tweetByWebIntent(
  params: WebIntentParams,
  utm: UrchinTrackingModuleParams
) {
  const queries: string[] = [];

  if (!!params.hashtags) {
    queries.push(`hashtags=${encodeURIComponent(params.hashtags.join(","))}`);
  }
  if (!!params.text) {
    queries.push(`text=${encodeURIComponent(params.text)}`);
  }
  if (!!params.url) {
    let url = params.url.endsWith("?") ? params.url : params.url + "?";

    url += `&utm_source=${utm.source}`;

    if (utm.medium) {
      url += `&utm_medium=${utm.medium}`;
    }

    if (utm.content) {
      url += `&utm_content=${utm.content}`;
    }

    if (utm.campaign) {
      url += `&utm_campaign=${utm.campaign}`;
    }

    queries.push(`url=${encodeURIComponent(url)}`);
  }
  if (!!params.via) {
    queries.push(`via=${encodeURIComponent(params.via)}`);
  }

  const url = `${TWITTER_INTENT_ENDPOINT}?${queries.join("&")}`;

  openExternalSite(url);
}

/**
 * Open provided URL with new window.
 * if denied to open new window; popup permission, security error..., try change window#location.
 *
 * @param popup
 * @param url
 */
export function openExternalSite(url: string, popup: boolean = true) {
  logger.debug(`open external site; ${url}`);

  if (!popup) {
    window.location.href = url;
    return;
  }
  window.open(url);

  setTimeout(() => {
    if (!window.document.hasFocus()) {
      // success to open new window
      return;
    }

    logger.info(
      `fail to open with new window object. change location to; ${url}`
    );

    window.location.href = url;
  }, 500);
}

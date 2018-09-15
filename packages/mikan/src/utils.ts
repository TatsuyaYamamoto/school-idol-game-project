/**
 * @fileOverview Convenience utilities.
 */
import config from "./config";

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

/**
 * Return true if running browser is supporting touch events.
 * @see https://github.com/Modernizr/Modernizr/blob/v3.3.1/feature-detects/touchevents.js
 * @return {boolean}
 */
export function isSupportTouchEvent(): boolean {
  return "ontouchstart" in window;
}

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
export function copyTextToClipboard(text): boolean {
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

export function getCurrentUrl(): string {
  const protocol = location.protocol;
  const host = location.hostname;
  const path = location.pathname;
  const port =
    !location.port || location.port === "80" ? `` : `:${location.port}`;

  return protocol + "//" + host + port + path;
}

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
interface WebIntentParams {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

const TWITTER_INTENT_ENDPOINT = "https://twitter.com/intent/tweet";
let WindowObjectReference: Window | null = null;

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
export function tweetByWebIntent(params: WebIntentParams, popup = false) {
  const queries: string[] = [];

  if (!!params.hashtags) {
    queries.push(`hashtags=${encodeURIComponent(params.hashtags.join(","))}`);
  }
  if (!!params.text) {
    queries.push(`text=${encodeURIComponent(params.text)}`);
  }
  if (!!params.url) {
    queries.push(`url=${encodeURIComponent(params.url)}`);
  }
  if (!!params.via) {
    queries.push(`via=${encodeURIComponent(params.via)}`);
  }

  const intentUrl = `${TWITTER_INTENT_ENDPOINT}?${queries.join("&")}`;

  if (WindowObjectReference && !WindowObjectReference.closed) {
    WindowObjectReference.close();
  }

  WindowObjectReference = window.open(intentUrl, "TwitterIntentWindowName");
}

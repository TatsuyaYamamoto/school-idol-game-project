/**
 * @fileOverview Convenience utilities.
 */
import PixiSound from "pixi-sound/lib";
import { trackEvent } from "@sokontokoro/mikan";

import config from "./config";
import { TRACK_ACTION } from "../resources/tracker";

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
  if (aspectRatio < currentWindowAspectRatio)
    width = window.innerHeight * aspectRatio;

  // vertically long then expected ratio.
  if (currentWindowAspectRatio < aspectRatio)
    height = window.innerWidth / aspectRatio;

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
 * Toggle muted property for all sounds.
 *
 * @return {boolean} if all sounds are muted.
 */
export function toggleMute(): boolean {
  if (PixiSound.context.muted) {
    trackEvent(TRACK_ACTION.CLICK, { label: "sound_on" });
    PixiSound.unmuteAll();
  } else {
    trackEvent(TRACK_ACTION.CLICK, { label: "sound_off" });
    PixiSound.muteAll();
  }

  return PixiSound.context.muted;
}

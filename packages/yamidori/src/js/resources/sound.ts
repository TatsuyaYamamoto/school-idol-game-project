/**
 * @fileOverview Sound resource manifest.
 * It's used to load with {@link AssetLoader#setSoundManifest}
 */
import { SoundManifest } from "../framework/AssetLoader";

export const Ids = {
  SOUND_ZENKAI: "SOUND_ZENKAI",
  SOUND_GAME_LOOP: "SOUND_GAME_LOOP",
  SOUND_GAME_END: "SOUND_GAME_END",
  SOUND_OK: "OK",
  SOUND_CANCEL: "SOUND_CANCEL",
  SOUND_TOGGLE_SOUND: "SOUND_TOGGLE_SOUND",
  SOUND_COUNT_HIGH: "SOUND_COUNT_HIGH",
  SOUND_COUNT_LOW: "SOUND_COUNT_LOW",
  SOUND_TAP_KOTORI: "SOUND_TAP_KOTORI",
};

const manifest: SoundManifest = {
  [Ids.SOUND_ZENKAI]: "zenkai.mp3",
  [Ids.SOUND_GAME_LOOP]: "game_loop.mp3",
  [Ids.SOUND_GAME_END]: "game_end.mp3",
  [Ids.SOUND_OK]: "ok.mp3",
  [Ids.SOUND_CANCEL]: "cancel.mp3",
  [Ids.SOUND_TOGGLE_SOUND]: "toggle_sound.mp3",
  [Ids.SOUND_COUNT_HIGH]: "count_high.mp3",
  [Ids.SOUND_COUNT_LOW]: "count_low.mp3",
  [Ids.SOUND_TAP_KOTORI]: "tap_kotori.mp3",
};

export default manifest;

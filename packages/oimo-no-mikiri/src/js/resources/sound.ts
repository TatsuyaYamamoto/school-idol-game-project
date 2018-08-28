/**
 * @fileOverview Sound resource manifest.
 * It's used to load with {@link AssetLoader#setSoundManifest}
 */
import { SoundManifest } from "@sokontokoro/mikan";

export enum Ids {
  SOUND_OK,
  SOUND_CANCEL,
  SOUND_TOGGLE_SOUND,

  SOUND_ZENKAI,
  SOUND_WAVE_LOOP,
  SOUND_HARISEN,
  SOUND_ATTACK,
  SOUND_READY,
  SOUND_FALSE_START,
  SOUND_DRAW
}

const manifest: SoundManifest = {
  [Ids.SOUND_OK]: "ok.mp3",
  [Ids.SOUND_CANCEL]: "cancel.mp3",
  [Ids.SOUND_TOGGLE_SOUND]: "toggle_sound.mp3",

  [Ids.SOUND_ZENKAI]: "zenkai.mp3",
  [Ids.SOUND_WAVE_LOOP]: "wave_loop.mp3",
  [Ids.SOUND_HARISEN]: "harisen.mp3",
  [Ids.SOUND_ATTACK]: "attack.mp3",
  [Ids.SOUND_READY]: "ready.mp3",
  [Ids.SOUND_FALSE_START]: "false_start.mp3",
  [Ids.SOUND_DRAW]: "draw.mp3"
};

export default manifest;

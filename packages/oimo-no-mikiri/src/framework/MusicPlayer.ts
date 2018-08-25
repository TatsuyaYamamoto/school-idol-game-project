/**
 * @fileOverview convenient methods to play {@link Sound}s.
 * Sound resources provided from {@link loadSound} is one instance only.
 * Because of that, load a sound from cache of loader each time before invoking them.
 */
import { default as PixiSound } from "pixi-sound/lib";
import Sound from "pixi-sound/lib/Sound";

import { loadSound } from "./AssetLoader";

export function play(soundId: string | number, volume?: number) {
  const sound = loadSound(soundId);
  const v = sound.volume;
  const completed = () => {
    sound.volume = v;
  };

  if (volume) {
    sound.volume = volume;
  }

  sound.play(completed);
}

export function playOnLoop(soundId: string | number, volume?: number) {
  const sound = loadSound(soundId);
  const v = sound.volume;
  const completed = () => {
    sound.volume = v;
  };

  if (volume) {
    sound.volume = volume;
  }

  sound.play({ loop: true }, completed);
}

export function stop(soundId: string | number) {
  loadSound(soundId).stop();
}

/**
 * Toggle muted property for all sounds.
 *
 * @return {boolean} if all sounds are muted.
 */
export function toggleSound(turn?: "on" | "off"): boolean {
  switch (turn) {
    case "on":
      PixiSound.unmuteAll();
      break;

    case "off":
      PixiSound.muteAll();
      break;

    default:
      if (PixiSound.context.muted) {
        PixiSound.unmuteAll();
      } else {
        PixiSound.muteAll();
      }

      break;
  }
  return PixiSound.context.muted;
}

export function isMute(): boolean {
  return PixiSound.context.muted;
}

export function resumeContext(): Promise<void> {
  return PixiSound.context.audioContext.resume();
}

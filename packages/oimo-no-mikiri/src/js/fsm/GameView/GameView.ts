import {
  ViewContainer,
  Deliverable,
  play,
  playOnLoop,
  stop,
  dispatchEvent,
  tracePage
} from "@sokontokoro/mikan";

import Player from "../../texture/sprite/character/Player";
import Opponent from "../../texture/sprite/character/Opponent";

import Hanamaru from "../../texture/sprite/character/Hanamaru";
import Ruby from "../../texture/sprite/character/Ruby";

import Uchicchi from "../../texture/sprite/character/Uchicchi";
import Shitake from "../../texture/sprite/character/Shitake";
import LittleDeamon from "../../texture/sprite/character/LittleDeamon";
import Wataame from "../../texture/sprite/character/Wataame";
import EnemyRuby from "../../texture/sprite/character/EnemyRuby";

import Game, { isSingleMode } from "../../models/Game";

import { VirtualPageViews } from "../../helper/tracker";

import { Ids as SoundIds } from "../../resources/sound";
import { Events as AppEvents } from "../ApplicationState";

export enum Events {
  REQUEST_READY = "GameView@REQUEST_READY",
  IS_READY = "GameView@IS_READY",
  ATTACK = "GameView@ATTACK",
  FIXED_RESULT = "GameView@FIXED_RESULT",
  RESTART_GAME = "GameView@RESTART_GAME",
  BACK_TO_TOP = "GameView@BACK_TO_TOP"
}

export interface EnterParams extends Deliverable {
  game: Game;
}

export enum InnerStates {
  READY = "ready",
  ACTION = "action",
  RESULT = "result",
  OVER = "over"
}

abstract class GameView extends ViewContainer {
  private _game: Game;

  private _player: Player;
  /**
   * 2Player's character for multi play mode.
   */
  private _opponent: Opponent;

  /**
   * Opponents for single play mode.
   */
  private _opponents: { [roundNumber: number]: Opponent };

  public get player(): Player {
    return this._player;
  }

  public get opponent(): Opponent {
    if (isSingleMode(this.game.mode)) {
      return this._opponents[this._game.currentRound];
    }
    return this._opponent;
  }

  public get game(): Game {
    return this._game;
  }

  /**
   * @override
   */
  update(elapsedTime: number): void {
    super.update(elapsedTime);
    this.stateMachine.update(elapsedTime);
  }

  /**
   * @override
   */
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    playOnLoop(SoundIds.SOUND_WAVE_LOOP, 0.2);

    // Tracking
    tracePage(VirtualPageViews.GAME);

    this._game = params.game;

    this._player = new Hanamaru();

    if (isSingleMode(this.game.mode)) {
      this._opponents = {};
      this._opponents[1] = new Wataame();
      this._opponents[2] = new LittleDeamon();
      this._opponents[3] = new Shitake();
      this._opponents[4] = new Uchicchi();
      this._opponents[5] = new EnemyRuby();
    } else {
      this._opponent = new Ruby();
    }
  }

  /**
   * @override
   */
  onExit(): void | Deliverable {
    super.onExit();

    stop(SoundIds.SOUND_WAVE_LOOP);
  }

  protected onAttacked(e: CustomEvent) {
    const { attacker, attackTime } = e.detail;

    this.game.currentBattle.attack(attacker, attackTime);
  }

  protected onBackToTopRequested() {
    // prevent to propagate to invoke tap event on title view.
    setTimeout(() => dispatchEvent(AppEvents.REQUESTED_BACK_TO_TOP), 1);

    stop(SoundIds.SOUND_WAVE_LOOP);
    play(SoundIds.SOUND_CANCEL);
  }
}

export default GameView;

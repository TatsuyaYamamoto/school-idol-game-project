import Battle from "./Battle";
import Actor from "./Actor";
import Mode from "./Mode";
import EventEmitter from "./online/EventEmitter";
import { DEFAULT_ROUND_SIZE } from "../Constants";

abstract class Game extends EventEmitter {
  protected _mode: Mode;
  protected _roundSize: number;
  protected _currentRound: number;
  protected _battles: Map<number, Battle>;

  constructor(mode: Mode, roundSize?: number) {
    super();
    this._mode = mode;
    this._roundSize = roundSize || DEFAULT_ROUND_SIZE;
    this._battles = new Map();
  }

  public get bestTime(): number {
    let time = 99999;

    this._battles.forEach((b) => {
      if (isSingleMode(this.mode)) {
        if (b.winnerAttackTime < time && b.winner === Actor.PLAYER) {
          time = b.winnerAttackTime;
        }
      } else {
        if (b.winnerAttackTime < time) {
          time = b.winnerAttackTime;
        }
      }
    });
    return Math.round(time);
  }

  public get straightWins(): number {
    if (!isSingleMode(this.mode)) {
      console.error(
        "This variable is not supported outside of one player mode."
      );
      return;
    }

    let wins = 0;
    this._battles.forEach((b) => {
      if (b.winner === Actor.PLAYER) {
        // tslint:disable-next-line:no-increment-decrement
        wins++;
      }
    });
    return wins;
  }

  public get winner(): Actor {
    if (!isSingleMode(this.mode)) {
      const playerWins = this.getWins(Actor.PLAYER);
      const opponentWins = this.getWins(Actor.OPPONENT);

      return playerWins > opponentWins ? Actor.PLAYER : Actor.OPPONENT;
    }

    let winner = Actor.PLAYER;
    this._battles.forEach((b) => {
      if (b.winner === Actor.OPPONENT) {
        winner = Actor.OPPONENT;
      }
    });
    return winner;
  }

  public get mode() {
    return this._mode;
  }

  public get roundSize(): number {
    return this._roundSize;
  }

  public get currentRound(): number {
    return this._currentRound;
  }

  public get currentBattle(): Battle {
    return this._battles.get(this._currentRound);
  }

  public get battleLeft(): number {
    return this.roundSize - this.currentRound + 1;
  }

  public getWins(actor: Actor): number {
    let wins = 0;

    this._battles.forEach((b) => {
      if (b.winner === actor) {
        // tslint:disable-next-line:no-increment-decrement
        wins++;
      }
    });

    return wins;
  }

  abstract get npcAttackIntervalMillis(): number;

  abstract start(): void;

  abstract next(): void;

  abstract isFixed(): boolean;

  abstract release(): void;
}

export function isSingleMode(mode: Mode) {
  return [Mode.SINGLE_BEGINNER, Mode.SINGLE_NOVICE, Mode.SINGLE_EXPERT].some(
    (singleMode) => mode === singleMode
  );
}

export function isMultiMode(mode: Mode) {
  return [Mode.MULTI_LOCAL, Mode.MULTI_ONLINE].some(
    (multiMode) => mode === multiMode
  );
}

export function isOnlineMode(mode: Mode) {
  return [Mode.MULTI_ONLINE].some((multiMode) => mode === multiMode);
}

export default Game;

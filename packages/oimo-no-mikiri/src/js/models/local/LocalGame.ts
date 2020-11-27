import Game, { isSingleMode } from "../Game";
import { default as LocalBattle } from "./LocalBattle";
import Actor from "../Actor";
import Mode from "../Mode";

import { GAME_PARAMETERS, DEFAULT_ROUND_SIZE } from "../../Constants";
import { GameEvents } from "../online/OnlineGame";
import OnlineBattle from "../online/OnlineBattle";

class LocalGame extends Game {
  constructor(mode: Mode, roundSize?: number) {
    super(mode, roundSize || DEFAULT_ROUND_SIZE);
  }

  /**
   * Get NPC attack time in according to the current mode and round.
   *
   * @return {number}
   */
  public get npcAttackIntervalMillis(): number {
    if (!isSingleMode(this.mode)) {
      console.error(
        "The game is not one player mode, then an opponent won't attack automatically."
      );
      return;
    }

    const { reaction_rate, reaction_rate_tuning } = GAME_PARAMETERS;

    return (
      reaction_rate[this.mode][this.currentRound] * reaction_rate_tuning * 1000
    );
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

  public start(): void {
    this.processRound(1);
  }

  public next(): void {
    if (this.currentRound >= this.roundSize) {
      console.error("Round of the game is already fulfilled.");
      return;
    }
    this.processRound(this._currentRound + 1);
  }

  public isFixed(): boolean {
    // Is already lost on 1player-mode?
    if (isSingleMode(this.mode)) {
      let isFixed = false;

      this._battles.forEach((b) => {
        if (b.winner === Actor.OPPONENT) {
          isFixed = true;
        }
      });

      if (isFixed) {
        return true;
      }

      let fixedBattleCount = 0;
      this._battles.forEach((b) => {
        if (b.isFixed()) {
          // tslint:disable-next-line:no-increment-decrement
          fixedBattleCount++;
        }
      });

      return this._roundSize === fixedBattleCount;
    }

    // Player or opponent won required time?
    const requiredWins = Math.ceil(this.roundSize / 2);
    return (
      this.getWins(Actor.PLAYER) >= requiredWins ||
      this.getWins(Actor.OPPONENT) >= requiredWins
    );
  }

  public release() {
    this.off();

    this._battles.forEach((battle: OnlineBattle) => {
      battle.release();
    });
    this._battles.clear();
  }

  private processRound = (nextRound: number) => {
    const prevRound = this._currentRound;
    const nextBattle = new LocalBattle();

    if (nextRound === 1) {
      this._battles.clear();
    }

    this._battles.set(nextRound, nextBattle);
    this._currentRound = nextRound;

    nextBattle.start();

    console.log(
      `Proceed to next round. Round${prevRound} -> Round${nextRound}`
    );
    this.dispatch(GameEvents.ROUND_PROCEED, { nextRound });
  };
}

export default LocalGame;

import Actor from "../Actor";
import Battle, { BattleEvents } from "../Battle";

import { GAME_PARAMETERS } from "../../Constants";

class LocalBattle extends Battle {
  private _isJudging: boolean;

  /**
   * @override
   */
  public start() {
    this._signalTime = this.createSignalTime();
    this._isJudging = false;
  }

  /**
   *
   * @param {Actor} actor
   * @param {number} attackTime
   * @override
   */
  public attack(actor: Actor, attackTime: number): void {
    if (!this.signalTime) {
      console.error(
        "This battle is not started! Battle#attack is executable after staring battle only."
      );
      return;
    }

    if (this.isFixed()) {
      console.error("The battle is already fixed.");
      return;
    }

    if (attackTime < 0) {
      if (this._falseStartMap.get(actor)) {
        const winner = actor === Actor.PLAYER ? Actor.OPPONENT : Actor.PLAYER;
        this._winner = winner;
        this.fix(winner);

        this.dispatch(BattleEvents.FALSE_STARTED, { winner, attacker: actor });
      } else {
        this._falseStartMap.set(actor, true);

        // recreate for next battle.
        this._signalTime = this.createSignalTime();

        this.dispatch(BattleEvents.FALSE_STARTED, { attacker: actor });
      }
    } else {
      if (this._isJudging) {
        this._isJudging = false;
        console.log(
          `Draw! End waiting for judging. Last attacker: ${actor}, time: ${attackTime}`
        );
        this.dispatch(BattleEvents.DRAW, {});

        // recreate for next battle.
        this._signalTime = this.createSignalTime();

        return;
      }

      this._isJudging = true;
      console.log(
        `Start waiting for judging. First attacker: ${actor}, time: ${attackTime}`
      );
      setTimeout(() => {
        if (this._isJudging) {
          this._isJudging = false;

          console.log(`Succeed attack!`);
          this.fix(actor, attackTime);
          this.dispatch(BattleEvents.SUCCEED_ATTACK, actor);
        }
      }, GAME_PARAMETERS.acceptable_attack_time_distance);
    }
  }

  /**
   * @override
   */
  public release(): void {
    this.off();
  }

  private fix(winner: Actor, winnerTime?: number): void {
    this._winner = winner;
    this._winnerAttackTime = winnerTime;
  }
}

export default LocalBattle;

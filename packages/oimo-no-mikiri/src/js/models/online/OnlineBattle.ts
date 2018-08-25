import { database } from "firebase";

import Battle, { BattleEvents } from "../Battle";
import Actor from "../Actor";
import { GAME_PARAMETERS } from "../../Constants";

export interface OnlineBattleParams {
  gameId: string;
  round: number;
  playerId: string;
  opponentId: string;
}

class OnlineBattle extends Battle {
  private _idActorMap: Map<string, Actor>;
  private _actorIdMap: Map<Actor, string>;
  private _attackTimeMap: Map<Actor, number>;
  private _battleRef: database.Reference;

  constructor(params: OnlineBattleParams) {
    super();

    const { gameId, round } = params;

    this._idActorMap = new Map();
    this._idActorMap.set(params.playerId, Actor.PLAYER);
    this._idActorMap.set(params.opponentId, Actor.OPPONENT);

    this._actorIdMap = new Map();
    this._actorIdMap.set(Actor.PLAYER, params.playerId);
    this._actorIdMap.set(Actor.OPPONENT, params.opponentId);

    this._attackTimeMap = new Map();

    this._battleRef = database().ref(`/games/${gameId}/battles/${round}`);
    this._battleRef.child("winner").on("value", this.onWinnerUpdated);
    this._battleRef.child("signalTime").on("value", this.onSignalTimeUpdated);
    this._battleRef
      .child("attackTime")
      .on("child_added", this.onAttackTimeAdded);
    this._battleRef
      .child("falseStart")
      .on("child_added", this.onFalseStartAdded);
  }

  /************************************************************************************
   * Status change methods
   */
  public start() {
    return this.transaction(current => {
      const time = this.createSignalTime();

      return (
        current || {
          signalTime: time,
          createdAt: database.ServerValue.TIMESTAMP
        }
      );
    }, "initial_battle");
  }

  /**
   *
   * @param {Actor} attacker
   * @param {number} attackTime
   * @override
   */
  public attack(attacker: Actor, attackTime: number): void {
    if (!this.signalTime) {
      console.error(
        "This battle is not started! Battle#attack is executable after staring battle only."
      );
      return;
    }

    const uid = this.toId(attacker);
    const updates = {};
    updates[uid] = attackTime;

    this._battleRef.child("attackTime").update(updates);
  }

  public release() {
    this.off();

    this._battleRef.child("winner").off();
    this._battleRef.child("signalTime").off();
    this._battleRef.child("attackTime").off();
    this._battleRef.child("falseStart").off();
  }

  /************************************************************************************
   * Callback methods
   */

  protected onWinnerUpdated = (snapshot: database.DataSnapshot) => {
    if (!snapshot.exists() || this._winner) {
      return;
    }

    const winner = snapshot.val();
    this._winner = this.toActor(winner.id);
    this._winnerAttackTime = winner.attackTime;

    console.log(
      `winner was decided. actor: ${this._winner}, time: ${
        this._winnerAttackTime
      }`
    );
  };

  protected onSignalTimeUpdated = (snapshot: database.DataSnapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    this._signalTime = snapshot.val();
    console.log("signal time was updated.", this._signalTime);
  };

  protected onAttackTimeAdded = (snapshot: database.DataSnapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    const uid = snapshot.key;
    const actor = this.toActor(uid);
    const attackTime = snapshot.val();

    if (this._attackTimeMap.has(actor)) {
      console.log(
        `Provided user's attackTime is existing. then ignore this event. uid: ${uid}`
      );
      return;
    }

    console.log(
      `Set attack time. Actor: ${actor}, Id: ${uid}, time: ${attackTime}`
    );
    this._attackTimeMap.set(actor, attackTime);

    if (this._attackTimeMap.size === 2) {
      // TODO: extract as constants
      const playerAttackTime = this._attackTimeMap.get(Actor.PLAYER);
      const opponentAttackTime = this._attackTimeMap.get(Actor.OPPONENT);

      if (0 <= playerAttackTime && 0 <= opponentAttackTime) {
        if (
          Math.abs(playerAttackTime - opponentAttackTime) <
          GAME_PARAMETERS.acceptable_attack_time_distance
        ) {
          console.log("This battle is drew. then it will be reset.");
          this.draw();

          this.dispatch(BattleEvents.DRAW, {});
        } else {
          let winner;
          let winnerAttackTime;

          if (playerAttackTime < opponentAttackTime) {
            winner = Actor.PLAYER;
            winnerAttackTime = playerAttackTime;
          } else {
            winner = Actor.OPPONENT;
            winnerAttackTime = opponentAttackTime;
          }

          console.log(
            `This battle is fixed. winner: ${winner}, time: ${winnerAttackTime}`
          );
          this.fix(this.toId(winner), winnerAttackTime);

          this.dispatch(BattleEvents.SUCCEED_ATTACK, winner);
        }
      } else {
        if (playerAttackTime === opponentAttackTime) {
          console.log("This battle is drew. then it will be reset.");
          this.draw();

          this.dispatch(BattleEvents.DRAW, {});
        } else if (playerAttackTime < opponentAttackTime) {
          console.log(`False-started by ${Actor.PLAYER}.`);

          if (this.isFalseStarted(Actor.PLAYER)) {
            console.log(
              `This battle is fixed with false-start. winner: ${
                Actor.OPPONENT
              }.`
            );
            this.fix(this.toId(Actor.OPPONENT));

            this.dispatch(BattleEvents.FALSE_STARTED, {
              winner: Actor.OPPONENT,
              attacker: actor
            });
          } else {
            this.falseStart(Actor.PLAYER);
            this.dispatch(BattleEvents.FALSE_STARTED, { attacker: actor });
          }
        } else {
          console.log(`False-started by ${Actor.OPPONENT}.`);

          if (this.isFalseStarted(Actor.OPPONENT)) {
            console.log(
              `This battle is fixed with false-start. winner: ${Actor.PLAYER}.`
            );

            this.fix(this.toId(Actor.PLAYER));
            this.dispatch(BattleEvents.FALSE_STARTED, {
              winner: Actor.PLAYER,
              attacker: actor
            });
          } else {
            this.falseStart(Actor.OPPONENT);
            this.dispatch(BattleEvents.FALSE_STARTED, { attacker: actor });
          }
        }
      }
    }
  };

  protected onFalseStartAdded = (snapshot: database.DataSnapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    const uid = snapshot.key;
    const actor = this.toActor(uid);

    this._falseStartMap.set(actor, true);
  };

  protected draw = () => {
    this.reset();
  };

  protected falseStart(actor: Actor): void {
    const uid = this.toId(actor);
    const updates = {};
    updates[`falseStart/${uid}`] = true;

    this._battleRef.update(updates);

    this.reset();
  }

  protected fix(winnerId: string, attackTime?: number): void {
    const updates = {};
    updates[`winner/id`] = winnerId;
    updates[`winner/attackTime`] = attackTime || null;

    this._battleRef.update(updates);
  }

  protected reset(): void {
    this._attackTimeMap.clear();

    this.transaction(current => {
      const time = this.createSignalTime();
      if (current && current.attackTime) {
        current.attackTime = null;
        current.signalTime = time;
      }

      return current;
    }, "reset_battle");
  }

  /**
   *
   * @param {(current: any) => any} transactionUpdate
   * @param {string} tag
   * @return {Promise<void>}
   */
  private async transaction(
    transactionUpdate: (current: any) => any,
    tag?: string
  ) {
    console.log(`Start transaction. TAG: ${tag}`);
    const { committed, snapshot } = await this._battleRef.transaction(
      transactionUpdate
    );
    console.log(
      `End transaction. TAG: ${tag}, committed: ${committed}`,
      snapshot.val()
    );
  }

  private toId(actor: Actor): string {
    return this._actorIdMap.get(actor);
  }

  private toActor(id: string): Actor {
    return this._idActorMap.get(id);
  }
}

export default OnlineBattle;

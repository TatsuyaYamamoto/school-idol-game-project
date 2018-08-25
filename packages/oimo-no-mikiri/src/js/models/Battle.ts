import Actor from "./Actor";
import EventEmitter from "./online/EventEmitter";
import { getRandomInteger } from "../../framework/utils";

export enum BattleEvents {
  FIXED = "fixed",
  SUCCEED_ATTACK = "succeed_attack",
  FALSE_STARTED = "false_started",
  DRAW = "draw"
}

abstract class Battle extends EventEmitter {
  protected _winner: Actor;
  protected _winnerAttackTime: number;
  protected _signalTime: number;
  protected _falseStartMap: Map<Actor, boolean>;

  constructor() {
    super();

    this._winner = null;
    this._winnerAttackTime = null;
    this._falseStartMap = new Map();
    this._falseStartMap.set(Actor.PLAYER, false);
    this._falseStartMap.set(Actor.OPPONENT, false);
  }

  get winner(): Actor {
    return this._winner;
  }

  get winnerAttackTime(): number {
    if (!this.isFixed()) console.error("The battle is not fixed.");

    return this._winnerAttackTime;
  }

  get signalTime(): number {
    return this._signalTime;
  }

  public isFalseStarted(actor: Actor): boolean {
    return this._falseStartMap.get(actor);
  }

  public isFixed(): boolean {
    return !!this._winner;
  }

  abstract start(): void;

  abstract attack(actor: string, attackTime: number): void;

  abstract release(): void;

  protected createSignalTime(): number {
    return getRandomInteger(3000, 5000);
  }
}

export default Battle;

import { default as AutoBind } from "autobind-decorator";

import {
  addEvents,
  dispatchEvent,
  removeEvents,
  play,
  vibrate
} from "@sokontokoro/mikan";

import GameView, { EnterParams, Events, InnerStates } from "./GameView";

import ReadyState from "./internal/ReadyState";
import {
  default as MultiPlayOverState,
  EnterParams as MultiPlayOverStateEnterParams
} from "./internal/OverState/MultiPlayOverState";
import {
  default as MultiPlayActionState,
  EnterParams as MultiPlayActionStateEnterParams
} from "./internal/ActionState/MultiPlayActionState";
import {
  default as SinglePlayOverState,
  EnterParams as SinglePlayOverStateEnterParams
} from "./internal/OverState/SinglePlayOverState";
import {
  default as SinglePlayActionState,
  EnterParams as SinglePlayActionStateEnterParams
} from "./internal/ActionState/SinglePlayActionState";
import ResultState, {
  EnterParams as ResultStateEnterParams
} from "./internal/ResultState";

import Actor from "../../models/Actor";
import { isSingleMode } from "../../models/Game";
import { BattleEvents } from "../../models/Battle";

import { Action, Category, trackEvent } from "../../helper/tracker";
import { Ids as SoundIds } from "../../resources/sound";

import { VIBRATE_TIME } from "../../Constants";

@AutoBind
class LocalGameView extends GameView {
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    this.stateMachine.set({
      [InnerStates.READY]: new ReadyState(this),
      [InnerStates.ACTION]: isSingleMode(this.game.mode)
        ? new SinglePlayActionState(this)
        : new MultiPlayActionState(this),
      [InnerStates.RESULT]: new ResultState(this),
      [InnerStates.OVER]: isSingleMode(this.game.mode)
        ? new SinglePlayOverState(this)
        : new MultiPlayOverState(this)
    });

    addEvents({
      [Events.REQUEST_READY]: this.onRequestedReady,
      [Events.IS_READY]: this.onReady,
      [Events.ATTACK]: this.onAttacked,
      [Events.FIXED_RESULT]: this.onFixedResult,
      [Events.RESTART_GAME]: this.onRequestedRestart,
      [Events.BACK_TO_TOP]: this.onBackToTopRequested
    });

    this.game.start();
    dispatchEvent(Events.REQUEST_READY);
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();

    removeEvents([
      Events.REQUEST_READY,
      Events.IS_READY,
      Events.ATTACK,
      Events.FIXED_RESULT,
      Events.RESTART_GAME
    ]);
  }

  /**
   *
   * @private
   */
  protected onRequestedReady() {
    if (this.game.isFixed()) {
      dispatchEvent(Events.FIXED_RESULT);
      return;
    }

    // is retry battle by false-start?
    if (this.game.currentBattle.isFixed()) {
      this.game.next();
    }

    console.log(`On requested ready. Round${this.game.currentRound}`);

    this.to(InnerStates.READY);
  }

  /**
   *
   */
  protected onReady() {
    const signalTime = this.game.currentBattle.signalTime;
    const isFalseStarted = {
      player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
      opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT)
    };

    const offEvents = () => {
      this.game.currentBattle.off(BattleEvents.SUCCEED_ATTACK);
      this.game.currentBattle.off(BattleEvents.FALSE_STARTED);
      this.game.currentBattle.off(BattleEvents.DRAW);
    };

    this.game.currentBattle.on(BattleEvents.SUCCEED_ATTACK, winner => {
      offEvents();
      play(SoundIds.SOUND_ATTACK);
      vibrate(VIBRATE_TIME.ATTACK);
      this.to<ResultStateEnterParams>(InnerStates.RESULT, { winner });
    });
    this.game.currentBattle.on(
      BattleEvents.FALSE_STARTED,
      ({ winner, attacker }) => {
        offEvents();
        play(SoundIds.SOUND_FALSE_START);
        vibrate(VIBRATE_TIME.FALSE_START);
        this.to<ResultStateEnterParams>(InnerStates.RESULT, {
          winner,
          falseStarter: attacker
        });
      }
    );
    this.game.currentBattle.on(BattleEvents.DRAW, () => {
      offEvents();
      play(SoundIds.SOUND_DRAW);
      vibrate(VIBRATE_TIME.DRAW);
      this.to<ResultStateEnterParams>(InnerStates.RESULT);
    });

    if (isSingleMode(this.game.mode)) {
      const autoOpponentAttackInterval = this.game.npcAttackIntervalMillis;

      this.to<SinglePlayActionStateEnterParams>(InnerStates.ACTION, {
        signalTime,
        isFalseStarted,
        autoOpponentAttackInterval
      });
    } else {
      const battleLeft = this.game.battleLeft;
      const wins = {
        onePlayer: this.game.getWins(Actor.PLAYER),
        twoPlayer: this.game.getWins(Actor.OPPONENT)
      };

      this.to<MultiPlayActionStateEnterParams>(InnerStates.ACTION, {
        signalTime,
        isFalseStarted,
        battleLeft,
        wins
      });
    }
  }

  /**
   *
   */
  protected onFixedResult() {
    const { bestTime, winner, mode } = this.game;

    console.log(
      `Fixed the game! player win: ${this.game.getWins(
        Actor.PLAYER
      )}, opponent wins: ${this.game.getWins(Actor.OPPONENT)}.`
    );

    if (isSingleMode(this.game.mode)) {
      this.to<SinglePlayOverStateEnterParams>(InnerStates.OVER, {
        winner,
        bestTime,
        mode,
        straightWins: this.game.straightWins
      });
    } else {
      this.to<MultiPlayOverStateEnterParams>(InnerStates.OVER, {
        winner,
        bestTime,
        mode,
        onePlayerWins: this.game.getWins(Actor.PLAYER),
        twoPlayerWins: this.game.getWins(Actor.OPPONENT)
      });
    }
  }

  protected onRequestedRestart() {
    this.game.start();
    dispatchEvent(Events.REQUEST_READY);
  }

  protected onAttacked(e: CustomEvent) {
    super.onAttacked(e);
  }

  /**
   * @override
   */
  protected onBackToTopRequested() {
    super.onBackToTopRequested();

    trackEvent(Category.BUTTON, Action.TAP, "back_to_menu");
  }
}

export default LocalGameView;

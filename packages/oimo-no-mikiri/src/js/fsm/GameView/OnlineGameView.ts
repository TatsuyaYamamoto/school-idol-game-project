import { default as AutoBind } from "autobind-decorator";

import { addEvents, dispatchEvent } from "../../../framework/EventUtils";
import Deliverable from "../../../framework/Deliverable";
import {
  show as showConnecting,
  hide as hideConnecting
} from "../../../framework/ConnectingIndicator";

import GameView, { EnterParams, Events, InnerStates } from "./GameView";
import ReadyState from "./internal/ReadyState";
import ResultState, {
  EnterParams as ResultStateEnterParams
} from "./internal/ResultState";
import OnlineActionState, {
  EnterParams as ActionEnterParams
} from "./internal/ActionState/OnlineActionState";
import OnlineOverState, {
  EnterParams as OnlineEnterParams
} from "./internal/OverState/OnlineOverState";

import {
  GameEvents,
  default as OnlineGame
} from "../../models/online/OnlineGame";
import Actor from "../../models/Actor";
import { Events as AppEvents } from "../ApplicationState";

import { Action, Category, trackEvent } from "../../helper/tracker";
import {
  closeModal,
  openMemberLeftModal,
  openRestartConfirmModal,
  openWaitingRestartModal
} from "../../helper/modals";
import { Ids as SoundIds } from "../../resources/sound";
import { play } from "../../../framework/MusicPlayer";
import { BattleEvents } from "../../models/Battle";
import { vibrate } from "../../../framework/utils";
import { VIBRATE_TIME } from "../../Constants";

@AutoBind
class OnlineGameView extends GameView {
  onEnter(params: EnterParams): void {
    super.onEnter(params);

    this.stateMachine.set({
      [InnerStates.READY]: new ReadyState(this),
      [InnerStates.ACTION]: new OnlineActionState(this),
      [InnerStates.RESULT]: new ResultState(this),
      [InnerStates.OVER]: new OnlineOverState(this)
    });
    addEvents({
      [Events.REQUEST_READY]: this._onRequestedReady,
      [Events.IS_READY]: this._onReady,
      [Events.ATTACK]: this.onAttacked,
      [Events.FIXED_RESULT]: this.onResultFixed,
      [Events.RESTART_GAME]: this.onRestartRequested,
      [Events.BACK_TO_TOP]: this.onBackToTopRequested
    });

    this.game.on(GameEvents.MEMBER_LEFT, () => {
      // Left myself?
      const ownId = (<OnlineGame>this.game).ownId;
      if (!(<OnlineGame>this.game).members.has(ownId)) {
        return;
      }

      openMemberLeftModal();
      (<OnlineGame>this.game).remove();

      setTimeout(() => {
        closeModal();

        dispatchEvent(AppEvents.REQUESTED_BACK_TO_TOP);
      }, 2000);
    });

    this.game.once(GameEvents.ROUND_PROCEED, () => {
      this._onRequestedReady();
    });

    this.game.start();
  }

  /**
   * @override
   */
  onExit(): void | Deliverable {
    super.onExit();

    this.game.release();
  }

  /**
   *
   * @private
   */
  private _onRequestedReady = async () => {
    if (this.game.isFixed()) {
      dispatchEvent(Events.FIXED_RESULT);
      return;
    }

    // is retry battle by false-start?
    if (this.game.currentBattle.isFixed()) {
      await this.game.next();
    }

    this.to(InnerStates.READY);
  };

  /**
   *
   * @private
   */
  private _onReady = () => {
    const signalTime = this.game.currentBattle.signalTime;
    const isFalseStarted = {
      player: this.game.currentBattle.isFalseStarted(Actor.PLAYER),
      opponent: this.game.currentBattle.isFalseStarted(Actor.OPPONENT)
    };

    const battleLeft = this.game.battleLeft;
    const wins = {
      onePlayer: this.game.getWins(Actor.PLAYER),
      twoPlayer: this.game.getWins(Actor.OPPONENT)
    };

    const showResult = (params: { winner?: Actor; falseStarter?: Actor }) => {
      hideConnecting();

      this.game.currentBattle.off(BattleEvents.SUCCEED_ATTACK);
      this.game.currentBattle.off(BattleEvents.FALSE_STARTED);
      this.game.currentBattle.off(BattleEvents.DRAW);

      this.to<ResultStateEnterParams>(InnerStates.RESULT, params);
    };

    this.game.currentBattle.on(BattleEvents.SUCCEED_ATTACK, winner => {
      play(SoundIds.SOUND_ATTACK);
      vibrate(VIBRATE_TIME.ATTACK);
      showResult({ winner });
    });
    this.game.currentBattle.on(
      BattleEvents.FALSE_STARTED,
      ({ winner, attacker }) => {
        play(SoundIds.SOUND_FALSE_START);
        vibrate(VIBRATE_TIME.FALSE_START);
        showResult({ winner, falseStarter: attacker });
      }
    );
    this.game.currentBattle.on(BattleEvents.DRAW, () => {
      hideConnecting();
      play(SoundIds.SOUND_DRAW);
      vibrate(VIBRATE_TIME.DRAW);
      showResult({});
    });

    this.to<ActionEnterParams>(InnerStates.ACTION, {
      signalTime,
      isFalseStarted,
      battleLeft,
      wins
    });
  };

  private onResultFixed = async () => {
    const { bestTime, winner, mode } = this.game;
    const onePlayerWins = this.game.getWins(Actor.PLAYER);
    const twoPlayerWins = this.game.getWins(Actor.OPPONENT);

    console.log(
      `Fixed the game! player win: ${onePlayerWins}, opponent wins: ${twoPlayerWins}.`
    );

    this.game.once(GameEvents.REQUESTED_START, async requestedUserId => {
      if ((<OnlineGame>this.game).ownId === requestedUserId) {
        // Ignore own request.
        return;
      }

      const result = await openRestartConfirmModal();

      if (result.value) {
        this.game.once(GameEvents.IS_READY, () => {
          closeModal();
          setTimeout(() => this.game.start(), 0);
        });

        this.game.once(GameEvents.ROUND_PROCEED, () => {
          this._onRequestedReady();
        });

        (<OnlineGame>this.game).requestReady();
      } else {
        this.onBackToTopRequested();
      }
    });

    this.to<OnlineEnterParams>(InnerStates.OVER, {
      winner,
      bestTime,
      mode,
      onePlayerWins,
      twoPlayerWins
    });
  };

  private onRestartRequested = async () => {
    openWaitingRestartModal();

    this.game.once(GameEvents.IS_READY, () => {
      closeModal();
      setTimeout(() => this.game.start(), 0);
    });

    this.game.once(GameEvents.ROUND_PROCEED, () => {
      this._onRequestedReady();
    });

    (<OnlineGame>this.game).requestReady();
  };

  /**
   * @param {CustomEvent} e
   * @override
   */
  protected onAttacked(e: CustomEvent) {
    showConnecting();

    super.onAttacked(e);

    const { attacker } = e.detail;
    if (attacker === Actor.PLAYER) {
      vibrate(VIBRATE_TIME.TRY_TO_ATTACK);
    }
  }

  /**
   * @override
   */
  protected onBackToTopRequested() {
    super.onBackToTopRequested();

    (<OnlineGame>this.game).leave();

    trackEvent(Category.BUTTON, Action.TAP, "back_to_menu");
  }
}

export default OnlineGameView;

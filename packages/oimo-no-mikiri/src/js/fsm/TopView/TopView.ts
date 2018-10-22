import { default as AutoBind } from "autobind-decorator";

import {
  ViewContainer,
  Deliverable,
  dispatchEvent,
  addEvents,
  removeEvents,
  show as showConnecting,
  hide as hideConnecting,
  timeout,
  playOnLoop,
  stop
} from "@sokontokoro/mikan";

import { Events as AppEvents } from "../ApplicationState";
import HowToPlayState from "./internal/HowToPlayState";
import CreditState from "./internal/CreditState";
import TitleState from "./internal/TitleState";
import MenuState from "./internal/MenuState";

import OnlineGame, { GameEvents } from "../../models/online/OnlineGame";
import Mode from "../../models/Mode";
import LocalGame from "../../models/local/LocalGame";

import { Ids as SoundIds } from "../../resources/sound";

import {
  closeModal,
  openConfirmCloseGameModal,
  openCreateRoomModal,
  openJoinRoomModal,
  openReadyRoomModal,
  openRejectJoinRoomModal
} from "../../helper/modals";

export enum Events {
  TAP_TITLE = "GameView@TAP_TITLE",
  REQUEST_BACK_TO_MENU = "GameView@REQUEST_BACK_TO_MENU",
  REQUEST_HOW_TO_PLAY = "GameView@REQUEST_HOW_TO_PLAY",
  REQUEST_CREDIT = "GameView@REQUEST_CREDIT",
  FIXED_PLAY_MODE = "GameView@FIXED_PLAY_MODE"
}

enum InnerStates {
  TITLE = "title",
  MENU = "menu",
  HOW_TO_PLAY = "how_to_play",
  CREDIT = "credit"
}

@AutoBind
class TopViewState extends ViewContainer {
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
  onEnter(params: Deliverable): void {
    super.onEnter(params);

    this.stateMachine.set({
      [InnerStates.TITLE]: new TitleState(),
      [InnerStates.MENU]: new MenuState(),
      [InnerStates.HOW_TO_PLAY]: new HowToPlayState(),
      [InnerStates.CREDIT]: new CreditState()
    });

    addEvents({
      [Events.TAP_TITLE]: this.onTitleEventTap,
      [Events.REQUEST_BACK_TO_MENU]: this.onBackMenuRequested,
      [Events.REQUEST_HOW_TO_PLAY]: this.onHowToPlayeRequested,
      [Events.REQUEST_CREDIT]: this.onCreditRequested,
      [Events.FIXED_PLAY_MODE]: this.onPlayModeFixed
    });

    playOnLoop(SoundIds.SOUND_ZENKAI);

    this.to(InnerStates.TITLE);
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();

    stop(SoundIds.SOUND_ZENKAI);

    removeEvents([
      Events.TAP_TITLE,
      Events.REQUEST_BACK_TO_MENU,
      Events.REQUEST_HOW_TO_PLAY,
      Events.FIXED_PLAY_MODE
    ]);
  }

  /**
   *
   */
  protected onTitleEventTap() {
    this.to(InnerStates.MENU);
  }

  /**
   *
   */
  protected onHowToPlayeRequested() {
    this.to(InnerStates.HOW_TO_PLAY);
  }

  /**
   *
   * @private
   */
  protected onBackMenuRequested() {
    this.to(InnerStates.MENU);
  }

  /**
   *
   */
  protected onCreditRequested() {
    this.to(InnerStates.CREDIT);
  }

  /**
   *
   */
  protected onPlayModeFixed(e: CustomEvent) {
    const { mode, gameId } = e.detail;
    console.log("Fixed play mode: ", mode);

    switch (mode) {
      case Mode.MULTI_ONLINE:
        gameId ? this.joinGame(gameId) : this.createGame();
        break;
      default:
        dispatchEvent(AppEvents.REQUESTED_GAME_START, {
          game: new LocalGame(mode)
        });
    }
  }

  /**
   *
   */
  private async createGame() {
    showConnecting();
    const game = await OnlineGame.create();
    hideConnecting();

    game.join();

    game.once(GameEvents.FULFILLED_MEMBERS, () => {
      openReadyRoomModal();
      showConnecting();
      game.requestReady();
    });

    game.once(GameEvents.IS_READY, async () => {
      await timeout(2000);

      closeModal();
      hideConnecting();

      dispatchEvent(AppEvents.REQUESTED_GAME_START, { game });
    });

    const openWaitingModal = async () => {
      const result = await openCreateRoomModal(game.id);

      if (result === "cancel") {
        const { value } = await openConfirmCloseGameModal();
        if (value) {
          openWaitingModal();
        } else {
          closeModal();
          game.remove();
        }
      }
    };

    openWaitingModal();
  }

  /**
   *
   * @param {string} gameId
   */
  private joinGame(gameId: string) {
    openJoinRoomModal(gameId);
    showConnecting();

    const game = new OnlineGame(gameId);
    game.once(GameEvents.FULFILLED_MEMBERS, () => {
      openReadyRoomModal();
      game.requestReady();
    });
    game.once(GameEvents.IS_READY, async () => {
      await timeout(2000);

      closeModal();
      hideConnecting();

      dispatchEvent(AppEvents.REQUESTED_GAME_START, { game });
    });

    game.join().catch(type => {
      openRejectJoinRoomModal(type).then(() => {
        // Prevent move menu from title view.
        setTimeout(() => this.to(InnerStates.TITLE), 1);
      });
    });
  }
}

export default TopViewState;

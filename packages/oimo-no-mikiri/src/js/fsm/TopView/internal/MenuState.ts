import { default as AutoBind } from "autobind-decorator";

import {
  Deliverable,
  dispatchEvent,
  play,
  toggleSound,
  tracePage,
  trackEvent
} from "@sokontokoro/mikan";

import { Events } from "../TopView";
import TopViewState from "./TopViewState";

import MenuBoard from "../../../texture/containers/MenuBoard";
import SelectLevelBoard from "../../../texture/containers/SelectLevelBoard";
import SelectMultiPlayModeBoard from "../../../texture/containers/SelectMultiPlayModeBoard";

import Mode from "../../../models/Mode";

import { goTo } from "../../../helper/network";
import { Action, Category, VirtualPageViews } from "../../../helper/tracker";

import { URL } from "../../../Constants";
import { Ids as SoundIds } from "../../../resources/sound";

@AutoBind
class MenuState extends TopViewState {
  private _menuBoard: MenuBoard;
  private _selectLevelBoard: SelectLevelBoard;
  private _selectMultiPlayModeBoard: SelectMultiPlayModeBoard;

  /**
   * @override
   */
  update(elapsedMS: number): void {
    super.update(elapsedMS);
    this.background.progress(elapsedMS);
  }

  /**
   * @override
   */
  onEnter(params: Deliverable): void {
    super.onEnter(params);

    // Tracking
    tracePage(VirtualPageViews.MENU);

    this._menuBoard = new MenuBoard(this.viewHeight, this.viewHeight);
    this._menuBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.5);
    this._menuBoard.setOnSelectHomeListener(this._onSelectHome);
    this._menuBoard.setOnSelectSoundListener(this._onToggleSound);
    this._menuBoard.setOnOnePlayerGameStartClickListener(
      this._onOnePlayerSelected
    );
    this._menuBoard.setOnMultiPlayerGameStartClickListener(
      this._onMultiPlayerSelected
    );
    this._menuBoard.setOnSelectHowToPlayListener(this._onSelectHowToPlay);
    this._menuBoard.setOnSelectCreditListener(this._onSelectCredit);

    this._selectLevelBoard = new SelectLevelBoard(
      this.viewHeight,
      this.viewHeight
    );
    this._selectLevelBoard.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.5
    );
    this._selectLevelBoard.setOnSelectLevelListener(this._onModeSelected);
    this._selectLevelBoard.onClick("back", this.backHomeMenu);

    this._selectMultiPlayModeBoard = new SelectMultiPlayModeBoard(
      this.viewHeight,
      this.viewHeight
    );
    this._selectMultiPlayModeBoard.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.5
    );
    this._selectMultiPlayModeBoard.onClick("online", e =>
      this._onModeSelected(e, Mode.MULTI_ONLINE)
    );
    this._selectMultiPlayModeBoard.onClick("offline", e =>
      this._onModeSelected(e, Mode.MULTI_LOCAL)
    );
    this._selectMultiPlayModeBoard.onClick("back", this.backHomeMenu);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(this._menuBoard);

    window.addEventListener("blur", this.turnSoundOff);
    window.addEventListener("focus", this.turnSoundOn);
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();

    window.removeEventListener("blur", this.turnSoundOff);
    window.removeEventListener("focus", this.turnSoundOn);
  }

  private backHomeMenu = () => {
    this.applicationLayer.removeChild(this._selectMultiPlayModeBoard);
    this.applicationLayer.removeChild(this._selectLevelBoard);

    this.applicationLayer.addChild(this._menuBoard);

    play(SoundIds.SOUND_CANCEL);
  };

  /**
   *
   * @private
   */
  private _onSelectHome = () => {
    goTo(URL.TWITTER_HOME_T28);

    trackEvent(Action.TAP, { category: Category.BUTTON, label: "home" });
  };

  /**
   *
   * @private
   */
  private _onToggleSound = () => {
    play(SoundIds.SOUND_TOGGLE_SOUND);
    toggleSound();

    trackEvent(Action.TAP, {
      category: Category.BUTTON,
      label: "toggle_sound"
    });
  };

  /**
   *
   * @private
   */
  private _onOnePlayerSelected = () => {
    this.applicationLayer.removeChild(this._menuBoard);
    this.applicationLayer.addChild(this._selectLevelBoard);

    play(SoundIds.SOUND_OK);
  };

  /**
   *
   * @private
   */
  private _onMultiPlayerSelected = () => {
    this.applicationLayer.removeChild(this._menuBoard);
    this.applicationLayer.addChild(this._selectMultiPlayModeBoard);

    play(SoundIds.SOUND_OK);
  };

  /**
   *
   * @private
   */
  private _onSelectHowToPlay = () => {
    dispatchEvent(Events.REQUEST_HOW_TO_PLAY);

    play(SoundIds.SOUND_OK);
  };

  /**
   *
   * @private
   */
  private _onSelectCredit = () => {
    dispatchEvent(Events.REQUEST_CREDIT);

    play(SoundIds.SOUND_OK);
  };

  private _onModeSelected = (e, mode: Mode) => {
    play(SoundIds.SOUND_OK);

    dispatchEvent(Events.FIXED_PLAY_MODE, { mode });

    trackEvent(Action.TAP, { category: Category.BUTTON, label: mode });
  };

  private turnSoundOn() {
    this._menuBoard.soundButton.turnOn();
  }

  private turnSoundOff() {
    this._menuBoard.soundButton.turnOff();
  }
}

export default MenuState;

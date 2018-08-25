import { Deliverable, dispatchEvent, play } from "mikan";

import TopViewState from "./TopViewState";
import { Events } from "../TopView";

import UsageTextArea from "../../../texture/containers/UsageTextArea";
import BackToMenuButton from "../../../texture/sprite/button/BackToMenuButton";

import Player from "../../../texture/sprite/character/Player";
import Opponent from "../../../texture/sprite/character/Opponent";
import Hanamaru from "../../../texture/sprite/character/Hanamaru";
import Uchicchi from "../../../texture/sprite/character/Uchicchi";
import Oimo from "../../../texture/sprite/character/Oimo";

import { trackPageView, VirtualPageViews } from "../../../helper/tracker";

import { Ids as SoundIds } from "../../../resources/sound";

class HowToPlayState extends TopViewState {
  private _usageTextArea: UsageTextArea;

  private _oimo: Oimo;
  private _player: Player;
  private _opponent: Opponent;

  private _backToMenuButton: BackToMenuButton;

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
    trackPageView(VirtualPageViews.HOW_TO_USE);

    this._usageTextArea = new UsageTextArea();
    this._usageTextArea.position.set(
      this.viewWidth * 0.5,
      this.viewHeight * 0.22
    );

    this._oimo = new Oimo();
    this._oimo.position.set(this.viewWidth * 0.5, this.viewHeight * 0.6);

    this._player = new Hanamaru();
    this._player.position.set(this.viewWidth * 0.2, this.viewHeight * 0.6);

    this._opponent = new Uchicchi();
    this._opponent.position.set(this.viewWidth * 0.8, this.viewHeight * 0.6);

    this._backToMenuButton = new BackToMenuButton();
    this._backToMenuButton.position.set(
      this.viewWidth * 0.85,
      this.viewHeight * 0.85
    );
    this._backToMenuButton.setOnClickListener(this._onBackToMenuClick);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this._usageTextArea,
      this._oimo,
      this._player,
      this._opponent,
      this._backToMenuButton
    );

    this._oimo.play();
    this._player.playWait();
    this._opponent.playWait();

    // Set timeout to dispatch after ending onEnter logic.
    window.setTimeout(
      () => this.addClickWindowEventListener(this._handleTapWindow),
      1
    );
  }

  /**
   * @override
   */
  onExit(): void {
    super.onExit();
    this.removeClickWindowEventListener(this._handleTapWindow);
  }

  /**
   *
   * @private
   */
  private _onBackToMenuClick = () => {
    dispatchEvent(Events.REQUEST_BACK_TO_MENU);

    play(SoundIds.SOUND_CANCEL);
  };

  /**
   *
   * @private
   */
  private _handleTapWindow = () => {
    this._player.playTryAttack();
    play(SoundIds.SOUND_ATTACK);
    setTimeout(() => this._player.playWait(), 1000);
  };
}

export default HowToPlayState;

import Sound from "pixi-sound/lib/Sound";

import { Events } from "../../view/TopViewState";
import { dispatchEvent } from "../../../framework/EventUtils";
import State from "../../../framework/State";

import ViewContainer from "../../../framework/ViewContainer";
import Kotori, { Direction } from "../../../container/sprite/character/Kotori";
import UsageTapTargetInfo from "../../../container/components/UsageTapTargetInfo";
import UsageTextArea from "../../../container/components/UsageTextArea";
import BackToMenuButton from "../../../container/sprite/button/BackToMenuButton";

import { loadSound } from "../../../framework/AssetLoader";
import { Ids } from "../../../resources/sound";

class UsageTopState extends ViewContainer implements State {
  public static TAG = "UsageTopState";

  private _usageTextArea: UsageTextArea;
  private _usageTapTargetInfo: UsageTapTargetInfo;
  private _backToMenuButton: BackToMenuButton;
  private _usageTarget: Kotori;

  private _tapKotoriSound: Sound;
  private _cancelSound: Sound;

  /**
   * @inheritDoc
   */
  update(elapsedTimeMillis: number): void {
    if (!this._usageTarget) {
      this._usageTarget = new Kotori({ direction: Direction.LEFT });
      this._usageTarget.position.set(
        this.viewWidth * 1.1,
        this.viewHeight * 0.4
      );
      this.applicationLayer.addChild(this._usageTarget);
    }

    if (this._usageTarget && this.viewWidth * 0.8 < this._usageTarget.x) {
      this.move(this._usageTarget, elapsedTimeMillis);
    } else {
      if (!this._usageTapTargetInfo) {
        this._usageTarget.setOnClickListener(this.onUsageModelTargetClick);
        this._usageTapTargetInfo = new UsageTapTargetInfo();
        this._usageTapTargetInfo.position.set(
          this.viewWidth * 0.8,
          this.viewHeight * 0.7
        );
        this.applicationLayer.addChild(this._usageTapTargetInfo);
      }
    }
  }

  /**
   * @inheritDoc
   */
  onEnter(): void {
    super.onEnter();

    this._usageTextArea = new UsageTextArea();
    this._usageTextArea.position.set(
      this.viewWidth * 0.35,
      this.viewHeight * 0.3
    );

    this._backToMenuButton = new BackToMenuButton();
    this._backToMenuButton.position.set(
      this.viewWidth * 0.15,
      this.viewHeight * 0.8
    );
    this._backToMenuButton.setOnClickListener(this.onBackToMenuButtonClick);

    this.applicationLayer.addChild(this._backToMenuButton, this._usageTextArea);

    this._tapKotoriSound = loadSound(Ids.SOUND_TAP_KOTORI);
    this._cancelSound = loadSound(Ids.SOUND_CANCEL);
  }

  /**
   * @inheritDoc
   */
  onExit(): void {
    super.onExit();

    this._usageTarget = null;
    this._usageTapTargetInfo = null;
  }

  private onUsageModelTargetClick = () => {
    this._tapKotoriSound.play();

    if (this._usageTarget) {
      this._usageTarget.destroyByTap();
    }
    this._usageTarget = null;
    if (this._usageTapTargetInfo) {
      this._usageTapTargetInfo.destroy();
    }
    this._usageTapTargetInfo = null;
  };

  private onBackToMenuButtonClick = () => {
    this._cancelSound.play();
    dispatchEvent(Events.REQUEST_BACK_TO_TOP);
  };

  private move(kotori: Kotori, elapsedTime: number): void {
    const direction = kotori.direction === Direction.RIGHT ? 1 : -1;
    const speed = kotori.speed;
    kotori.position.x +=
      this.viewWidth * kotori.speed * elapsedTime * direction;
  }
}

export default UsageTopState;

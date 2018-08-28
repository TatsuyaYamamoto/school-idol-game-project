import { Deliverable, dispatchEvent, t, play } from "@sokontokoro/mikan";

import TopViewState from "./TopViewState";
import { Events } from "../TopView";

import CreditItem from "../../../texture/sprite/text/CreditItem";
import BackToMenuButton from "../../../texture/sprite/button/BackToMenuButton";

import { trackPageView, VirtualPageViews } from "../../../helper/tracker";

import { Ids as SoundIds } from "../../../resources/sound";
import { Ids as StringIds } from "../../../resources/string";

import { URL } from "../../../Constants";

class CreditState extends TopViewState {
  private _t28Credit: CreditItem;
  private _sanzashiCredit: CreditItem;
  private _onjinCredit: CreditItem;
  private _loveliveCredit: CreditItem;
  private _kirbyCredit: CreditItem;

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
    trackPageView(VirtualPageViews.CREDIT);

    this._t28Credit = new CreditItem(
      t(StringIds.CREDIT_T28),
      URL.SOKONTOKORO_HOME
    );
    this._t28Credit.position.set(this.viewWidth * 0.3, this.viewHeight * 0.2);

    this._sanzashiCredit = new CreditItem(
      t(StringIds.CREDIT_SANZASHI),
      URL.TWITTER_HOME_SANZASHI
    );
    this._sanzashiCredit.position.set(
      this.viewWidth * 0.8,
      this.viewHeight * 0.3
    );

    this._onjinCredit = new CreditItem(
      t(StringIds.CREDIT_ON_JIN),
      URL.ONJIN_TOP
    );
    this._onjinCredit.position.set(this.viewWidth * 0.2, this.viewHeight * 0.8);

    this._loveliveCredit = new CreditItem(
      t(StringIds.CREDIT_LOVELIVE),
      URL.LOVELIVE_TOP
    );
    this._loveliveCredit.position.set(
      this.viewWidth * 0.3,
      this.viewHeight * 0.5
    );

    this._kirbyCredit = new CreditItem(
      t(StringIds.CREDIT_KIRBY),
      URL.KIRBY_HOME
    );
    this._kirbyCredit.position.set(this.viewWidth * 0.7, this.viewHeight * 0.6);

    this._backToMenuButton = new BackToMenuButton();
    this._backToMenuButton.position.set(
      this.viewWidth * 0.85,
      this.viewHeight * 0.85
    );
    this._backToMenuButton.setOnClickListener(this._onBackToMenuClick);

    this.backGroundLayer.addChild(this.background);

    this.applicationLayer.addChild(
      this._backToMenuButton,
      this._t28Credit,
      this._sanzashiCredit,
      this._onjinCredit,
      this._loveliveCredit,
      this._kirbyCredit
    );
  }

  /**
   *
   * @private
   */
  private _onBackToMenuClick = () => {
    dispatchEvent(Events.REQUEST_BACK_TO_MENU);

    play(SoundIds.SOUND_CANCEL);
  };
}

export default CreditState;

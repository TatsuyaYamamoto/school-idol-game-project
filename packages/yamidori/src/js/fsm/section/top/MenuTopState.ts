import { interaction } from "pixi.js";
import Sound from "pixi-sound/lib/Sound";
const swal = require("sweetalert");
import { openExternalSite, tracePage, trackEvent } from "@sokontokoro/mikan";

import { Events } from "../../view/TopViewState";
import { dispatchEvent } from "../../../framework/EventUtils";

import ViewContainer from "../../../framework/ViewContainer";
import MenuBackground from "../../../container/sprite/background/MenuBackground";
import GameStartButton from "../../../container/sprite/button/GameStartButton";
import GoHowToPlayButton from "../../../container/sprite/button/GoHowToPlayButton";
import GoRankingButton from "../../../container/sprite/button/GoRankingButton";
import GoCreditButton from "../../../container/sprite/button/GoCreditButton";
import GoTwitterHomeButton from "../../../container/sprite/button/GoTwitterHomeButton";
import SoundButton from "../../../container/sprite/button/SoundButton";
import ChangeLanguageButton from "../../../container/sprite/button/ChangeLanguageButton";

import { toggleMute } from "../../../framework/utils";
import { loadSound } from "../../../framework/AssetLoader";
import { changeLanguage, getCurrentLanguage, t } from "../../../framework/i18n";

import { Ids as SoundIds } from "../../../resources/sound";
import { Ids } from "../../../resources/string";

import { SUPPORTED_LANGUAGES, URL } from "../../../Constants";
import { TRACK_ACTION, TRACK_PAGES } from "../../../resources/tracker";

class MenuTopState extends ViewContainer {
  public static TAG = "MenuTopState";

  private _menuBackground: MenuBackground;

  private _gameStartButton: GameStartButton;
  private _goCreditButton: GoCreditButton;
  private _goHowToPlayButton: GoHowToPlayButton;
  private _goRankingButton: GoRankingButton;
  private _goTwitterHomeButton: GoTwitterHomeButton;
  private _soundButton: SoundButton;
  private _changeLanguageButton: ChangeLanguageButton;

  private _okSound: Sound;
  private _toggleSound: Sound;

  /**
   * @inheritDoc
   */
  update(elapsedTimeMillis: number): void {}

  /**
   * @inheritDoc
   */
  onEnter(): void {
    super.onEnter();

    tracePage(TRACK_PAGES.MENU);

    this._menuBackground = new MenuBackground();

    this._gameStartButton = new GameStartButton();
    this._gameStartButton.position.set(
      this.viewWidth * 0.2,
      this.viewHeight * 0.65
    );
    this._gameStartButton.setOnClickListener(this.onGameStartButtonClick);

    this._goHowToPlayButton = new GoHowToPlayButton();
    this._goHowToPlayButton.position.set(
      this.viewWidth * 0.45,
      this.viewHeight * 0.65
    );
    this._goHowToPlayButton.setOnClickListener(this.onHowToUseButtonClick);

    this._goRankingButton = new GoRankingButton();
    this._goRankingButton.position.set(
      this.viewWidth * 0.7,
      this.viewHeight * 0.65
    );

    this._goCreditButton = new GoCreditButton();
    this._goCreditButton.position.set(
      this.viewWidth * 0.9,
      this.viewHeight * 0.8
    );
    this._goCreditButton.setOnClickListener(this.onCreditButtonClick);

    this._goTwitterHomeButton = new GoTwitterHomeButton();
    this._goTwitterHomeButton.position.set(
      this.viewWidth * 0.9,
      this.viewHeight * 0.15
    );
    this._goTwitterHomeButton.setOnClickListener(this.onTwitterHomeButtonClick);

    this._soundButton = new SoundButton();
    this._soundButton.position.set(
      this.viewWidth * 0.8,
      this.viewHeight * 0.15
    );
    this._soundButton.setOnClickListener(this.onSoundButtonClick);

    this._changeLanguageButton = new ChangeLanguageButton();
    this._changeLanguageButton.position.set(
      this.viewWidth * 0.17,
      this.viewHeight * 0.15
    );
    this._changeLanguageButton.setOnClickListener(
      this.onChangeLanguageButtonClick
    );

    this.applicationLayer.addChild(
      this._menuBackground,
      this._gameStartButton,
      this._goCreditButton,
      this._goHowToPlayButton,
      this._goRankingButton,
      this._goTwitterHomeButton,
      this._soundButton,
      this._changeLanguageButton
    );

    this._okSound = loadSound(SoundIds.SOUND_OK);
    this._toggleSound = loadSound(SoundIds.SOUND_TOGGLE_SOUND);
  }

  /**
   * @inheritDoc
   */
  onExit(): void {
    super.onExit();
  }

  private onGameStartButtonClick = (
    event: interaction.InteractionEvent
  ): void => {
    this._okSound.play();
    dispatchEvent(Events.REQUEST_GAME_START);
  };

  private onTwitterHomeButtonClick = (
    event: interaction.InteractionEvent
  ): void => {
    trackEvent(TRACK_ACTION.CLICK, { label: "home" });
    openExternalSite(URL.SOKONTOKORO_HOME, false);
  };

  private onHowToUseButtonClick = (
    event: interaction.InteractionEvent
  ): void => {
    this._okSound.play();
    dispatchEvent(Events.REQUEST_GO_TO_USAGE);
  };

  private onCreditButtonClick = (event: interaction.InteractionEvent): void => {
    this._okSound.play();
    dispatchEvent(Events.REQUEST_GO_TO_CREDIT);
  };

  private onSoundButtonClick = () => {
    this._toggleSound.play();
    toggleMute();
  };

  private onChangeLanguageButtonClick = () => {
    this._okSound.play();
    trackEvent(TRACK_ACTION.CLICK, { label: "change_language" });

    swal(t(Ids.CHANGE_LANGUAGE_INFO), { buttons: true }).then((willChange) => {
      if (willChange) {
        swal(t(Ids.RELOAD_APP_INFO)).then(() => {
          const nextLang =
            getCurrentLanguage() === SUPPORTED_LANGUAGES.EN
              ? SUPPORTED_LANGUAGES.JA
              : SUPPORTED_LANGUAGES.EN;
          changeLanguage(nextLang);

          location.reload();
        });
      }
    });
  };
}

export default MenuTopState;

import { Container, interaction } from "pixi.js";

import { loadTexture, isSupportTouchEvent } from "mikan";

import Sprite from "../internal/Sprite";
import Button from "../internal/Button";
import HowToPlayButton from "../sprite/button/HowToPlayButton";
import CreditButton from "../sprite/button/CreditButton";
import SelectCharacterButton from "../sprite/button/SelectCharacterButton";
import HomeButton from "../sprite/button/HomeButton";
import SoundButton from "../sprite/button/SoundButton";

import { Ids } from "../../resources/image";

/**
 * @class
 */
class MenuBoardBackGround extends Sprite {
  constructor() {
    super(loadTexture(Ids.MENU_BOARD));
  }
}

/**
 * @class
 */
class MenuBoard extends Container {
  private _backGround: MenuBoardBackGround;

  private _homeButton: HomeButton;
  private _soundButton: SoundButton;
  private _onePlayerGameStartButton: Button;
  private _multiPlayerGameStartButton: Button;
  private _howToPlayButton: HowToPlayButton;
  private _creditButton: CreditButton;
  private _selectCharacterButton: SelectCharacterButton;

  public get soundButton(): SoundButton {
    return this._soundButton;
  }

  constructor(width: number, height: number) {
    super();

    this._backGround = new MenuBoardBackGround();
    this._backGround.position.set(0);

    this._homeButton = new HomeButton();
    this._homeButton.position.set(width * 0.35, -1 * height * 0.33);

    this._soundButton = new SoundButton();
    this._soundButton.position.set(width * 0.55, -1 * height * 0.33);

    this._onePlayerGameStartButton = new Button(
      loadTexture(Ids.BUTTON_MENU_SINGLE_PLAY_GAME_START)
    );
    this._onePlayerGameStartButton.position.set(
      -1 * width * 0.5,
      height * 0.05
    );

    this._multiPlayerGameStartButton = new Button(
      loadTexture(Ids.BUTTON_MENU_MULTI_PLAY_GAME_START)
    );
    this._multiPlayerGameStartButton.position.set(
      -1 * width * 0.25,
      height * 0.05
    );

    this._howToPlayButton = new HowToPlayButton();
    this._howToPlayButton.position.set(width * 0, height * 0.05);

    this._creditButton = new CreditButton();
    this._creditButton.position.set(width * 0.25, height * 0.05);

    this._selectCharacterButton = new SelectCharacterButton();
    this._selectCharacterButton.position.set(width * 0.57, height * 0.2);

    this.addChild(
      this._backGround,
      this._onePlayerGameStartButton,
      this._multiPlayerGameStartButton,
      this._howToPlayButton,
      this._creditButton,
      this._selectCharacterButton,
      this._homeButton,
      this._soundButton
    );
  }

  public setOnSelectHomeListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._homeButton.interactive = true;
    this._homeButton.on(isSupportTouchEvent() ? "touchstart" : "click", fn);
  }

  public setOnSelectSoundListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._soundButton.interactive = true;
    this._soundButton.on(isSupportTouchEvent() ? "touchstart" : "click", fn);
  }

  public setOnOnePlayerGameStartClickListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._onePlayerGameStartButton.interactive = true;
    this._onePlayerGameStartButton.on(
      isSupportTouchEvent() ? "touchstart" : "click",
      fn
    );
  }

  public setOnMultiPlayerGameStartClickListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._multiPlayerGameStartButton.interactive = true;
    this._multiPlayerGameStartButton.on(
      isSupportTouchEvent() ? "touchstart" : "click",
      fn
    );
  }

  public setOnSelectHowToPlayListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._howToPlayButton.interactive = true;
    this._howToPlayButton.on(
      isSupportTouchEvent() ? "touchstart" : "click",
      fn
    );
  }

  public setOnSelectCreditListener(
    fn: (event: interaction.InteractionEvent) => void
  ) {
    this._creditButton.interactive = true;
    this._creditButton.on(isSupportTouchEvent() ? "touchstart" : "click", fn);
  }
}

export default MenuBoard;

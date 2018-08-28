import { Container, interaction } from "pixi.js";

import { loadTexture, isSupportTouchEvent } from "@sokontokoro/mikan";

import Sprite from "../internal/Sprite";

import BeginnerLevelButton from "../sprite/button/BeginnerLevelButton";
import NoviceLevelButton from "../sprite/button/NoviceLevelButton";
import ExpertLevelButton from "../sprite/button/ExpertLevelButton";
import Button from "../internal/Button";

import { Ids } from "../../resources/image";
import Mode from "../../models/Mode";

export type ClickEventType = "back";

/**
 * @class
 */
class SelectLevelBoardBackGround extends Sprite {
  constructor() {
    super(loadTexture(Ids.SELECT_LEVEL_BOARD));
  }
}

class SelectLevelBoard extends Container {
  private _background: SelectLevelBoardBackGround;
  private _beginnerButton: BeginnerLevelButton;
  private _noviceButton: NoviceLevelButton;
  private _expertButton: ExpertLevelButton;
  private backButton: Button;

  constructor(width: number, height: number) {
    super();

    this._background = new SelectLevelBoardBackGround();
    this._background.position.set(0);

    this._beginnerButton = new BeginnerLevelButton();
    this._beginnerButton.position.set(-1 * width * 0.3, height * 0.05);

    this._noviceButton = new NoviceLevelButton();
    this._noviceButton.position.set(0, height * 0.05);

    this._expertButton = new ExpertLevelButton();
    this._expertButton.position.set(width * 0.3, height * 0.05);

    this.backButton = new Button(loadTexture(Ids.BUTTON_MENU_BACK));
    this.backButton.position.set(-1 * width * 0.75, -1 * height * 0.37);

    this.addChild(
      this._background,
      this.backButton,
      this._beginnerButton,
      this._noviceButton,
      this._expertButton
    );
  }

  /**
   * Register a callback to be invoked when any level is selected.
   *
   * @param {(event: PIXI.interaction.InteractionEvent, level: ("beginner" | "novice" | "expert")) => void} fn
   */
  public setOnSelectLevelListener(
    fn: (event: interaction.InteractionEvent, mode?: Mode) => void
  ) {
    const type = isSupportTouchEvent() ? "touchstart" : "click";

    this._beginnerButton.interactive = true;
    this._beginnerButton.on(type, (event: interaction.InteractionEvent) =>
      fn(event, Mode.SINGLE_BEGINNER)
    );

    this._noviceButton.interactive = true;
    this._noviceButton.on(type, (event: interaction.InteractionEvent) =>
      fn(event, Mode.SINGLE_NOVICE)
    );

    this._expertButton.interactive = true;
    this._expertButton.on(type, (event: interaction.InteractionEvent) =>
      fn(event, Mode.SINGLE_EXPERT)
    );
  }

  public onClick(
    event: ClickEventType,
    fn: (event: interaction.InteractionEvent, mode?: Mode) => void
  ) {
    const type = isSupportTouchEvent() ? "touchstart" : "click";

    switch (event) {
      case "back":
        this.backButton.interactive = true;
        this.backButton.on(type, (event: interaction.InteractionEvent) =>
          fn(event)
        );
        break;
    }
  }
}

export default SelectLevelBoard;

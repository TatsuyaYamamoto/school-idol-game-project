/* eslint-disable max-classes-per-file */
import { Container, interaction } from "pixi.js";

import { loadTexture, isSupportTouchEvent } from "@sokontokoro/mikan";

import Sprite from "../internal/Sprite";

import { Ids } from "../../resources/image";
import Mode from "../../models/Mode";
import Button from "../internal/Button";

export type ClickEventType = "offline" | "online" | "back";

/**
 * @class
 */
class MenuBoardBackGround extends Sprite {
  constructor() {
    super(loadTexture(Ids.SELECT_MULTI_MODE_BOARD));
  }
}

class SelectMultiPlayModeBoard extends Container {
  readonly background: MenuBoardBackGround;

  readonly offlineButton: Button;

  readonly onlineButton: Button;

  readonly backButton: Button;

  constructor(width: number, height: number) {
    super();

    this.background = new MenuBoardBackGround();
    this.background.position.set(0);

    this.backButton = new Button(loadTexture(Ids.BUTTON_MENU_BACK));
    this.backButton.position.set(-1 * width * 0.75, -1 * height * 0.37);

    this.offlineButton = new Button(loadTexture(Ids.BUTTON_MENU_OFFLINE_GAME));
    this.offlineButton.position.set(-1 * width * 0.2, height * 0.05);

    this.onlineButton = new Button(loadTexture(Ids.BUTTON_MENU_ONLINE_GAME));
    this.onlineButton.position.set(width * 0.2, height * 0.05);

    this.addChild(
      this.background,
      this.backButton,
      this.offlineButton,
      this.onlineButton
    );
  }

  public onClick(
    event: ClickEventType,
    fn: (event: interaction.InteractionEvent, mode?: Mode) => void
  ): void {
    const type = isSupportTouchEvent() ? "touchstart" : "click";

    switch (event) {
      case "online":
        this.onlineButton.interactive = true;
        this.onlineButton.on(type, (e: interaction.InteractionEvent) =>
          fn(e, Mode.MULTI_ONLINE)
        );
        break;

      case "offline":
        this.offlineButton.interactive = true;
        this.offlineButton.on(type, (e: interaction.InteractionEvent) =>
          fn(e, Mode.MULTI_LOCAL)
        );
        break;

      case "back":
        this.backButton.interactive = true;
        this.backButton.on(type, (e: interaction.InteractionEvent) => fn(e));
        break;
      default:
      // do nothing
    }
  }
}

export default SelectMultiPlayModeBoard;

import { Container, DisplayObject, Graphics, TextStyleOptions } from "pixi.js";

import VerticalText from "../sprite/text/VerticalText";
import Text from "../internal/Text";

const labelTextStyle: TextStyleOptions = {
  fontFamily: "g_brushtappitsu_freeH",
  fontSize: 35,
};

class PlayerCharacterIndicateBoard extends Container {
  private _text: VerticalText;
  private _rectangle: Graphics;

  constructor(text: string, isVertical = true) {
    super();
    this._text = isVertical
      ? new VerticalText(text, labelTextStyle)
      : new Text(text, labelTextStyle);
    this._text.anchor.set(0.5, 0);

    const margin = isVertical
      ? this._text.width * 0.25
      : this._text.height * 0.25;
    const rectangleWidth = margin + this._text.width + margin;
    const rectangleHeight = margin + this._text.height + margin;

    this._rectangle = new Graphics();
    this._rectangle.beginFill(0xffffff, 1);
    this._rectangle.drawRect(
      (-1 * rectangleWidth) / 2,
      -1 * margin,
      rectangleWidth,
      rectangleHeight
    );
    this._rectangle.endFill();

    this.addChild<DisplayObject>(this._rectangle, this._text);
  }

  set text(text: string) {
    this._text.text = text;
  }
}
/*
class BattleResultLabelBoard extends Container {
    protected _resultLabel: BattleResultLabel;
    protected _playerLabel: BattleResultLabel;
    protected _opponentLabel: BattleResultLabel;

    constructor(width: number,
                height: number,
                type: 'playerWin' | 'opponentWin' | 'falseStart' | 'draw',
                winnerName?: string) {
        super();

        const isVertical = VERTICAL_SUPPORT_LANGUAGES.indexOf(getCurrentLanguage()) >= 0;
        const resultLabel = type === 'playerWin' || type === 'opponentWin' ?
            t(StringIds.LABEL_WINNER) :
            t(StringIds.LABEL_FALSE_START);

        const labelPositionY = isVertical ?
            -1 * height * 0.45 :
            -1 * height * 0.4;
        const characterLabelPositionX = width * 0.3;

        this._resultLabel = new BattleResultLabel(resultLabel, isVertical);
        isVertical ?
            this._resultLabel.position.set(0, labelPositionY) :
            this._resultLabel.position.set(0, labelPositionY);

        if (type === 'playerWin') {
            this._playerLabel = new BattleResultLabel(winnerName, isVertical);
            isVertical ?
                this._playerLabel.position.set(-1 * characterLabelPositionX, labelPositionY) :
                this._playerLabel.position.set(-1 * characterLabelPositionX, labelPositionY);
        }

        if (type === 'opponentWin') {
            this._opponentLabel = new BattleResultLabel(winnerName, isVertical);
            isVertical ?
                this._opponentLabel.position.set(characterLabelPositionX, labelPositionY) :
                this._opponentLabel.position.set(characterLabelPositionX, labelPositionY);
        }

        this.addChild(this._resultLabel);
        type === 'playerWin' && this.addChild(this._playerLabel);
        type === 'opponentWin' && this.addChild(this._opponentLabel);
    }
}
*/
export default PlayerCharacterIndicateBoard;

import State from "./state.js";

export default class Timer {
  constructor(limit, callback) {
    const config = {
      position: {
        time: {
          x: State.gameScrean.width * 0.15,
          y: State.gameScrean.height * 0.9,
        },
        subtitle: {
          x: State.gameScrean.width * 0.15,
          y: State.gameScrean.height * 0.85,
        },
        unit: {
          x: State.gameScrean.width * 0.15,
          y: State.gameScrean.height * 0.95,
        },
      },
    };
    const shapeSize = State.gameScrean.width * 0.1;
    const unitTextSize = State.gameScrean.width * 0.04;
    const timeTextSize = State.gameScrean.width * 0.12;

    this.callback = callback;
    this.timer = null;
    this.count = limit;

    // 背面の円
    this._shape = new createjs.Shape();
    this._fill = this._shape.graphics.beginFill("#33CCFF").command;
    this._shape.graphics.drawCircle(0, 0, shapeSize);
    this._shape.graphics.endFill();
    this._shape.x = config.position.time.x;
    this._shape.y = config.position.time.y;

    // サブタイトル
    this._subtitleText = new createjs.Text(
      "のこり",
      `bold ${unitTextSize}px Arial`,
      "#FFFFFF"
    );
    this._subtitleText.textAlign = "center";
    this._subtitleText.textBaseline = "middle";
    this._subtitleText.x = config.position.subtitle.x;
    this._subtitleText.y = config.position.subtitle.y;

    // 秒数
    this._timeText = new createjs.Text(
      "",
      `bold ${timeTextSize}px Arial`,
      "#FFFFFF"
    );
    this._timeText.textAlign = "center";
    this._timeText.textBaseline = "middle";
    this._timeText.x = config.position.time.x;
    this._timeText.y = config.position.time.y;
    this._timeText.text = `${this.count}`;

    // 単位
    this._unitText = new createjs.Text(
      "びょう",
      `bold ${unitTextSize}px Arial`,
      "#FFFFFF"
    );
    this._unitText.textAlign = "center";
    this._unitText.textBaseline = "middle";
    this._unitText.x = config.position.unit.x;
    this._unitText.y = config.position.unit.y;

    this.countdown = this.countdown.bind(this);
  }

  getElementArray() {
    return [this._shape, this._timeText, this._subtitleText, this._unitText];
  }

  /**
   * カウントを開始する
   */
  start() {
    this.clear();
    this.timer = setInterval(this.countdown, 1000);
  }

  /**
   * カウンターを引数の値だけ増加させる
   * @param count
   */
  addCount(count) {
    this.count = this.count + count;
    this._timeText.text = `${this.count}`;
  }

  /**
   * カウントダウンプロセス
   */
  countdown() {
    if (this.count > 0) {
      this.count--;
      this._timeText.text = `${this.count}`;
    } else {
      // this.clear();
      // setTimeout(timeout, 2000);
    }

    if (this.count == 0) {
      this.clear();
      this.callback();
    }

    if (this.count > 5) {
      this._fill.style = "#33CCFF";
      this._timeText.color = "#FFFFFF";
    } else {
      this._fill.style = "#FF99CC";
      this._timeText.color = "#FFFF00";
    }
  }

  /**
   * カウンターを初期化する
   */
  clear() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

import HammerImage from "./imageBase64/hammer.js";

require("../fonts/PixelMplus10-Regular.css");

const BRAND_CHARACTERS = ["そ", "こ", "ん", "と", "こ", "ろ", "工", "房"];
const TIMELINE_LABEL = "label";
const TIMELINE = {
  SHRINK: 100,
  EXPANTION: 200,
  CHARACTER_WAITING: 200,
  CHARACTER_EXTEND: 100,
  HAMMER_MOVING: 700,
  CHARACTER_BOU_WAITING: 300,
  CHARACTER_BOU_ROTATION: 100,
  BUFFER: 300,
};

export default class BrandingAnimation {
  constructor(params) {
    this._x = params["x"];
    this._y = params["y"];
    this._width = params["width"];
    this._height = params["height"];
    this._scale = params["scale"];

    this._container = new createjs.Container();
    this._timeline = new createjs.Timeline();
    this._timeline.addLabel(TIMELINE_LABEL);
    this._promise = new Promise((resolve, reject) => {
      this.init(resolve);
    });
  }

  /**
   * アニメーションで描画される各Createjsインスタンスを持ったContainerインスタンスを返却する
   *
   * @returns {createjs.Container|*}
   */
  get container() {
    return this._container;
  }

  /**
   * TweenのPromiseインスタンスを返却する
   * Tween完了後にresolveされる。
   *
   * @returns {Promise}
   */
  get promise() {
    return this._promise;
  }

  /**
   * Tweenを開始する
   */
  start() {
    this._timeline.gotoAndPlay(TIMELINE_LABEL);
  }

  /**
   * Tweenを作成する
   * 引数のresolvePromiseはTween完了後に実行される
   *
   * @param resolvePromise
   */
  init(resolvePromise) {
    const createjsCharacters = [];

    /**
     * 各文字のCreatejs.Textインスタンスを作成
     * 作成後、コンテナに追加
     */
    BRAND_CHARACTERS.forEach((character) => {
      const text = BrandingAnimation.getTextCreatejsObject(
        character,
        this._x,
        this._y,
        this._width * 0.06
      );

      this._container.addChild(text);

      createjsCharacters.push(text);
    });

    /**
     * 各文字のCreatejs.Textインスタンスを作成、コンテナ追加
     */
    const hammer = BrandingAnimation.getImageCreatejsObject(
      HammerImage,
      this._x + this._width * 0.07,
      this._y - this._height * 0.04,
      this._scale
    );
    this._container.addChild(hammer);

    /**
     * characterのTimeline
     *
     * 1. Hammerに合わせて上下に伸縮
     * 2. 'そこんところ工房'の順に書く文字を移動
     * 3. '房'のみ回転
     */
    for (var i = 0; i < BRAND_CHARACTERS.length; i++) {
      const target = createjsCharacters[i];

      // 各文字の最終的なx方向の位置を計算
      const cellTotal = BRAND_CHARACTERS.length + 5;
      const cellIndex = i + 3;
      const position = (cellIndex - cellTotal / 2) / cellTotal;

      // tweenの追加
      if (target.text == "房") {
        this._timeline.addTween(
          createjs.Tween.get(target, { loop: false })
            .wait((TIMELINE.EXPANTION + TIMELINE.SHRINK) * i)
            .to({ scaleY: 1 }, TIMELINE.EXPANTION)
            .to({ scaleY: 0 }, TIMELINE.SHRINK)
            .to({ scaleX: 0, scaleY: 1 }, 0)
            .wait(
              (TIMELINE.EXPANTION + TIMELINE.SHRINK) *
                (BRAND_CHARACTERS.length - i - 1)
            )
            .wait(TIMELINE.CHARACTER_WAITING)
            .to(
              { x: this._x + this._width * position, scaleX: 1 },
              TIMELINE.CHARACTER_EXTEND
            )
            .wait(TIMELINE.CHARACTER_BOU_WAITING)
            .to({ rotation: 45 }, TIMELINE.CHARACTER_BOU_ROTATION)
        );
      } else {
        this._timeline.addTween(
          createjs.Tween.get(target, { loop: false })
            .wait((TIMELINE.EXPANTION + TIMELINE.SHRINK) * i)
            .to({ scaleY: 1 }, TIMELINE.EXPANTION)
            .to({ scaleY: 0 }, TIMELINE.SHRINK)
            .to({ scaleX: 0, scaleY: 1 }, 0)
            .wait(
              (TIMELINE.EXPANTION + TIMELINE.SHRINK) *
                (BRAND_CHARACTERS.length - i - 1)
            )
            .wait(TIMELINE.CHARACTER_WAITING)
            .to(
              { x: this._x + this._width * position, scaleX: 1 },
              TIMELINE.CHARACTER_EXTEND
            )
        );
      }
    }

    /**
     * Hammerの回転のTimeline
     *
     * 1. 各文字の伸縮に合わせてハンマーを90度回転(振る)
     * 2. 1と反対方向に回転
     */
    this._timeline.addTween(
      createjs.Tween.get(hammer)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 1
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 2
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 3
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 4
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 5
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 6
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 7
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to({ rotation: -90 }, TIMELINE.EXPANTION) // 8
        .to({ rotation: 0 }, TIMELINE.SHRINK)
        .to(
          {
            regY: hammer.image.height * 0.5,
          },
          0
        )
        .to({ rotation: 360 * 7 - 45 }, TIMELINE.HAMMER_MOVING)
    );

    // Hammerのx軸移動のTimeline
    this._timeline.addTween(
      createjs.Tween.get(hammer)
        .wait((TIMELINE.EXPANTION + TIMELINE.SHRINK) * BRAND_CHARACTERS.length)
        .to({ x: this._x + this._width * 0.35 }, TIMELINE.HAMMER_MOVING)
    );

    // Hammerのy軸移動のTimeline
    this._timeline.addTween(
      createjs.Tween.get(hammer)
        .wait((TIMELINE.EXPANTION + TIMELINE.SHRINK) * BRAND_CHARACTERS.length)
        .to(
          { y: this._y - this._height * 0.18 },
          TIMELINE.HAMMER_MOVING * 0.5,
          createjs.Ease.quadOut
        )
        .to(
          { y: this._y - this._height * 0.05 },
          TIMELINE.HAMMER_MOVING * 0.5,
          createjs.Ease.quadIn
        )
    );

    // Promise#resolve()をcallbackするTimeline
    this._timeline.addTween(
      createjs.Tween.get(new createjs.Text())
        .wait(
          (TIMELINE.EXPANTION + TIMELINE.SHRINK) * BRAND_CHARACTERS.length +
            TIMELINE.CHARACTER_WAITING +
            TIMELINE.CHARACTER_EXTEND +
            TIMELINE.CHARACTER_BOU_WAITING +
            TIMELINE.CHARACTER_BOU_ROTATION +
            TIMELINE.BUFFER
        )
        .call(() => {
          resolvePromise();
        })
    );
  }

  static getTextCreatejsObject(text, x, y, size) {
    const character = new createjs.Text();
    character.x = x;
    character.y = y;
    character.font = size + "px " + "PixelMplus10-Regular";
    character.textAlign = "center";
    character.textBaseline = "bottom";
    character.text = text;
    character.scaleY = 0;

    return character;
  }
  static getImageCreatejsObject(image, x, y, scale) {
    const bitmap = new createjs.Bitmap(image);
    bitmap.scaleY = bitmap.scaleX = scale * 2;
    bitmap.x = x;
    bitmap.y = y;
    bitmap.regX = bitmap.image.width * 0.5;
    bitmap.regY = bitmap.image.height;

    return bitmap;
  }
}

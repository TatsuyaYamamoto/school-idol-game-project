import { Container, DisplayObject } from "pixi.js";

import State from "./State";
import Deliverable from "./Deliverable";

import config from "./config";
import { isSupportTouchEvent } from "./utils";
import StateMachine from "./StateMachine";

/**
 * A Container represents a collection of basic containers; {@link this#backGroundLayer},
 * {@link this#applicationLayer} and {@link this#informationLayer}.
 *
 * @class
 */
abstract class ViewContainer extends Container implements State {
  private _stateMachine: StateMachine<ViewContainer>;

  private _backGroundLayer: Container;
  private _applicationLayer: Container;
  private _informationLayer: Container;

  private _viewWidth: number;
  private _viewHeight: number;

  private _elapsedTimeMillis: number;

  constructor() {
    super();

    this._stateMachine = new StateMachine<ViewContainer>();

    this._backGroundLayer = new Container();
    this._applicationLayer = new Container();
    this._informationLayer = new Container();

    // Set only containers that {@link this} manages
    this.addChild(
      this._backGroundLayer,
      this._applicationLayer,
      this._informationLayer
    );

    this._viewWidth = config.basicImageWidth;
    this._viewHeight = config.basicImageHeight;
  }

  protected get viewWidth(): number {
    return this._viewWidth;
  }

  protected get viewHeight(): number {
    return this._viewHeight;
  }

  protected get elapsedTimeMillis(): number {
    return this._elapsedTimeMillis;
  }

  protected get stateMachine(): StateMachine<ViewContainer> {
    return this._stateMachine;
  }

  public get backGroundLayer(): Container {
    return this._backGroundLayer;
  }

  public get applicationLayer(): Container {
    return this._applicationLayer;
  }

  public get informationLayer(): Container {
    return this._informationLayer;
  }

  /**
   * @inheritDoc
   * @see State#update
   */
  update(elapsedMS: number): void {
    this._elapsedTimeMillis += elapsedMS;
  }

  /**
   * @inheritDoc
   * @see State#onEnter
   */
  onEnter(params: Deliverable): void {
    console.log(`${this.constructor.name}@onEnter`, params);
    this._elapsedTimeMillis = 0;
  }

  /**
   * @inheritDoc
   * @see State#onExit
   */
  onExit(): void | Deliverable {
    console.log(`${this.constructor.name}@onExit`);

    this.stateMachine.current && this.stateMachine.current.onExit();

    this.backGroundLayer.removeChildren();
    this.applicationLayer.removeChildren();
    this.informationLayer.removeChildren();
  }

  /**
   * Convenient method to add click event to {@link window}.
   * Attached event type is in consideration that the device is supporting touch event with {@link isSupportTouchEvent}.
   *
   * @param {(ev: WindowEventMap[K]) => any} listener
   */
  protected addClickWindowEventListener<K extends keyof WindowEventMap>(
    listener: (this: Window, ev: WindowEventMap[K]) => any
  ): void {
    window.addEventListener(
      isSupportTouchEvent() ? "touchstart" : "click",
      listener
    );
  }

  /**
   * Convenient method to remove click event to {@link window}.
   * Attached event type is in consideration that the device is supporting touch event with {@link isSupportTouchEvent}.
   *
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | EventListenerOptions} options
   */
  protected removeClickWindowEventListener(
    listener?: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    window.removeEventListener(
      isSupportTouchEvent() ? "touchstart" : "click",
      listener
    );
  }

  /**
   * @deprecated
   * Deprecated to {@link addChild} some {@link DisplayObject}s to {@link this} container directly.
   * You should use {@link this#backGroundLayer}, {@link this#applicationLayer}, {@link this#informationLayer}
   * in according to providing {@link DisplayObject}'s role.
   *
   * @override
   */
  public addChild<T extends DisplayObject>(
    child: T,
    ...additionalChildren: DisplayObject[]
  ): T {
    return super.addChild(child, ...additionalChildren);
  }

  /**
   * @deprecated
   * @inheritDoc
   * @see this#addChild
   * @override
   */
  public addChildAt<T extends DisplayObject>(child: T, index: number): T {
    return super.addChildAt(child, index);
  }

  /**
   * @deprecated
   * @inheritDoc
   * @see this#addChild
   * @override
   */
  public removeChild(child: DisplayObject): DisplayObject {
    return super.removeChild(child);
  }

  /**
   * @deprecated
   * @inheritDoc
   * @see this#addChild
   * @override
   */
  public removeChildAt(index: number): DisplayObject {
    return super.removeChildAt(index);
  }

  /**
   * @deprecated
   * @inheritDoc
   * @see this#addChild
   * @override
   */
  public removeChildren(
    beginIndex?: number,
    endIndex?: number
  ): DisplayObject[] {
    return super.removeChildren(beginIndex, endIndex);
  }

  /**
   *
   * @param {string} stateTag
   * @param {T} params
   */
  protected to<T>(stateTag: string, params?: T) {
    if (!this.stateMachine) {
      return;
    }

    this.stateMachine.change(stateTag, params);
    this.applicationLayer.removeChildren();
    this.applicationLayer.addChild(this.stateMachine.current);
  }
}

export default ViewContainer;

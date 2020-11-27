abstract class EventEmitter {
  private _callbacks: { [eventType: string]: Function[] } = {};

  public once(eventType: string, callback) {
    const onceCallback = (params) => {
      this.off(eventType, onceCallback);

      callback(params);
    };

    this.on(eventType, onceCallback);
  }

  public on(eventType: string, callback) {
    console.log(`${this.constructor.name}@Add event.`, eventType);

    this._callbacks[eventType] = this._callbacks[eventType] || [];
    this._callbacks[eventType].push(callback);
  }

  public off(eventType?: string, callback?) {
    console.log(`${this.constructor.name}@Remove event.`, eventType);

    if (!eventType) {
      Object.keys(this._callbacks).forEach((eventType) => {
        delete this._callbacks[eventType];
      });
      return;
    }

    if (!this._callbacks[eventType]) {
      return;
    }

    if (callback) {
      const targetIndex = this._callbacks[eventType].findIndex(
        (registered) => registered === callback
      );
      this._callbacks[eventType].splice(targetIndex, 1);
    } else {
      delete this._callbacks[eventType];
    }
  }

  public dispatch(eventType: string, params?: any) {
    console.log(`${this.constructor.name}@Dispatch event.`, eventType, params);

    if (!this._callbacks[eventType]) {
      return;
    }

    this._callbacks[eventType].forEach((callback) => {
      callback(params);
    });
  }
}

export default EventEmitter;

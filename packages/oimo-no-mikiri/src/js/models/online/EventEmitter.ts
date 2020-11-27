abstract class EventEmitter {
  // eslint-disable-next-line
  private _callbacks: { [eventType: string]: ((params: any) => void)[] } = {};

  // eslint-disable-next-line
  public once(eventType: string, callback: (params: any) => void): void {
    // eslint-disable-next-line
    const onceCallback = (params: any): void => {
      this.off(eventType, onceCallback);

      callback(params);
    };

    this.on(eventType, onceCallback);
  }

  // eslint-disable-next-line
  public on(eventType: string, callback: (params: any) => void): void {
    console.log(`${this.constructor.name}@Add event.`, eventType);

    this._callbacks[eventType] = this._callbacks[eventType] || [];
    this._callbacks[eventType].push(callback);
  }

  // eslint-disable-next-line
  public off(eventType?: string, callback?: (params: any) => void): void {
    console.log(`${this.constructor.name}@Remove event.`, eventType);

    if (!eventType) {
      Object.keys(this._callbacks).forEach((key) => {
        delete this._callbacks[key];
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

  // eslint-disable-next-line
  public dispatch(eventType: string, params?: any): void {
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

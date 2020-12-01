class LimitedArray<T> {
  readonly _items: T[];

  constructor(readonly maxSize: number, initValues: T[] = []) {
    this._items = initValues;

    if (!(Number.isInteger(maxSize) && maxSize > 0)) {
      throw new Error("max size should be natural number.");
    }

    if (maxSize < initValues.length) {
      throw new Error("initial items' size is larger than max.");
    }
  }

  /**
   * 先頭に追加
   *
   * @param items
   */
  public unshift(...items: T[]): void {
    this._items.unshift(...items);

    // 超過分、末尾のitemから削除
    while (this.maxSize < this.size()) {
      this._items.pop();
    }
  }

  /**
   * 末尾に追加
   *
   * @param items
   */
  public push(...items: T[]): void {
    this._items.push(...items);

    // 超過分、先頭のitemから削除
    while (this.maxSize < this.size()) {
      this._items.shift();
    }
  }

  public size(): number {
    return this._items.length;
  }

  public get(index: number): T {
    return this._items[index];
  }

  public getFirst(): T {
    return this._items[0];
  }

  public getLast(): T {
    return this._items[this._items.length - 1];
  }

  public getAll(): T[] {
    // for immutable
    return [...this._items];
  }

  public forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    // eslint-disable-next-line
    thisArg?: any
  ): void {
    this._items.forEach(callbackfn, thisArg);
  }

  public map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    // eslint-disable-next-line
    thisArg?: any
  ): U[] {
    return this._items.map(callbackfn, thisArg);
  }
}

export default LimitedArray;

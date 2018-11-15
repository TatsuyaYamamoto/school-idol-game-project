import LimitedArray from "../LimitedArray";

describe("LimitedArray", () => {
  it("should limit by push() under policy of first come first receive", () => {
    const textMaxSize = 5;

    const limitedArray = new LimitedArray(textMaxSize);

    limitedArray.push(1);
    expect(limitedArray.size()).toBe(1);
    expect(limitedArray.getAll()).toEqual([1]);

    limitedArray.push(2, 3, 4);
    expect(limitedArray.size()).toBe(4);
    expect(limitedArray.getAll()).toEqual([1, 2, 3, 4]);

    limitedArray.push(5);
    expect(limitedArray.size()).toBe(textMaxSize);
    expect(limitedArray.getAll()).toEqual([1, 2, 3, 4, 5]);

    limitedArray.push(6);
    expect(limitedArray.size()).toBe(textMaxSize);
    expect(limitedArray.getAll()).toEqual([2, 3, 4, 5, 6]);
  });

  it("should limit by unshift() under policy of first come first receive", () => {
    const textMaxSize = 10;

    const limitedArray = new LimitedArray(textMaxSize);

    limitedArray.unshift(1, 2, 3);
    expect(limitedArray.size()).toBe(3);
    expect(limitedArray.getAll()).toEqual([1, 2, 3]);

    limitedArray.unshift(4, 5, 6, 7);
    expect(limitedArray.size()).toBe(7);
    expect(limitedArray.getAll()).toEqual([4, 5, 6, 7, 1, 2, 3]);

    limitedArray.unshift(8, 9, 10, 11, 12);
    expect(limitedArray.size()).toBe(textMaxSize);
    expect(limitedArray.getAll()).toEqual([8, 9, 10, 11, 12, 4, 5, 6, 7, 1]);
  });

  it("should throw", () => {
    expect(() => new LimitedArray(2, [1, 2, 3])).toThrow();
  });

  it("should throw", () => {
    expect(() => new LimitedArray(-1)).toThrow();
  });

  it("should throw", () => {
    expect(() => new LimitedArray(1.1)).toThrow();
  });
});

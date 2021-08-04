export const randomInt = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

export const between = (min: number, target: number, max: number) => {
  return min < target && target < max;
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const randomInt = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

export const between = (min: number, target: number, max: number) => {
  return min < target && target < max;
};

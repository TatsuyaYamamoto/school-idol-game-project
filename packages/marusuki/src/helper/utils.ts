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

export const calcGameWindowSize = (
  aspectRatio: number,
  unitWidth: number
): {
  width: number;
  height: number;
  scale: number;
} => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let width;
  let height;
  if (windowWidth * aspectRatio < windowHeight) {
    /* portrait */
    width = windowWidth;
    height = windowWidth * aspectRatio;
  } else {
    /* landscape */
    width = windowHeight / aspectRatio;
    height = windowHeight;
  }

  return { width, height, scale: width / unitWidth };
};

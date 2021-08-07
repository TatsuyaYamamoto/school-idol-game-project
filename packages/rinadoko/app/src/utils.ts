export const wait = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
};

export const createRandomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const generateShuffleData = (
  positions: number[],
  moveTime: number
): { x: number }[][] => {
  const data: { x: number }[][] = [];

  const candidateNumber = positions.length;

  Array.from(new Array(candidateNumber)).forEach(() => {
    data.push([]);
  });

  Array.from(new Array(moveTime)).forEach(() => {
    const positionIndexes = [0, 1, 2];

    Array.from(new Array(candidateNumber)).forEach((__, candidateIndex) => {
      const random = this.createRandomInteger(0, 3 - candidateIndex);
      const positionIndex = positionIndexes[random];
      positionIndexes.splice(random, 1);
      const x = positions[positionIndex];
      data[candidateIndex].push({
        x,
      });
    });
  });

  return data;
};

/**
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=ja
 */
export const sendEvent = (
  action: "pointerdown",
  {
    category,
    label,
    value,
  }: { category?: string; label?: string; value?: number }
): void => {
  const params: { [key: string]: string | number } = {};
  if (category) {
    params.event_category = category;
  }
  if (label) {
    params.event_label = label;
  }
  if (value) {
    params.value = value;
  }

  // eslint-disable-next-line
  // @ts-ignore
  gtag("event", action, params);
};

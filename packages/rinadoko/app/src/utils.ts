export const wait = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
};

export const createRandomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const generateShuffleData = (
  positions: number[],
  moveTime: number
): { x: number; duration: number }[][] => {
  const data: { x: number; duration: number }[][] = [];

  const candidateNumber = positions.length;
  const unitMoveTime = 0.5;

  Array.from(new Array(candidateNumber)).forEach((_, candidateIndex) => {
    data.push([]);
  });

  Array.from(new Array(moveTime)).forEach((_, moveIndex) => {
    const positionIndexes = [0, 1, 2];

    Array.from(new Array(candidateNumber)).forEach((_, candidateIndex) => {
      const random = this.createRandomInteger(0, 3 - candidateIndex);
      const positionIndex = positionIndexes[random];
      positionIndexes.splice(random, 1);
      const x = positions[positionIndex];
      data[candidateIndex].push({
        x,
        duration: unitMoveTime
      });
    });
  });

  return data;
};

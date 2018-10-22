/**
 * @fileOverview Store of state that app uses globally.
 * TODO: Probably, This functions are  bad solutions. Replace logic!
 */

/**
 * Game point.
 *
 * @type {number}
 */
let gamePoint: number = 0;

/**
 * Save game point.
 * @param point
 */
export function saveGamePoint(point: number): void {
  gamePoint = point;
}

/**
 * Get saved game point.
 */
export function getGamePoint(): number {
  return gamePoint;
}

/**
 * Clear saved game point.
 */
export function clearGamePoint(): void {
  gamePoint = 0;
}

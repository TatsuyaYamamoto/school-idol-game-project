/**
 * @fileOverview Calculation utilities.
 */

/**
 * Calculate sum.
 *
 * @param numbers
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((prev, current) => {
    return prev + current;
  });
}

/**
 * Calculate mean.
 *
 * @param numbers
 */
export function mean(numbers: number[]): number {
  return sum(numbers) / numbers.length;
}

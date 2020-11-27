/**
 * @fileOverview Calculation utilities.
 */

/**
 * Calculate sum.
 *
 * @param numbers
 */
export function sum(numbers: number[]) {
  return numbers.reduce(function (prev, current) {
    return prev + current;
  });
}

/**
 * Calculate mean.
 *
 * @param numbers
 */
export function mean(numbers: number[]) {
  return sum(numbers) / numbers.length;
}

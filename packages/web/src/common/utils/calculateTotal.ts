export function calculateTotal(numbers: number[], booleans: boolean[]): number {
  const sumOfNumbers = numbers.reduce((acc, num) => acc + num, 0);
  const sumOfBooleans = booleans.reduce((acc, bool) => acc + (bool ? 1 : 0), 0);

  const total = sumOfNumbers + sumOfBooleans;
  return total;
}

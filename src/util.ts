
export function sum(arr: number[]): number {
  return arr.reduce((sum, elm) => sum + elm, 0);
}

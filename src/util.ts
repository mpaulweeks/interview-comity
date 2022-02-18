
export function sum(arr: number[]): number {
  return arr.reduce((sum, elm) => sum + elm, 0);
}

function compare(a: string | number, b: string | number) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

function sortArrayInPlace<T>(arr: T[], cb: ((obj: T) => string | number)): void {
  arr.sort((a, b) => compare(cb(a), cb(b)));
}

export function sortArrayOfObjects<T>(arr: T[], cb: ((obj: T) => string | number)): T[] {
  const sorted = arr.concat();
  sortArrayInPlace(sorted, cb);
  return sorted;
}

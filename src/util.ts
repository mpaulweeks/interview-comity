
export function sum(arr: number[]): number {
  return arr.reduce((sum, elm) => sum + elm, 0);
}

function compare(a: string | number, b: string | number) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

function sortArrayInPlace<T>(arr: T[], cbs: ((obj: T) => string | number)[]): void {
  arr.sort((a, b) => {
    let order = 0;
    for (const toCompare of cbs) {
      order = compare(toCompare(a), toCompare(b));
      // if we get non-tie, exit early
      if (order !== 0) { return order; }
    }
    return order;
  });
}

export function sortArrayOfObjects<T>(arr: T[], cbs: ((obj: T) => string | number)[]): T[] {
  const sorted = arr.concat();
  sortArrayInPlace(sorted, cbs);
  return sorted;
}

export function rangeToArray(range: string) {
  const floors = range.split(',');
  let arr: number[] = [];
  for (let i = 0; i < floors.length; i++) {
    const item = floors[i];
    const floorArr: number[] = [];
    const [start, end] = item.split('-');
    if (end) {
      for (let j = +start; j <= +end; j++) {
        floorArr.push(j);
      }
    } else {
      if (start.includes('&')) {
        return [start];
      }
      floorArr.push(+start);
    }
    arr = arr.concat(floorArr);
  }
  return arr;
}

export function findLargest(arr: (string | number)[]): string | number {
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  if (Number(arr[0])) {
    return Math.max(...arr.map(Number));
  }
  let largest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i] === 'string' && typeof largest === 'string') {
      if ((arr[i] as string).localeCompare(largest) > 0) {
        largest = arr[i];
      }
    }
  }

  return largest;
}

export function findSmallest(arr: (string | number)[]): string | number {
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  if (Number(arr[0])) {
    return Math.min(...arr.map(Number));
  }

  let largest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i] === 'string' && typeof largest === 'string') {
      if ((arr[i] as string).localeCompare(largest) < 0) {
        largest = arr[i];
      }
    }
  }

  return largest;
}

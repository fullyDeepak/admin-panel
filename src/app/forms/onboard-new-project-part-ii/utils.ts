export function convertArrayToRangeString(arr: string[]) {
  const numbers = arr.map(Number).sort((a, b) => a - b);
  const result = [];
  let rangeStart = numbers[0];
  let rangeEnd = numbers[0];
  for (let i = 1; i <= numbers.length; i++) {
    if (numbers[i] === rangeEnd + 1) {
      rangeEnd = numbers[i];
    } else {
      if (rangeStart === rangeEnd) {
        result.push(`${rangeStart}`);
      } else {
        result.push(`${rangeStart === 0 ? 'G' : rangeStart}-${rangeEnd}`);
      }
      rangeStart = numbers[i];
      rangeEnd = numbers[i];
    }
  }
  return result.join(',');
}

// type Range = string | number;

function parseRange(rangeStr: string) {
  /** Parse a range string and return a list of integers or characters. */
  if (rangeStr.includes('-')) {
    const [start, end] = rangeStr.split('-');

    if (!isNaN(Number(start))) {
      const startNum = parseInt(start, 10);
      const endNum = parseInt(end, 10);
      return Array.from({ length: endNum - startNum + 1 }, (_, i) =>
        (startNum + i).toString()
      );
    } else if (start.match(/[a-zA-Z]/)) {
      const startCharCode = start.charCodeAt(0);
      const endCharCode = end.charCodeAt(0);
      return Array.from({ length: endCharCode - startCharCode + 1 }, (_, i) =>
        String.fromCharCode(startCharCode + i)
      );
    } else {
      return [];
    }
  } else {
    return [rangeStr];
  }
}

//  Parse a string that can have hyphens, commas, and semicolons. */
function parseCombinedString(combinedStr: string) {
  const parts = combinedStr.split(';');
  let combinedList: string[] = [];
  for (const part of parts) {
    const subParts = part.split(',');
    for (const subPart of subParts) {
      combinedList = combinedList.concat(parseRange(subPart));
    }
  }
  return combinedList;
}

export function generateTFU(
  towerStr: string,
  floorStr: string,
  unitStr: string
): {
  tfuMatchData: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  tfuCombinations: string[][];
} {
  /** Generate all possible combinations of Tower, Floor, and Unit. */
  const towerParts = towerStr.split(';');
  let floorParts = floorStr.split(';');
  const unitParts = unitStr.split(';');

  let tfuCombinations = [];
  // const combinations: { [key: string]: string[][] } = {};
  const tfuMatchData: {
    [key: string]: {
      [key: string]: string[];
    };
  } = {};

  if (floorParts.length === 1) {
    floorParts = new Array(towerParts.length).fill(floorParts[0]);
  }

  for (let i = 0; i < towerParts.length; i++) {
    const tower = towerParts[i];
    const floors = floorParts[i];
    const units = unitParts[i];
    const towerList = parseCombinedString(tower);
    const floorList = parseCombinedString(floors);
    const unitList = parseCombinedString(units);

    for (const floor of floorList) {
      for (const towerItem of towerList) {
        for (const unit of unitList) {
          tfuCombinations.push([towerItem, floor, unit]);
        }
      }
    }

    for (const towerItem of towerList) {
      let tempTower: {
        [key: string]: {
          [key: string]: string[];
        };
      } = { [towerItem]: {} };
      for (const floor of floorList) {
        if (tempTower[towerItem][floor] == undefined) {
          tempTower[towerItem][floor] = [];
        }
        for (const unit of unitList) {
          tempTower[towerItem][floor].push(unit);
        }
      }
      tfuMatchData[towerItem] = tempTower[towerItem];
    }
  }
  return { tfuMatchData, tfuCombinations };
}

import { maxBy } from 'lodash';
import { TowerFloorDataType } from './useImageFormStore';
import { produce } from 'immer';

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
  unitStr: string,
  towerFloorData: TowerFloorDataType[]
): {
  tfuMatchData: {
    [key: string]: {
      [key: string]: string[];
    };
  };
  tfuCombinations: string[][];
} {
  if (towerStr === 'ALL') {
    const towerIdList = towerFloorData.map((tfuData) => tfuData.towerId);
    towerStr = towerIdList.join(',');
  }
  if (floorStr === 'ALL') {
    const floorIdList: string[] = [];
    towerFloorData.map((tfuData) => {
      tfuData.floorsUnits.map((fuData) => {
        floorIdList.push(fuData.floorId.toString());
      });
    });
    floorStr = floorIdList.join(',');
  }
  if (unitStr === 'ALL') {
    let maxUnit = 0;
    towerFloorData.map((tfuData) => {
      tfuData.floorsUnits.map((fuData) => {
        const maxUnitNum = maxBy(
          fuData.units.map((u) => ({ ...u, unitNumber: +u.unitNumber })),
          'unitNumber'
        )?.unitNumber;
        if (maxUnitNum) {
          maxUnit = maxUnit < maxUnitNum ? maxUnitNum : maxUnit;
        }
      });
    });
    unitStr = `0-${maxUnit}`;
  }
  /** Generate all possible combinations of Tower, Floor, and Unit. */
  const towerParts = towerStr.split(';');
  let floorParts = floorStr.split(';');
  const unitParts = unitStr.split(';');

  const tfuCombinations = [];
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
      const tempTower: {
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
      if (tfuMatchData[towerItem] == undefined) {
        tfuMatchData[towerItem] = tempTower[towerItem];
      } else {
        const prevData = tfuMatchData[towerItem];
        const currentTowerData = tempTower[towerItem];
        const newTowerData = produce(prevData, (draft) => {
          Object.entries(currentTowerData).map(([floor, units]) => {
            if (prevData[floor] == undefined) {
              draft[floor] = units;
            } else {
              draft[floor].push(...units);
            }
          });
        });
        tfuMatchData[towerItem] = newTowerData;
      }
    }
  }
  return { tfuMatchData, tfuCombinations };
}

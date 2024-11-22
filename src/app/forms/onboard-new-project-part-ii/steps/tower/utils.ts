import { zip } from 'lodash';
import { UnitGridItem } from './UnitGrid';
import { UnitCardType } from '../../useTowerUnitStore';

function rangeToArray(range: string) {
  const floors = range.split(',');
  let arr: number[] = [];
  floors.forEach((item) => {
    const floorArr: number[] = [];
    const [start, end] = item.split('-');
    if (end) {
      for (let i = +start; i <= +end; i++) {
        floorArr.push(i);
      }
    } else {
      floorArr.push(+start);
    }
    arr = arr.concat(floorArr);
  });
  return arr;
}

export function subGridGenerator(cardData: UnitCardType) {
  const subGrid: Record<string, UnitGridItem[]> = {};
  const towerFloorNosArr = cardData.floorNos.split(';');
  const unitNosArr = cardData.unitNos.split(';');
  zip(towerFloorNosArr, unitNosArr).map(([towerFloorNos, unitNo]) => {
    if (!towerFloorNos || !unitNo) return;
    const towerFloors = rangeToArray(towerFloorNos);
    const units = rangeToArray(unitNo);
    towerFloors.map((towerFloor) => {
      if (!subGrid[towerFloor]) {
        subGrid[towerFloor] = [];
      }
      units.map((unit) => {
        subGrid[towerFloor].push({
          floor: towerFloor,
          floorLabel: towerFloor.toString(),
          unitNumber: unit,
          unitLabel: unit.toString(),
          config: cardData.configName || 'N/A',
          salableArea: cardData.salableArea,
          extent: cardData.extent,
          facing: cardData.facing || 'N/A',
          unitFloorCount: cardData.unitFloorCount
            ? +cardData.unitFloorCount
            : 1,
          unitType: cardData.id.toString(),
        });
      });
    });
  });
  console.log(subGrid);
  return subGrid;
}

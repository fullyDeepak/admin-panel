import { alphaToVal, valToAlpha } from '@/lib/utils';
import { TowerUnitDetailType, UnitCardType } from '../../useTowerUnitStore';
import { UnitGridItem } from './UnitGrid';
import { rangeToArray } from './utils';
import { zip } from 'lodash';

type Props = {
  towerData: TowerUnitDetailType;
  setGrid: (data: Record<string, UnitGridItem[]>) => void;
  setMaxUnitCount: (num: number) => void;
};

function generateCell(floor: number, unit: number): UnitGridItem {
  return {
    floor: floor,
    floorLabel: floor.toString(),
    unitNumber: unit,
    unitLabel: unit.toString(),
    isValid: true,
    notAvailable: false,
    isHorizontallyMerged: false,
    isVerticallyMerged: false,
  };
}

export function subGridGenerator(cardData: UnitCardType, gfName: string) {
  const subGrid: Record<string, UnitGridItem[]> = {};
  const towerFloorNosArr = cardData.floorNos.split(';');
  const unitNosArr = cardData.unitNos.split(';');
  zip(towerFloorNosArr, unitNosArr).map(([towerFloorNos, unitNo]) => {
    if (!towerFloorNos || !unitNo) return;
    const towerFloors = rangeToArray(towerFloorNos);
    console.log({ towerFloors });

    towerFloors.map((towerFloor) => {
      const isHorizontallyMerged = unitNo.includes('&');
      const isVerticallyMerged = towerFloor.toString()?.includes('&');
      const towerFloorInt = parseInt(towerFloor.toString());
      if (!subGrid[towerFloor]) {
        subGrid[towerFloor] = [];
      }
      if (!subGrid[towerFloorInt + 1]) {
        subGrid[towerFloorInt + 1] = [];
      }
      if (isVerticallyMerged) {
        subGrid[towerFloorInt + 1].push({
          floor: towerFloorInt,
          floorLabel: towerFloor.toString(),
          unitNumber: parseInt(unitNo),
          unitLabel: unitNo,
          config: cardData.configName || 'N/A',
          salableArea: cardData.salableArea,
          extent: cardData.extent,
          facing: cardData.facing || 'N/A',
          unitFloorCount: cardData.unitFloorCount
            ? +cardData.unitFloorCount
            : 1,
          unitType: cardData.id.toString(),
          isHorizontallyMerged,
          isVerticallyMerged,
        });
      } else {
        subGrid[towerFloor].push({
          floor: towerFloorInt,
          floorLabel: +towerFloor === 0 ? gfName : towerFloor.toString(),
          unitNumber: parseInt(unitNo) || alphaToVal(unitNo),
          unitLabel: unitNo,
          config: cardData.configName || 'N/A',
          salableArea: cardData.salableArea,
          extent: cardData.extent,
          facing: cardData.facing || 'N/A',
          unitFloorCount: cardData.unitFloorCount
            ? +cardData.unitFloorCount
            : 1,
          unitType: cardData.id.toString(),
          isHorizontallyMerged,
          isVerticallyMerged,
        });
      }
    });
  });
  return subGrid;
}

export function baseGridGenerator({
  towerData,
  setGrid,
  setMaxUnitCount,
}: Props) {
  const isVilla = towerData.towerType === 'VILLA' ? true : false;
  const maxFloor = +towerData.maxFloor || 0;
  let typicalMinUN = towerData.typicalMinUN;
  let typicalMaxUN = towerData.typicalMaxUN;
  let gfUnitMinUN = towerData.gfUnitMinUN;
  let gfUnitMaxUN = towerData.gfUnitMaxUN;
  let maxUnitCount = 0;
  const gfName = towerData.gfName.toUpperCase();
  const localGrid: Record<string, UnitGridItem[]> = {};

  if (
    (Boolean(
      Number(typicalMinUN || 'EMPTY') === 0 || Number(typicalMinUN || 'EMPTY')
    ) &&
      Boolean(Number(typicalMaxUN || 'EMPTY'))) ||
    (Boolean(
      Number(gfUnitMinUN || 'EMPTY') === 0 || Number(gfUnitMinUN || 'EMPTY')
    ) &&
      Boolean(Number(gfUnitMaxUN || 'EMPTY')))
  ) {
    const typicalUnitCount =
      +typicalMaxUN -
      (Number(typicalMinUN) === 0 ? -1 : Number(typicalMinUN) - 1);
    const gfUnitCount =
      +gfUnitMaxUN - (Number(gfUnitMinUN) === 0 ? -1 : Number(gfUnitMinUN) - 1);

    maxUnitCount = Math.max(gfUnitCount, typicalUnitCount);
    let minFloor = 1;
    if (gfName && gfUnitMaxUN && gfUnitMinUN) {
      minFloor = 0;
    }
    setMaxUnitCount(maxUnitCount);
    if (isVilla) {
      setMaxUnitCount(10);
    }
    for (let flr = maxFloor; flr >= minFloor; flr--) {
      const floorUnits: UnitGridItem[] = [];
      if (flr === 0 && gfUnitCount) {
        for (let un = 0; un < maxUnitCount; un++) {
          if (
            typicalUnitCount > gfUnitCount &&
            un + +gfUnitMinUN > +gfUnitMaxUN
          ) {
            floorUnits.push({
              ...generateCell(flr, un + +gfUnitMinUN),
              notAvailable: true,
            });
            continue;
          }
          floorUnits.push({
            ...generateCell(flr, un + +gfUnitMinUN),
            floorLabel: gfName,
          });
        }
        localGrid[flr] = floorUnits;
        continue;
      }
      if (maxFloor && !isVilla) {
        for (let un = 0; un < maxUnitCount; un++) {
          if (
            typicalUnitCount < gfUnitCount &&
            un + +typicalMinUN > +typicalMaxUN
          ) {
            floorUnits.push({
              ...generateCell(flr, un + +typicalMinUN),
              notAvailable: true,
            });
            continue;
          }
          floorUnits.push(generateCell(flr, un + +typicalMinUN));
        }
        localGrid[flr] = floorUnits;
      }
    }
  } else if (
    (typicalMinUN.length === 1 && typicalMaxUN.length === 1) ||
    (gfUnitMinUN.length === 1 && gfUnitMaxUN.length === 1)
  ) {
    // convert alphabet units to uppercase
    typicalMaxUN = typicalMaxUN.toUpperCase();
    typicalMinUN = typicalMinUN.toUpperCase();
    gfUnitMinUN = gfUnitMinUN.toUpperCase();
    gfUnitMaxUN = gfUnitMaxUN.toUpperCase();

    const typicalUnitCount =
      alphaToVal(typicalMaxUN) - (alphaToVal(typicalMinUN) - 1);
    const gfUnitCount = alphaToVal(gfUnitMaxUN) - (alphaToVal(gfUnitMinUN) - 1);
    maxUnitCount = Math.max(typicalUnitCount || 0, gfUnitCount || 0);
    let minFloor = 1;
    if (gfName && gfUnitMaxUN && gfUnitMinUN) {
      minFloor = 0;
    }
    setMaxUnitCount(maxUnitCount);
    for (let flr = maxFloor; flr >= minFloor; flr--) {
      const floorUnits: UnitGridItem[] = [];
      if (flr === 0 && gfUnitCount) {
        for (let un = 0; un < maxUnitCount; un++) {
          if (
            typicalUnitCount > gfUnitCount &&
            un + alphaToVal(gfUnitMinUN) > alphaToVal(gfUnitMaxUN)
          ) {
            floorUnits.push({
              ...generateCell(flr, un + +gfUnitMinUN),
              notAvailable: true,
            });
            continue;
          }
          floorUnits.push({
            ...generateCell(flr, un + alphaToVal(gfUnitMinUN)),
            unitLabel: valToAlpha(un + alphaToVal(gfUnitMinUN)),
            floorLabel: gfName,
          });
        }
        localGrid[flr] = floorUnits;
        continue;
      }
      if (maxFloor) {
        for (let un = 0; un < maxUnitCount; un++) {
          if (
            typicalUnitCount < gfUnitCount &&
            un + alphaToVal(typicalMinUN) > alphaToVal(typicalMaxUN)
          ) {
            floorUnits.push({
              ...generateCell(flr, un + +typicalMinUN),
              notAvailable: true,
            });
            continue;
          }
          floorUnits.push({
            ...generateCell(flr, un + alphaToVal(typicalMinUN)),
            unitLabel: valToAlpha(un + alphaToVal(typicalMinUN)),
          });
        }
        localGrid[flr] = floorUnits;
      }
    }
  }
  setGrid(localGrid);
  return localGrid;
}

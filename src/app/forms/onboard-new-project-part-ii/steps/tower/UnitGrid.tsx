import { useEffect, useState } from 'react';
import { TowerUnitDetailType } from '../../useTowerUnitStore';
import { subGridGenerator } from './utils';
import { produce } from 'immer';
import { cn, getRandomColor } from '@/lib/utils';

export type UnitGridItem = {
  unitType?: string;
  salableArea?: number;
  extent?: number;
  facing?: string;
  config?: string;
  floor: number;
  floorLabel?: string;
  unitNumber: number;
  unitLabel?: string;
  unitFloorCount?: number;
  color?: string;
  isDuplicate?: boolean;
  isUnitFPAvailable?: boolean;
  isHorizontallyMerged?: boolean;
  isVerticallyMerged?: boolean;
  isValid?: boolean;
};

type Props = {
  towerData: TowerUnitDetailType;
};

export default function UnitGrid({ towerData }: Props) {
  const [grid, setGrid] = useState<Record<string, UnitGridItem[]>>({});
  const [maxUnitCount, setMaxUnitCount] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  function generateGrid() {
    // const maxFloor = towerData.typicalMaxFloor;
    // const typicalUnitCount = +towerData.typicalUnitCount;
    // const gfUnitCount = towerData.gfUnitCount ? towerData.gfUnitCount : null;
    const maxFloor = 0;
    const typicalUnitCount = 0;
    const gfUnitCount = 0;
    const maxUnitCount = Math.max(
      typicalUnitCount,
      gfUnitCount ? +gfUnitCount : 0
    );
    let minFloor = 1;
    if (towerData.gfName && gfUnitCount) {
      minFloor = 0;
    }
    let localGrid: Record<string, UnitGridItem[]> = {};
    for (let i = maxFloor; i >= minFloor; i--) {
      const floorUnits: UnitGridItem[] = [];
      if (i === 0 && gfUnitCount) {
        for (let j = 1; j <= +gfUnitCount; j++) {
          floorUnits.push({
            floor: i,
            floorLabel: towerData.gfName,
            unitNumber: j,
            isValid: true,
            isHorizontallyMerged: false,
            isVerticallyMerged: false,
          });
        }
        localGrid[i] = floorUnits;
        continue;
      }
      for (let j = 1; j <= typicalUnitCount; j++) {
        floorUnits.push({
          floor: i,
          floorLabel: i.toString(),
          unitNumber: j,
          isValid: true,
          isHorizontallyMerged: false,
          isVerticallyMerged: false,
        });
      }
      localGrid[i] = floorUnits;
    }
    setMaxUnitCount(maxUnitCount);
    towerData.unitCards.map((card) => {
      const subGrid = subGridGenerator(card);
      localGrid = produce(localGrid, (draft) => {
        Object.entries(subGrid).map(([key, value]) => {
          draft[key]?.map((localGridItem, i) => {
            if (draft[key][i - 1]?.isHorizontallyMerged) {
              draft[key][i].isValid = false;
            }
            value.map((subGridItem) => {
              if (localGridItem.unitNumber === subGridItem.unitNumber) {
                if (subGridItem?.isVerticallyMerged) {
                  draft[`${+key - 1}`][i].isValid = false;
                }
                localGridItem.isDuplicate =
                  localGridItem.config ||
                  localGridItem.salableArea ||
                  localGridItem.facing ||
                  localGridItem.extent ||
                  localGridItem.color
                    ? true
                    : false;
                localGridItem.unitType = subGridItem.unitType;
                localGridItem.unitLabel = subGridItem.unitLabel;
                localGridItem.config = subGridItem.config;
                localGridItem.salableArea = subGridItem.salableArea;
                localGridItem.extent = subGridItem.extent;
                localGridItem.facing = subGridItem.facing;
                localGridItem.unitFloorCount = subGridItem.unitFloorCount;
                localGridItem.color = getRandomColor(card.id, 40);
                localGridItem.isUnitFPAvailable = card.unitFloorPlanFile
                  ? true
                  : false;
                localGridItem.isHorizontallyMerged =
                  subGridItem.isHorizontallyMerged;
                localGridItem.isVerticallyMerged =
                  subGridItem.isVerticallyMerged;
                localGridItem.floorLabel = subGridItem.floorLabel;
              }
            });
          });
        });
      });
    });
    console.log(localGrid);
    setGrid(localGrid);
  }

  useEffect(() => {
    if (showGrid) {
      generateGrid();
    }
  }, [showGrid]);
  return (
    <div className='flex flex-col'>
      <label className='btn btn-warning mt-2 max-w-fit self-center'>
        {showGrid ? 'Hide' : 'Show'} Grid
        <input
          hidden
          onChange={(e) => setShowGrid(e.target.checked)}
          checked={showGrid}
          type='checkbox'
        />
      </label>
      {showGrid && (
        <div className='my-5 flex w-full max-w-[90vw] overflow-auto'>
          {grid && Object.entries(grid).length > 0 && (
            <div
              className='mx-auto grid gap-2 p-2'
              style={{
                gridTemplateColumns: `repeat(${maxUnitCount}, minmax(80px, 1fr))`,
              }}
            >
              {Object.entries(grid)
                .sort((a, b) => +b[0] - +a[0])
                .map(([_flr, units], i) =>
                  units.map(
                    (unit, j) =>
                      unit.isValid && (
                        <div
                          key={`${i}-${j}`}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-md p-2',
                            unit.isDuplicate
                              ? 'animate-bounce duration-700'
                              : 'animate-none',
                            unit.color && `text-white`,
                            unit.isHorizontallyMerged && 'col-span-2',
                            unit.isVerticallyMerged && 'row-span-2'
                          )}
                          style={{
                            background: unit.color
                              ? unit.isUnitFPAvailable
                                ? unit.color
                                : `linear-gradient(35deg, ${unit.color} 80%, #52525b 20%)`
                              : '#e4e4e7',
                          }}
                        >
                          <span>{`${unit.floorLabel}-${unit.unitLabel || unit.unitNumber}`}</span>
                          <span className='text-[8px] leading-none'>
                            {`${unit.config || 'N/A'}-${unit.salableArea || 'N/A'}-${unit.facing || 'N/A'}`}
                          </span>
                        </div>
                      )
                  )
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

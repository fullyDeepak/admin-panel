import { useState } from 'react';
import { TowerUnitDetailType } from '../../useTowerUnitStore';
import { subGridGenerator } from './grid-generator';
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
};

type Props = {
  towerData: TowerUnitDetailType;
};

export default function UnitGrid({ towerData }: Props) {
  const [grid, setGrid] = useState<Record<string, UnitGridItem[]>>({});
  const [maxUnitCount, setMaxUnitCount] = useState<number>(0);

  function generateGrid() {
    const maxFloor = towerData.typicalMaxFloor;
    const typicalUnitCount = +towerData.typicalUnitCount;
    const gfUnitCount = towerData.gfUnitCount ? towerData.gfUnitCount : null;
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
          });
        }
        localGrid[i] = floorUnits;
        continue;
      }
      for (let j = 1; j <= typicalUnitCount; j++) {
        floorUnits.push({ floor: i, floorLabel: i.toString(), unitNumber: j });
      }
      localGrid[i] = floorUnits;
    }
    setMaxUnitCount(maxUnitCount);
    towerData.unitCards.map((card) => {
      const subGrid = subGridGenerator(card);
      localGrid = produce(localGrid, (draft) => {
        Object.entries(subGrid).map(([key, value]) => {
          draft[key]?.map((item) => {
            if (item.unitNumber === value[0].unitNumber) {
              item.isDuplicate =
                item.config ||
                item.salableArea ||
                item.facing ||
                item.extent ||
                item.color
                  ? true
                  : false;
              item.unitType = value[0].unitType;
              item.config = value[0].config;
              item.salableArea = value[0].salableArea;
              item.extent = value[0].extent;
              item.facing = value[0].facing;
              item.unitFloorCount = value[0].unitFloorCount;
              item.color = getRandomColor(card.id);
            }
          });
        });
      });
    });

    console.log(localGrid);
    setGrid(localGrid);
  }
  return (
    <div className='flex flex-col'>
      <button
        className='btn btn-warning mt-2 max-w-fit self-center'
        onClick={generateGrid}
      >
        Generate Grid
      </button>
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
                units.map((unit, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={cn(
                      'flex w-20 flex-col items-center justify-center rounded-md p-2',
                      unit.isDuplicate
                        ? 'animate-bounce duration-700'
                        : 'animate-none'
                    )}
                    style={{
                      backgroundColor: unit.color || '#e4e4e4',
                    }}
                  >
                    <span>{`${unit.floorLabel}-${unit.unitNumber}`}</span>
                    <span className='text-[8px] leading-none'>
                      {`${unit.config || 'N/A'}-${unit.salableArea || 'N/A'}-${unit.facing || 'N/A'}`}
                    </span>
                  </div>
                ))
              )}
          </div>
        )}
      </div>
    </div>
  );
}

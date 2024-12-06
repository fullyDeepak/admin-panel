import { useEffect, useState } from 'react';
import { TowerUnitDetailType } from '../../useTowerUnitStore';
import { produce } from 'immer';
import { cn, getRezyColors } from '@/lib/utils';
import { baseGridGenerator, subGridGenerator } from './gridGenerator';
import { useProjectDataStore } from '../../useProjectDataStore';

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
  notAvailable?: boolean;
};

type Props = {
  towerData: TowerUnitDetailType;
};

export default function UnitGrid({ towerData }: Props) {
  const [grid, setGrid] = useState<Record<string, UnitGridItem[]>>({});
  const [maxUnitCount, setMaxUnitCount] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const { gridValue, updateGridValue } = useProjectDataStore((state) => ({
    gridValue: state.randomGridValue,
    updateGridValue: state.updateRandomGridValue,
  }));

  function generateGrid() {
    let localGrid = baseGridGenerator({ setGrid, setMaxUnitCount, towerData });
    towerData.unitCards.map((card) => {
      // const _isAlpha =
      //   isCharacterALetter(towerData.gfUnitMinUN) &&
      //   isCharacterALetter(towerData.gfUnitMaxUN) &&
      //   isCharacterALetter(towerData.typicalMinUN) &&
      //   isCharacterALetter(towerData.typicalMaxUN);
      const subGrid = subGridGenerator(card, towerData.gfName);
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
                localGridItem.color = getRezyColors(card.id);
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
    setGrid(localGrid);
  }

  useEffect(() => {
    if (showGrid) {
      generateGrid();
    }
  }, [showGrid]);

  useEffect(() => {
    if (gridValue == towerData.tower_id) {
      generateGrid();
      setShowGrid(true);
      document
        .getElementById('unit-grid-' + towerData.tower_id)
        ?.scrollIntoView({ behavior: 'smooth' });
      updateGridValue(0);
    }
  }, [gridValue]);
  return (
    <div className='flex flex-col' id={'unit-grid-' + towerData.tower_id}>
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
              className='mx-auto grid gap-2 p-2 duration-300 animate-in slide-in-from-top'
              style={{
                gridTemplateColumns: `repeat(${maxUnitCount}, minmax(90px, 1fr))`,
              }}
            >
              {Object.entries(grid)
                .sort((a, b) => +b[0] - +a[0])
                .map(([_flr, units], i) =>
                  units.map((unit, j) =>
                    unit.notAvailable ? (
                      <div key={`${i}-${j}`}></div>
                    ) : (
                      unit.isValid && (
                        <button
                          onClick={() =>
                            document
                              .getElementById(
                                `unit-type-card-${towerData.tower_id}-${unit.unitType}`
                              )
                              ?.scrollIntoView({ behavior: 'smooth' })
                          }
                          key={`${i}-${j}`}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-md p-2',
                            unit.isDuplicate
                              ? 'animate-bounce duration-700'
                              : 'animate-none',
                            unit.color && `text-white`,
                            unit.isHorizontallyMerged && 'col-span-2',
                            unit.isVerticallyMerged && 'row-span-2',
                            unit?.unitType && +unit?.unitType <= 8
                              ? 'text-black'
                              : null
                          )}
                          style={{
                            background: unit.color
                              ? unit.isUnitFPAvailable
                                ? unit.color
                                : `linear-gradient(35deg, ${unit.color} 80%, #52525b 20%)`
                              : '#e4e4e7',
                          }}
                        >
                          <span className='text-base'>{`${unit.floorLabel}-${unit.unitLabel || unit.unitNumber}`}</span>
                          {towerData.towerType === 'APARTMENT' ? (
                            <span className='text-[10px] leading-none'>
                              {`${unit.config || 'N/A'}-${unit.salableArea || 'N/A'}-${unit.facing || 'N/A'}`}
                            </span>
                          ) : (
                            <span className='text-[10px] leading-none'>
                              {`${unit.salableArea || 'N/A'}-${unit.extent || 'N/A'}-${unit.facing || 'N/A'}`}
                            </span>
                          )}
                        </button>
                      )
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

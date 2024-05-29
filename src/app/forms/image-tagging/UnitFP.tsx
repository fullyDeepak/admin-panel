import { nanoid } from 'nanoid';
import { produce } from 'immer';
import { TowerFloorDataType } from './page';
import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react';
import { HiOutlineSelector } from 'react-icons/hi';
import Select, { SingleValue } from 'react-select';
import { MultiSelect } from 'react-multi-select-component';
import { BiPlus } from 'react-icons/bi';

type UnitFPProps = {
  towerFloorData: TowerFloorDataType[];
  setTowerFloorFormData: Dispatch<SetStateAction<TowerFloorDataType[] | []>>;
  towerFloorFormData: TowerFloorDataType[];
};

export default function UnitFP({
  towerFloorData,
  setTowerFloorFormData,
  towerFloorFormData,
}: UnitFPProps) {
  const towerOptions = towerFloorData.map((item) => ({
    value: item.towerId,
    label: `${item.towerId}: ${item.towerName}`,
  }));
  const [selectedTowerFloorData, setSelectedTowerFloorData] = useState<
    TowerFloorDataType[]
  >([]);
  const [selectedTower, setSelectedTower] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  return (
    <div className='tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(0,60,255,0.5)]'>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[3] text-xl'>Select Towers:</span>
        <MultiSelect
          className='w-full flex-[5]'
          labelledBy='select-tower'
          value={selectedTower}
          key={'projectOptions'}
          options={towerOptions}
          onChange={(
            e: {
              label: string;
              value: number;
            }[]
          ) => {
            setSelectedTower(e);
            const tempData: TowerFloorDataType[] = [];
            towerFloorData?.map((item) => {
              let option: {
                label: string;
                value: number;
              } = {
                value: item.towerId,
                label: `${item.towerId}: ${item.towerName}`,
              };
              if (
                e.some(
                  (ele) => ele.label === option.label && ele.value === ele.value
                )
              ) {
                tempData.push(item);
              }
            });
            setSelectedTowerFloorData(tempData);
          }}
        />
      </div>
      {selectedTowerFloorData?.map((tower, towerIndex) => (
        <div
          className='my-5 rounded-2xl border-4 p-5'
          key={nanoid()}
          id={nanoid()}
        >
          <p className='flex justify-evenly text-center font-semibold'>
            <span>Tower ID: {tower.towerId}</span>{' '}
            <span>Tower Name: {tower.towerName}</span>
            <span>Tower Type: {tower.towerType}</span>
          </p>
          <div className='relative flex flex-col justify-between gap-2 overflow-x-auto p-5'>
            {tower.floorsUnits?.slice(0, 1).map((floorUnits, index) => (
              <div
                key={nanoid()}
                className='flex flex-row items-start gap-2 tabular-nums'
              >
                {floorUnits.units.map((unit_name, towerIndex) => (
                  <button
                    key={nanoid()}
                    className='btn btn-error btn-xs min-w-32 rounded-full text-white'
                    onClick={() => {
                      console.log(`clicked ${towerIndex}`);
                      setTowerFloorFormData(
                        produce((draft) => {
                          const towerData = draft?.find(
                            (towerFloorData) =>
                              towerFloorData.towerId === tower.towerId
                          );
                          towerData?.floorsUnits.map((item) => {
                            item.selectedUnits.push(item.units[towerIndex]);
                          });
                        })
                      );
                    }}
                    type='button'
                  >
                    <HiOutlineSelector size={25} />
                  </button>
                ))}
              </div>
            ))}
            {tower.floorsUnits?.map((floorUnits, floorsUnitsIndex) => (
              <div
                key={nanoid()}
                className='flex flex-row items-start gap-2 tabular-nums'
              >
                {floorUnits.units.map((unitName, unitNameIndex) => (
                  <label key={nanoid()} className='swap'>
                    <input
                      type='checkbox'
                      key={nanoid()}
                      checked={Boolean(
                        towerFloorFormData[towerIndex]?.floorsUnits[
                          floorsUnitsIndex
                        ]?.selectedUnits.includes(unitName)
                      )}
                      onChange={(e) => {
                        console.log(
                          towerFloorFormData[towerIndex]?.floorsUnits[
                            floorsUnitsIndex
                          ],
                          { checked: e.target.checked }
                        );
                        setTowerFloorFormData(
                          produce((draft) => {
                            const towerData = draft?.find(
                              (towerFloorData) =>
                                towerFloorData.towerId === tower.towerId
                            );
                            const floorUnitsData = towerData?.floorsUnits.find(
                              (flrUnit) =>
                                flrUnit.floorId === floorUnits.floorId
                            );
                            console.log(
                              'if avail->',
                              floorUnitsData?.selectedUnits.includes(unitName),
                              unitName,
                              floorUnitsData?.selectedUnits.indexOf(unitName)
                            );
                            if (
                              floorUnitsData?.selectedUnits.includes(unitName)
                            ) {
                              const unitNameIndex =
                                floorUnitsData?.selectedUnits.indexOf(unitName);
                              floorUnitsData?.selectedUnits?.splice(
                                unitNameIndex,
                                1
                              );
                            } else {
                              floorUnitsData?.selectedUnits.push(unitName);
                            }
                          })
                        );
                      }}
                    />
                    <p
                      key={nanoid()}
                      className='swap-on min-w-32 rounded-full border bg-green-200 px-4 py-2 text-center text-sm'
                    >
                      {floorUnits.floorId}-{unitName}
                    </p>
                    <p
                      key={nanoid()}
                      className='swap-off min-w-32 rounded-full border px-4 py-2 text-center text-sm'
                    >
                      {floorUnits.floorId}-{unitName}
                    </p>
                  </label>
                ))}
              </div>
            ))}
          </div>
          {/* <pre className='max-h-60 resize-none overflow-y-auto bg-slate-100 p-5 font-mono text-sm'>
            {JSON.stringify(selectedUnits, null, 2)}
        </pre> */}
        </div>
      ))}
      <label className='relative flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[3] text-xl'>Select File:</span>
        <input
          type='file'
          className='file-input file-input-bordered flex-[5]'
        />
      </label>
      <button
        className='btn btn-warning max-w-32 rounded-full text-white'
        type='button'
        //   onClick={() => {
        //     const tempSelectedUnits: {
        //       floorId: number;
        //       selectedUnits: string[];
        //     }[] = [];
        //     towerFloorFormData[towerIndex].floorsUnits.map((ele) => {
        //       let temp: {
        //         floorId: number;
        //         selectedUnits: string[];
        //       } = { floorId: ele.floorId, selectedUnits: [] };
        //       ele.selectedUnits.map((unit) => {
        //         temp.selectedUnits.push(unit);
        //       });
        //       temp.selectedUnits.length > 0
        //         ? tempSelectedUnits.push(temp)
        //         : null;
        //     });
        //     console.log(tempSelectedUnits);
        //     //   setSelectedUnits(tempSelectedUnits);
        //     towerFloorFormData[towerIndex].floorsUnits.map(
        //       (ele) => ele.selectedUnits
        //     );
        //   }}
      >
        Preview
      </button>
      <div className='absolute -bottom-6 -left-5 z-10 w-full '>
        <button
          type='button'
          className='btn btn-md mx-auto flex items-center border-none bg-rose-300 hover:bg-rose-400 '
          onClick={() => alert('')}
        >
          <BiPlus size={30} /> <span>Add New</span>
        </button>
      </div>
    </div>
  );
}

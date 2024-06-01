import { nanoid } from 'nanoid';
import { TowerFloorDataType } from './page';
import { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { BiPlus } from 'react-icons/bi';
import { MdNotInterested, MdSelectAll } from 'react-icons/md';
import UnitCell from './UnitCell';
import { SetSelectedUnitProps } from '@/store/useImageFormStore';

type UnitFPProps = {
  towerFloorData: TowerFloorDataType[];
  setSelectedUnit: (payload: SetSelectedUnitProps) => void;
  towerFloorFormData: TowerFloorDataType[];
};

export default function UnitFP({
  towerFloorData,
  setSelectedUnit,
  towerFloorFormData,
}: UnitFPProps) {
  console.log('UnitFP.tsx re-renders...');
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
        <div className='my-5 rounded-2xl border-4 p-5' key={towerIndex}>
          <p className='flex justify-evenly text-center font-semibold'>
            <span>Tower ID: {tower.towerId}</span>{' '}
            <span>Tower Name: {tower.towerName}</span>
            <span>Tower Type: {tower.towerType}</span>
          </p>
          <div className='relative flex flex-col justify-between gap-2 overflow-x-auto p-5'>
            {tower.floorsUnits?.slice(0, 1).map((floorUnits) => (
              <div
                key={nanoid()}
                className='flex flex-row items-start gap-2 tabular-nums'
              >
                {floorUnits.units.map((_, unitIndex) => (
                  <div
                    className='flex w-full min-w-32 justify-around'
                    key={nanoid()}
                  >
                    <button
                      key={nanoid()}
                      className='btn btn-xs min-w-12 rounded-full border-none bg-green-300 hover:bg-green-400'
                      onClick={() => {
                        setSelectedUnit({
                          towerId: tower.towerId,
                          floorId: floorUnits.floorId,
                          unitName: unitIndex,
                          selectColumn: true,
                          unitType: towerIndex,
                        });
                      }}
                      type='button'
                    >
                      <MdSelectAll size={25} />
                    </button>
                    <button
                      key={nanoid()}
                      className='btn btn-xs min-w-12 rounded-full border-none bg-red-200 hover:bg-red-300'
                      onClick={() => {
                        setSelectedUnit({
                          towerId: tower.towerId,
                          floorId: floorUnits.floorId,
                          unitName: unitIndex,
                          selectColumn: false,
                          unitType: towerIndex,
                        });
                      }}
                      type='button'
                    >
                      <MdNotInterested size={25} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
            {tower.floorsUnits?.map((floorUnits) => (
              <div
                key={nanoid()}
                className={`flex  ${tower.towerType === 'Villa' ? 'flex-col' : 'flex-row'} items-start gap-2 tabular-nums`}
              >
                {floorUnits.units.map((unitName, unitNameIndex) => (
                  <UnitCell
                    towerId={tower.towerId}
                    unitName={unitName}
                    unitType={towerIndex}
                    key={unitNameIndex}
                  />
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
      <div className='absolute -bottom-6 -left-5 w-full '>
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

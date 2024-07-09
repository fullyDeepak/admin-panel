import { inputBoxClass } from '@/app/constants/tw-class';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TowerFloorDataType } from './useImageFormStore';
import { produce } from 'immer';
import { getRandomColor } from '@/lib/utils';
import UnitCell from './UnitCell';

type UnitFPProps = {
  towerFloorData: TowerFloorDataType[];
  setTowerFloorData: (newData: TowerFloorDataType[]) => void;
};

export default function UnitFP({
  towerFloorData,
  setTowerFloorData,
}: UnitFPProps) {
  const [fileInputEleCount, setFileInputEleCount] = useState<number | null>(
    null
  );
  const [showFileInputs, setShowFileInputs] = useState(false);
  function generateTFU(str: string) {
    let listOfStr: string[] = [];
    str.split(',').map((item) => {
      if (item.includes('-')) {
        const [start, stop] = item.split('-');
        for (let i = parseInt(start); i <= parseInt(stop); i++) {
          listOfStr.push(i.toString());
        }
      } else {
        listOfStr = listOfStr.concat(item.split('-'));
      }
    });
    return listOfStr;
  }
  function handleFileChange(filename: string, unitType: number) {
    const pattern: RegExp =
      /^\[(?<towers>[\d,-]+)\]-\[(?<floors>[\d,-]+)\]-\[(?<units>[\d,-]+)\]/gm;
    const match = pattern.exec(filename);
    let towerList: string[] = [];
    let floorList: string[] = [];
    let unitList: string[] = [];
    if (match && match.groups) {
      const towers = match.groups.towers;
      const floors = match.groups.floors;
      const units = match.groups.units;
      towerList = generateTFU(towers);
      floorList = generateTFU(floors);
      unitList = generateTFU(units);
      console.log({ towerList, floorList, unitList });
    }
    const color = getRandomColor(unitType);
    const newTowerFloorData = produce(towerFloorData, (draft) => {
      draft.forEach((tfuData) => {
        if (towerList.includes(tfuData.towerId.toString())) {
          tfuData.floorsUnits.forEach((fuData) => {
            if (floorList.includes(fuData.floorId.toString())) {
              fuData.units.forEach((unitItem) => {
                if (unitList.includes(unitItem.unitNumber)) {
                  unitItem.color = color;
                  unitItem.unitType = unitType.toString();
                }
              });
            }
          });
        }
      });
    });
    setTowerFloorData(newTowerFloorData);
    console.log({ newTowerFloorData });
  }
  return (
    <>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Count of distinct FP:</span>
        <input
          className={inputBoxClass}
          name='distinctUnitFPCount'
          disabled={showFileInputs}
          value={fileInputEleCount ? fileInputEleCount : ''}
          onChange={(e) => setFileInputEleCount(+e.target.value)}
          placeholder='Enter number only'
          type='number'
        />
      </label>
      {fileInputEleCount && (
        <div className='flex justify-between'>
          <button
            className='btn btn-warning mx-auto'
            type='button'
            onClick={() => {
              setShowFileInputs(true);
            }}
          >
            Show File Inputs
          </button>
          <button
            className='btn btn-warning mx-auto'
            type='button'
            onClick={() => {
              setShowFileInputs(false);
              setFileInputEleCount(null);
            }}
          >
            Reset
          </button>
        </div>
      )}
      {showFileInputs &&
        fileInputEleCount &&
        [...Array(fileInputEleCount).keys()].map((item) => (
          <label
            className='flex flex-wrap items-center justify-between gap-5'
            key={item}
          >
            <span className='flex-[3]'>
              File Input <span className='font-bold'>Type {item + 1}</span>:
            </span>
            <input
              className='file-input file-input-bordered flex-[5]'
              placeholder='Enter number only'
              type='file'
              id={`unitFPFileInput-${item}`}
              onChange={(e) => {
                if (e && e.target.files && e.target.files.length > 0) {
                  console.log(e.target.files[0].name);
                  handleFileChange(e.target.files[0].name, item + 1);
                }
              }}
            />
          </label>
        ))}
      {towerFloorData &&
        towerFloorData?.map((tower, towerIndex) => (
          <div className='my-5 rounded-2xl border-4 p-5' key={towerIndex}>
            <p className='flex justify-evenly text-center font-semibold'>
              <span>Tower ID: {tower.towerId}</span>{' '}
              <span>Tower Name: {tower.towerName}</span>
              <span>Tower Type: {tower.towerType}</span>
            </p>
            <div className='relative flex flex-col justify-between gap-2 overflow-x-auto p-5'>
              {tower.floorsUnits?.map((floorUnits) => (
                <div
                  key={nanoid()}
                  className={`flex ${tower.towerType === 'Villa' ? 'flex-col' : 'flex-row'} items-start gap-2 tabular-nums`}
                >
                  {floorUnits.units.map((unitItem, unitNameIndex) => (
                    <UnitCell
                      towerId={tower.towerId}
                      fullUnitName={unitItem.fullUnitName}
                      unitNumber={unitItem.unitNumber}
                      unitType={unitItem.unitType ? +unitItem.unitType : null}
                      key={unitNameIndex}
                      color={unitItem.color}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}

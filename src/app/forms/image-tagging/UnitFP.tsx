import { inputBoxClass } from '@/app/constants/tw-class';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TowerFloorDataType, useImageFormStore } from './useImageFormStore';
import { produce } from 'immer';
import { getRandomColor } from '@/lib/utils';
import UnitCell from './UnitCell';
import { generateTFU } from './matcher';
import { range } from 'lodash';

type UnitFPProps = {
  towerFloorData: TowerFloorDataType[];
  setTowerFloorData: (_newData: TowerFloorDataType[]) => void;
};

export default function UnitFP({
  towerFloorData,
  setTowerFloorData,
}: UnitFPProps) {
  const [fileInputEleCount, setFileInputEleCount] = useState<number | null>(
    null
  );
  const [showFileInputs, setShowFileInputs] = useState(false);
  const { setUnitFPDataStore } = useImageFormStore();

  // whenever file input receive a file
  function handleFileChange(filename: string, unitType: number) {
    const pattern: RegExp =
      /^\[(?<towers>[\d,;-]+)\]-\[(?<floors>[\d,;-]+)\]-\[(?<units>[\dA-Z;,-]+)\]/gm;
    const match = pattern.exec(filename);
    let generatedData: {
      tfuMatchData: {
        [key: string]: {
          [key: string]: string[];
        };
      };
      tfuCombinations: string[][];
    };
    let tfuMatchData: {
      [key: string]: {
        [key: string]: string[];
      };
    } = {};
    if (match && match.groups) {
      const towers = match.groups.towers;
      const floors = match.groups.floors;
      const units = match.groups.units;
      generatedData = generateTFU(towers, floors, units);
      tfuMatchData = generatedData.tfuMatchData;
      setUnitFPDataStore(unitType.toString(), generatedData.tfuCombinations);
    }
    const color = getRandomColor(unitType);
    const newTowerFloorData = produce(towerFloorData, (draft) => {
      draft.forEach((tfuData) => {
        const fuComb = tfuMatchData[tfuData.towerId.toString()];
        if (fuComb) {
          tfuData.floorsUnits.forEach((element) => {
            if (element.floorId in fuComb) {
              const unitComb = fuComb[element.floorId];
              element.units.forEach((item) => {
                if (unitComb.includes(item.unitNumber)) {
                  item.color = color;
                  item.unitType = unitType.toString();
                }
              });
            }
          });
        }
      });
    });
    setTowerFloorData(newTowerFloorData);
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
      {!!fileInputEleCount && (
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
        range(0, fileInputEleCount).map((item) => (
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
              name={`unitType-${item + 1}`}
              id={`unitFPFileInput-${item + 1}`}
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
                      floorNumber={floorUnits.floorId}
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

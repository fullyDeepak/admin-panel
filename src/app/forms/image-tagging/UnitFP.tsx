import { nanoid } from 'nanoid';
import { TowerFloorDataType, useImageFormStore } from './useImageFormStore';
import { produce } from 'immer';
import UnitCell from './UnitCell';
import { generateTFU } from './matcher';
import { useEffect } from 'react';
import PreviewUnitDocs from './PreviewUnitDocs';
import { isEqual, uniqWith } from 'lodash';
import SimpleTable from '@/components/tables/SimpleTable';

type UnitFPProps = {
  towerFloorData: TowerFloorDataType[];
  setTowerFloorData: (_newData: TowerFloorDataType[]) => void;
};

export default function UnitFP({
  towerFloorData,
  setTowerFloorData,
}: UnitFPProps) {
  const {
    setUnitFPDataStore,
    previewUnitDocsData,
    setPreviewUnitDocsData,
    setShowUnitModal,
    showUnitModal,
    unitFpTableData,
  } = useImageFormStore();

  useEffect(() => {
    if (showUnitModal === true) {
      (
        document.getElementById('unit-preview-modal') as HTMLDialogElement
      ).showModal();
    }
  }, [showUnitModal]);

  // whenever file input receive a file
  function handleFileChange(files: FileList) {
    let unitType = 0;
    if (unitFpTableData && unitFpTableData.length > 0) {
      const maxUnitType = Math.max(
        ...unitFpTableData.map((item) => +item.unit_type)
      );
      unitType = maxUnitType;
    }
    let newTowerFloorData = [...towerFloorData];
    for (const file of files) {
      unitType++;
      const pattern: RegExp =
        /^\[(?<towers>[\d,;\-ALL]+)\]-\[(?<floors>[\d,;\-ALL]+)\]-\[(?<units>[\d,;\-A-Z]+)\]/gm;
      const match = pattern.exec(file.name);
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
        let towers = match.groups.towers;
        let floors = match.groups.floors;
        let units = match.groups.units;
        generatedData = generateTFU(towers, floors, units, towerFloorData);
        tfuMatchData = generatedData.tfuMatchData;
        setUnitFPDataStore(
          file.name,
          uniqWith(generatedData.tfuCombinations, isEqual),
          unitType.toString()
        );
      } else {
        alert(`Invalid file name pattern: ${file.name}`);
        const fileInput = document.getElementById(
          'unitFPFileInput'
        ) as HTMLInputElement;
        fileInput.value = '';
      }
      newTowerFloorData = produce(newTowerFloorData, (draft) => {
        draft.forEach((tfuData) => {
          const fuComb = tfuMatchData[tfuData.towerId.toString()];
          if (fuComb) {
            tfuData.floorsUnits.forEach((element) => {
              if (element.floorId in fuComb) {
                const unitComb = fuComb[element.floorId];
                element.units.forEach((item) => {
                  if (unitComb.includes(item.unitNumber)) {
                    item.unitType = unitType.toString();
                  }
                });
              }
            });
          }
        });
      });
    }
    setTowerFloorData(newTowerFloorData);
  }

  function getTotalUnitCount(data: TowerFloorDataType['floorsUnits']) {
    let count = 0;
    data.map((flUnit) => {
      count += flUnit.units.length;
    });
    return count;
  }

  function getTaggedUnitCount(data: TowerFloorDataType['floorsUnits']) {
    let count = 0;
    data.map((flUnit) => {
      flUnit.units.map((unitItem) => {
        if (unitItem.unitType) {
          count++;
        }
      });
    });
    return count;
  }
  return (
    <>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>File Input:</span>
        <input
          className='file-input file-input-bordered flex-[5]'
          placeholder='Enter number only'
          type='file'
          multiple
          accept='image/*'
          name={`unit-floor-plan`}
          id={`unitFPFileInput`}
          onChange={(e) => {
            if (e && e.target.files && e.target.files.length > 0) {
              handleFileChange(e.target.files);
            }
          }}
        />
      </label>

      {unitFpTableData && unitFpTableData.length > 0 && (
        <div className='mx-auto w-full'>
          <h3 className='text-center text-2xl font-semibold'>Available Data</h3>
          <SimpleTable
            columns={['Unit Type', 'AWS S3 Path']}
            tableData={uniqWith(
              unitFpTableData.map((item) => [
                item.unit_type.toString(),
                item.s3_path,
              ]),
              isEqual
            )}
          />
        </div>
      )}

      {towerFloorData &&
        towerFloorData?.map((tower, towerIndex) => (
          <div className='my-5 rounded-2xl border-4 p-5' key={towerIndex}>
            <div className='flex w-full flex-col gap-2'>
              <p className='flex justify-evenly text-center font-semibold'>
                <span>Tower ID: {tower.towerId}</span>{' '}
                <span>Tower Name: {tower.towerName}</span>
                <span>Tower Type: {tower.towerType}</span>
              </p>
              <p className='flex justify-evenly text-center font-semibold'>
                <span>
                  Total Unit Count: {getTotalUnitCount(tower.floorsUnits)}
                </span>{' '}
                <span>
                  Tagged Unit Count: {getTaggedUnitCount(tower.floorsUnits)}
                </span>
              </p>
            </div>
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
                      previewURL={unitItem.preview_url || ''}
                      s3Path={unitItem.s3_path || ''}
                      setPreviewUnitDocsData={setPreviewUnitDocsData}
                      setShowUnitModal={setShowUnitModal}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      {previewUnitDocsData && (
        <PreviewUnitDocs
          previewDocsData={previewUnitDocsData}
          setShowModal={setShowUnitModal}
          showModal
        />
      )}
    </>
  );
}

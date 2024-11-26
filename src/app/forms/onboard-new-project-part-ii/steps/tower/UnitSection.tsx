import { cn, getRezyColors } from '@/lib/utils';
import { BiCopy, BiPlus } from 'react-icons/bi';
import {
  TowerUnitDetailType,
  UnitCardType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import UnitFileList from '../image/UnitFileList';
import UnitImageSelector from '../image/UnitImageSelector';
import ReraNExistingDropdown from '../unit/ReraNExistingDropdown';
import FacingCornerUnitFC from '../unit/FacingCornerUnitFC';
import TowerFlNosUnitNos from '../unit/TowerFlNosUnitNos';
import ConfigVerifyDoorOverride from '../unit/ConfigVerifyDoorOverride';
import SalableParkingExtent from '../unit/SalableParkingExtent';
import PreviewImage from '@/components/ui/PreviewImage';
import { IMAGE_PATH_PREFIX } from '@/data/CONSTANTS';
import { RefreshCcw } from 'lucide-react';
import { useProjectDataStore } from '../../useProjectDataStore';

type Props = {
  towerData: TowerUnitDetailType;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
};

export default function UnitSection({
  towerData,
  updateUnitCard,
  copyUnitCard,
  addNewUnitCard,
  deleteUnitCard,
}: Props) {
  const {
    existingUnitTypeOption,
    setShowTMRefTable,
    showTMRefTable,
    towerFormData,
  } = useTowerUnitStore((state) => ({
    existingUnitTypeOption: state.existingUnitTypeOption,
    setShowTMRefTable: state.setShowTMRefTable,
    showTMRefTable: state.showTMRefTable,
    towerFormData: state.towerFormData,
  }));

  const { updateRandomGridValue } = useProjectDataStore((state) => ({
    updateRandomGridValue: state.updateRandomGridValue,
  }));

  return (
    <div>
      <div className='-mb-5 flex items-center gap-5'>
        <h2 className='text-xl font-semibold'>Section: Unit Card</h2>
        <button
          className='btn btn-accent btn-xs'
          onClick={() => {
            setShowTMRefTable(!showTMRefTable);
            console.log({ towerFormData });
          }}
        >
          Toggle TM Ref Table
        </button>
        <UnitImageSelector
          towerData={towerData}
          updateUnitCard={updateUnitCard}
        />
      </div>
      {towerData.unitCards && towerData.unitCards.length > 0 ? (
        towerData.unitCards.map((unitData) => (
          <div
            className='relative my-10 space-y-1 rounded-lg bg-amber-50 p-5 pb-10 text-sm shadow-[0px_0px_3px_2px_#b7791f]'
            key={unitData.id}
            id={`unit-type-card-${towerData.tower_id}-${unitData.id}`}
          >
            <span
              className='absolute top-4 size-8 rounded-full'
              style={{ backgroundColor: getRezyColors(unitData.id) }}
            ></span>
            <p className='text-center font-semibold'>
              Tower Card id: {towerData.tower_id} &nbsp; &nbsp; &nbsp; &nbsp;
              Unit Type Card id: {unitData.id}
            </p>
            <button
              className='absolute right-2 top-0 m-2 size-8 rounded-full text-sm font-semibold hover:bg-gray-300'
              type='button'
              onClick={() => {
                if (confirm('Are you sure?')) {
                  deleteUnitCard(towerData.tower_id, unitData.id);
                }
              }}
            >
              ✕
            </button>

            <div className='grid grid-cols-2 gap-x-5 gap-y-1'>
              <ReraNExistingDropdown
                existingUnitTypeOption={existingUnitTypeOption}
                towerData={towerData}
                updateUnitCard={updateUnitCard}
                unitData={unitData}
                towerFormData={towerFormData}
              />
              <SalableParkingExtent
                updateUnitCard={updateUnitCard}
                unitData={unitData}
                towerId={towerData.tower_id}
              />
              <FacingCornerUnitFC
                updateUnitCard={updateUnitCard}
                unitData={unitData}
                towerId={towerData.tower_id}
                towerType={towerData.towerType}
              />
              <ConfigVerifyDoorOverride
                updateUnitCard={updateUnitCard}
                unitData={unitData}
                towerId={towerData.tower_id}
              />
              <TowerFlNosUnitNos
                updateUnitCard={updateUnitCard}
                unitData={unitData}
                towerId={towerData.tower_id}
              />
              <div className='flex flex-wrap items-center justify-between gap-5'>
                <span className='flex-[3]'>Unit Floor Plan:</span>
                <div className='-ml-2.5 flex flex-[8] items-center gap-2'>
                  <input
                    type='file'
                    className='file-input file-input-bordered file-input-xs ml-2 h-8'
                    id='project-other-docs-file'
                    accept='image/*'
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        Array.from(e.target.files).forEach((file) => {
                          updateUnitCard(towerData.tower_id, unitData.id, {
                            unitFloorPlanFile: {
                              name: file.name,
                              file: file,
                            },
                          });
                        });
                      }
                    }}
                  />
                </div>
              </div>
              {unitData.s3_path && unitData.s3_path.length > 5 && (
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-fuchsia-600'>
                    Available Unit Floor Plans:
                  </span>
                  <PreviewImage
                    url={IMAGE_PATH_PREFIX + unitData.s3_path}
                    customModalSuffix={`${towerData.tower_id}-${unitData.id}-${unitData.salableArea}-${unitData.extent}`}
                  />
                </div>
              )}
            </div>
            <UnitFileList
              image={unitData.unitFloorPlanFile}
              towerId={towerData.tower_id}
              unitId={unitData.id}
              updateUnitCard={updateUnitCard}
              customModalSuffix={`${towerData.tower_id}-${unitData.id}-${unitData.salableArea}-${unitData.extent}`}
            />
            <div className='absolute -bottom-4 -left-0 z-[0] flex w-full items-center'>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-amber-400 hover:bg-amber-500'
                onClick={() =>
                  copyUnitCard(towerData.tower_id, {
                    ...unitData,
                    id: unitData.id + 1,
                  })
                }
              >
                <BiCopy size={24} />
                <span>Copy</span>
              </button>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-lime-500 hover:bg-lime-600'
                onClick={() => updateRandomGridValue(towerData.tower_id)}
              >
                <RefreshCcw size={22} />
                <span>Refresh Grid</span>
              </button>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-amber-400 hover:bg-amber-500'
                onClick={() => addNewUnitCard(towerData.tower_id)}
              >
                <BiPlus size={30} />
                <span>New</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <button
            className={cn(
              'btn-rezy mt-10 text-white',
              '!bg-amber-500 hover:!bg-amber-600'
            )}
            onClick={() => addNewUnitCard(towerData.tower_id)}
          >
            Add Unit Card
          </button>
        </div>
      )}
    </div>
  );
}

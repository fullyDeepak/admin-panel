import Select, { SingleValue } from 'react-select';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { TowerUnitDetailType, UnitCardType } from '../../useTowerUnitStore';

type Props = {
  towerFormData: TowerUnitDetailType[];
  towerData: TowerUnitDetailType;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  unitData: UnitCardType;
  existingUnitTypeOption: SingleValue<{
    label: string;
    value: string;
  }>[];
};

export default function ReraNExistingDropdown({
  towerData,
  updateUnitCard,
  unitData,
  existingUnitTypeOption,
  towerFormData,
}: Props) {
  return (
    <>
      {towerData.reraUnitTypeOption &&
        towerData.reraUnitTypeOption.length > 0 && (
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[3]'>Rera Unit Type:</span>
            <div className='flex flex-[8]'>
              <Select
                className='-ml-0.5 w-full flex-1'
                instanceId={nanoid()}
                options={towerData.reraUnitTypeOption}
                defaultValue={unitData.reraUnitType}
                onChange={(e) =>
                  updateUnitCard(towerData.tower_id, unitData.id, {
                    reraUnitType: e,
                  })
                }
              />
            </div>
          </label>
        )}
      <label
        className={cn(
          'flex flex-wrap items-center justify-between gap-5',
          towerData.reraUnitTypeOption?.length === 0 && 'col-span-2'
        )}
      >
        <span className='flex-[2'>Existing Unit Type:</span>
        <div
          className={cn(
            'flex flex-[5]',
            towerData.reraUnitTypeOption?.length === 0 && 'ml-4 w-full'
          )}
        >
          <Select
            className='w-full flex-1'
            instanceId={nanoid()}
            options={existingUnitTypeOption}
            value={null}
            onChange={(e) => {
              if (e) {
                const [exTowerId, exUnitId] = e.value.split(':').map(Number);

                const existingCard = towerFormData
                  .find((item) => item.tower_id === exTowerId)
                  ?.unitCards.find((item) => item.id === exUnitId);

                updateUnitCard(towerData.tower_id, unitData.id, {
                  salableArea: existingCard?.salableArea,
                  parking: existingCard?.parking,
                  extent: existingCard?.extent,
                  facing: existingCard?.facing,
                  corner: existingCard?.corner,
                  unitFloorCount: existingCard?.unitFloorCount,
                  configName: existingCard?.configName,
                  toiletConfig: existingCard?.toiletConfig,
                  otherConfig: existingCard?.otherConfig,
                  configVerified: existingCard?.configVerified,
                  doorNoOverride: existingCard?.doorNoOverride,
                  floorNos: existingCard?.floorNos,
                  unitNos: existingCard?.unitNos,
                  tmUnitType: existingCard?.tmUnitType,
                  reraUnitType: existingCard?.reraUnitType,
                });
              }
            }}
          />
        </div>
      </label>
    </>
  );
}

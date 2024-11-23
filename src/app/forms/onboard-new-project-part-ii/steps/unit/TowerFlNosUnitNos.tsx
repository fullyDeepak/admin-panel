import { inputBoxClass } from '@/app/constants/tw-class';
import { UnitCardType } from '../../useTowerUnitStore';

type Props = {
  unitData: UnitCardType;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  towerId: number;
};

export default function TowerFlNosUnitNos({
  towerId,
  unitData,
  updateUnitCard,
}: Props) {
  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Tower Floor Nos:</span>
        <div className='-ml-0.5 flex flex-[8] items-center gap-2'>
          <input
            className={`${inputBoxClass} !ml-0`}
            defaultValue={unitData.floorNos}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                floorNos: e.target.value,
              })
            }
            placeholder='Enter floor nos'
          />
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Unit Nos:</span>
        <div className='flex flex-[5]'>
          <input
            className={`${inputBoxClass} !ml-0`}
            defaultValue={unitData.unitNos}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                unitNos: e.target.value,
              })
            }
            placeholder='Enter unit nos'
          />
        </div>
      </div>
    </>
  );
}

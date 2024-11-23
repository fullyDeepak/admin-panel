import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
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

export default function SalableParkingExtent({
  unitData,
  updateUnitCard,
  towerId,
}: Props) {
  return (
    <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Salable Area:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            placeholder='Value'
            type='number'
            className={cn(inputBoxClass, 'ml-0')}
            defaultValue={unitData.salableArea || ''}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                salableArea: +e.target.value,
              })
            }
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Parking:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            placeholder='Value'
            type='number'
            className={cn(inputBoxClass, 'ml-0')}
            defaultValue={unitData.parking || ''}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                parking: +e.target.value,
              })
            }
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Extent:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            placeholder='Value'
            type='number'
            className={cn(inputBoxClass, 'ml-0')}
            defaultValue={unitData.extent || ''}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                extent: +e.target.value,
              })
            }
          />
        </div>
      </label>
    </div>
  );
}

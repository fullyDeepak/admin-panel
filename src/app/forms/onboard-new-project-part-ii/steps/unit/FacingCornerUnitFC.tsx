import { cn } from '@/lib/utils';
import { UnitCardType } from '../../useTowerUnitStore';
import { TbMapEast, TbMapNorth, TbMapSouth, TbMapWest } from 'react-icons/tb';
import { CornerIcon } from '../tower/CornerIcon';

type Props = {
  unitData: UnitCardType;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  towerId: number;
  towerType: string;
};

export default function FacingCornerUnitFC({
  towerId,
  unitData,
  updateUnitCard,
  towerType,
}: Props) {
  return (
    <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Facing:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <label
            className={cn(
              'tooltip flex cursor-pointer items-center gap-2 rounded border-2 p-1',
              unitData.facing === 'N' &&
                'border-amber-800 bg-amber-600 text-white'
            )}
            data-tip='North'
          >
            <input
              type='checkbox'
              name='facing'
              className='hidden'
              checked={unitData.facing === 'N'}
              onChange={(e) => {
                if (e.target.checked) {
                  updateUnitCard(towerId, unitData.id, {
                    facing: 'N',
                  });
                } else {
                  updateUnitCard(towerId, unitData.id, {
                    facing: null,
                  });
                }
              }}
            />
            <TbMapNorth size={30} strokeWidth={1.3} />
          </label>
          <label
            className={cn(
              'tooltip tooltip-bottom flex cursor-pointer items-center gap-2 rounded border-2 p-1',
              unitData.facing === 'S' &&
                'border-amber-800 bg-amber-600 text-white'
            )}
            data-tip='South'
          >
            <input
              type='checkbox'
              name='facing'
              className='hidden'
              checked={unitData.facing === 'S'}
              onChange={(e) => {
                if (e.target.checked) {
                  updateUnitCard(towerId, unitData.id, {
                    facing: 'S',
                  });
                } else {
                  updateUnitCard(towerId, unitData.id, {
                    facing: null,
                  });
                }
              }}
            />
            <TbMapSouth size={30} strokeWidth={1.3} />
          </label>
          <label
            className={cn(
              'tooltip tooltip-right flex cursor-pointer items-center gap-2 rounded border-2 p-1',
              unitData.facing === 'E' &&
                'border-amber-800 bg-amber-600 text-white'
            )}
            data-tip='East'
          >
            <input
              type='checkbox'
              name='facing'
              className='hidden'
              checked={unitData.facing === 'E'}
              onChange={(e) => {
                if (e.target.checked) {
                  updateUnitCard(towerId, unitData.id, {
                    facing: 'E',
                  });
                } else {
                  updateUnitCard(towerId, unitData.id, {
                    facing: null,
                  });
                }
              }}
            />
            <TbMapEast size={30} strokeWidth={1.3} />
          </label>
          <label
            className={cn(
              'tooltip tooltip-left flex cursor-pointer items-center gap-2 rounded border-2 p-1',
              unitData.facing === 'W' &&
                'border-amber-800 bg-amber-600 text-white'
            )}
            data-tip='West'
          >
            <input
              type='checkbox'
              name='facing'
              className='hidden'
              checked={unitData.facing === 'W'}
              onChange={(e) => {
                if (e.target.checked) {
                  updateUnitCard(towerId, unitData.id, {
                    facing: 'W',
                  });
                } else {
                  updateUnitCard(towerId, unitData.id, {
                    facing: null,
                  });
                }
              }}
            />
            <TbMapWest size={30} strokeWidth={1.3} />
          </label>
        </div>
      </div>
      <div className='flex flex-[2] flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Corner:</span>
        <div className='flex flex-[5]'>
          <div className='flex items-center gap-2'>
            <label
              className={cn(
                'tooltip flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                unitData.corner && 'border-amber-800 bg-amber-600 text-white'
              )}
              data-tip='Corner flag'
            >
              <input
                type='checkbox'
                name='corner'
                className='hidden'
                defaultChecked={unitData.corner}
                onChange={(e) =>
                  updateUnitCard(towerId, unitData.id, {
                    corner: e.target.checked,
                  })
                }
              />
              <CornerIcon className='size-6' />
            </label>
          </div>
        </div>
      </div>
      <div className='flex flex-[3] flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Unit Floor Count:</span>
        <div className='w-full flex-[5]'>
          <select
            className='h-9 min-h-9 w-full flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none !pe-1 !pl-1 !pr-5 ps-3 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
            value={unitData.unitFloorCount || undefined}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                unitFloorCount: e.target.value,
              })
            }
          >
            <option disabled selected>
              Unit Floor
            </option>
            {towerType === 'APARTMENT' &&
              ['Simplex', 'Duplex', 'Triplex'].map((item, idx) => (
                <option value={idx + 1} key={idx}>
                  {item}
                </option>
              ))}
            {towerType === 'VILLA' &&
              ['G+1', 'G+2', 'G+3'].map((item, idx) => (
                <option value={idx + 1} key={idx}>
                  {item}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}

import { inputBoxClass } from '@/app/constants/tw-class';
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
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

export default function ConfigVerifyDoorOverride({
  towerId,
  unitData,
  updateUnitCard,
}: Props) {
  return (
    <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
      <div className='flex items-center gap-2'>
        <span className='flex-[3]'>Config:</span>
        <div className='ml-3 flex w-full flex-[5] items-center gap-2'>
          <select
            className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
            value={unitData.configName || undefined}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                configName: e.target.value,
              })
            }
          >
            <option disabled selected>
              Bed
            </option>
            {[
              'Studio',
              'LOBBY',
              '1BHK',
              '2BHK',
              '2.5BHK',
              '3BHK',
              '3.5BHK',
              '4BHK',
              '5BHK+',
            ].map((item, idx) => (
              <option value={item} key={idx}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
            value={unitData.toiletConfig || undefined}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                toiletConfig: e.target.value,
              })
            }
          >
            <option disabled selected>
              Toilet
            </option>
            {['1T', '2T', '3T', '3T+'].map((item, idx) => (
              <option value={item} key={idx}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
            value={unitData.otherConfig || undefined}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                otherConfig: e.target.value,
              })
            }
          >
            <option disabled selected>
              Other
            </option>
            {['Maid', 'Study', 'HT'].map((item, idx) => (
              <option value={item} key={idx}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <span className='flex-[3]'>Verify:</span>
        <div className='ml-2 flex-[5]'>
          <label className='swap swap-flip'>
            <input
              type='checkbox'
              checked={unitData.configVerified}
              className='hidden'
              onChange={(e) =>
                updateUnitCard(towerId, unitData.id, {
                  configVerified: e.target.checked,
                })
              }
            />
            <span className='swap-on tooltip' data-tip='Configuration Verified'>
              <ShieldCheck className='size-8 text-green-600' />
            </span>
            <span
              className='swap-off tooltip'
              data-tip='Configuration NotVerified'
            >
              <ShieldQuestion className='size-8 text-red-600' />
            </span>
          </label>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Door No Override:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            className={`${inputBoxClass} !ml-0`}
            defaultValue={unitData.doorNoOverride}
            onChange={(e) =>
              updateUnitCard(towerId, unitData.id, {
                doorNoOverride: e.target.value,
              })
            }
            placeholder='Enter New Door No'
          />
        </div>
      </div>
    </div>
  );
}

import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function HMPopUpForm() {
  const [formState, setFormState] = useState({
    locality: '',
    doorNo: '',
    ownerName: '',
    ownerNameFlag: true,
    doorNoFlag: true,
    localityFlag: true,
  });
  return (
    <div className='max-w-screen-2xl'>
      <h3 className='pb-5 text-center text-xl font-semibold'>
        Popup Form: HM Search + Fill
      </h3>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Locality:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Locality'
            type='text'
            value={formState['locality']}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                locality: e.target.value,
              }))
            }
          />
          <label
            className={cn(
              'swap swap-flip rounded p-1 font-semibold'
              // formState['localityFlag'] ? 'bg-green-200' : 'bg-red-200'
            )}
          >
            <input
              type='checkbox'
              checked={formState['localityFlag']}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  localityFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Door No:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Door No'
            type='text'
            value={formState['doorNo']}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                doorNo: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState['doorNoFlag']}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  doorNoFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Owner Name:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Owner Name'
            type='text'
            value={formState['ownerName']}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                ownerName: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState['ownerNameFlag']}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  ownerNameFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <button className='btn btn-neutral btn-sm max-w-fit self-center'>
          Search HM
        </button>
      </div>
    </div>
  );
}

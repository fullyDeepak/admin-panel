import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function TMPopUpForm() {
  const [formState, setFormState] = useState({
    docId: '',
    docIdFlag: true,
    villageFlag: true,
    projectIdFlag: true,
    linkedDocFlag: true,
    counterPartyFlag: true,
    village: '',
    projectId: '',
    counterParty: '',
    linkedDoc: '',
  });

  return (
    <div className='max-w-screen-2xl'>
      <h3 className='pb-5 text-center text-xl font-semibold'>
        Popup Form: TM Search + Fill
      </h3>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Doc Id:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Doc Id'
            type='text'
            value={formState.docId}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                docId: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.docIdFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  docIdFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Village:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Village'
            type='text'
            value={formState.village}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                village: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.villageFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  villageFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Project Id:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Project Id'
            type='text'
            value={formState.projectId}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                projectId: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.projectIdFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  projectIdFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Counter Party:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Counter Party'
            type='text'
            value={formState.counterParty}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                counterParty: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.counterPartyFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  counterPartyFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Linked Doc:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Linked Doc'
            type='text'
            value={formState.linkedDoc}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                linkedDoc: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.linkedDocFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  linkedDocFlag: e.target.checked,
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

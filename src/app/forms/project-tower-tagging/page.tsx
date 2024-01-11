'use client';

import { useState } from 'react';
import Select from 'react-select';

export default function page() {
  const inputBoxClass =
    'w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: Project Tower Tagging</h1>
      <form className='mt-5 flex w-full max-w-[80%] flex-col gap-4 self-center rounded p-10 text-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>State:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>District:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Mandal:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Village:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Apartment Name:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Layout Name:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Rera ID:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Developer:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Developer Group:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Type:</span>
          <Select
            className='w-full flex-[5]'
            options={[
              { label: 'Residential', value: '1' },
              { label: 'Commercial', value: 2 },
              { label: 'Mixed', value: 3 },
            ]}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Sub-Type:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Sub-Type 2:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Status:</span>
          <Select
            className='w-full flex-[5]'
            options={[
              { label: 'Operational', value: '1' },
              { label: 'Under Construction', value: 2 },
              { label: 'Planned', value: 3 },
            ]}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Pre RERA:</span>
          <span className='flex flex-[5] items-center justify-between gap-5'>
            <span
              className={`badge badge-lg font-bold text-white ${
                switchValue ? 'badge-success' : 'badge-error'
              }`}
            >
              Switch is {switchValue ? 'ON' : 'OFF'}
            </span>
            <input
              type='checkbox'
              name=''
              id=''
              className='toggle toggle-success'
              checked={switchValue}
              onChange={() => setSwitchValue(!switchValue)}
            />
          </span>
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Brief:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Number of Units:</span>
          <input type='number' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Size(Built-up):</span>
          <input type='number' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Avg. Floorplate(In sqft.):</span>
          <input type='number' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Avg. Floor Height:</span>
          <input type='number' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Layout Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Tower Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Floor Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Year Completed:</span>
          <input
            type='month'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Micromarket:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Land Area(In acres):</span>
          <input type='number' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Amenities Tags:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Specification:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>New in db:</span>
          <span className='flex flex-[5] items-center justify-between gap-5'>
            <span
              className={`badge badge-lg font-bold text-white ${
                switchValue ? 'badge-success' : 'badge-error'
              }`}
            >
              Switch is {switchValue ? 'ON' : 'OFF'}
            </span>
            <input
              type='checkbox'
              name=''
              id=''
              className='toggle toggle-success'
              checked={switchValue}
              onChange={() => setSwitchValue(!switchValue)}
            />
          </span>
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Survey Equals:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Survey Contains:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Plot Equals:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Apartment Contains:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Counterparty Contains:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Towers:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Towers Coordinates:</span>
          <input type='text' className={inputBoxClass} />
        </label>
        <p className='text-xl font-semibold'>Tower Configuration:</p>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2]'></span>
            <div className='flex min-w-min items-center justify-center gap-5'>
              <span>Min Area (sft)</span>
              <span>Max Area (sft)</span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>Studio</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>1 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>1.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>2 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>2.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>3 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>3.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>4 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>5 BHK and above</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='text'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
              <input
                type='text'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
              />
            </div>
          </div>
        </div>
        <button className='btn btn-info w-full self-center text-white'>
          Update
        </button>
      </form>
      <span className='mt-96'></span>
    </div>
  );
}

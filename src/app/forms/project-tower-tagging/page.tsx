'use client';

import { useState } from 'react';
import Select from 'react-select';

export default function page() {
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: Project Tower Tagging</h1>
      <form className='mt-5 flex w-full max-w-[80%] flex-col gap-4 self-center rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>State:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>District:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Mandal:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Village:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Apartment Name:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Layout Name:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Rera ID:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Developer:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Project Type:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Project Sub-Type:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-lg'>Project Sub-Type 2:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Enabled:</span>
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
        <button className='btn btn-info w-full self-center text-white'>
          Update
        </button>
      </form>
    </div>
  );
}

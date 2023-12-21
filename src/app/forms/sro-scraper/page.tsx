'use client';
import React, { useState } from 'react';
import Select from 'react-select';

export default function page() {
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: SRO Scraper</h1>
      <form className='mt-5 flex w-full max-w-[70%] flex-col gap-4 self-center rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>State:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>SRO Code:</span>
          <Select className='w-full flex-[5]' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>SRO Name:</span>
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

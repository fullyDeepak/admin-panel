'use client';

import React from 'react';
import Select from 'react-select';
import { Toaster } from 'react-hot-toast';
import { formatISO } from 'date-fns';

export default function ReraProjectStatusPage() {
  const inputBoxClass =
    'flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';
  const asiaCurrentDate = formatISO(
    new Date().toLocaleString('en-Us', {
      timeZone: 'Asia/Kolkata',
    }),
    { representation: 'date' }
  );

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>
        Form: Onboarded Project Status Update form
      </h1>
      <Toaster />
      <div className='flex justify-start gap-5'>
        <form className='mx-auto my-5 mb-20 flex w-3/4 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Updated at:</span>
            <p className={inputBoxClass}>{asiaCurrentDate}</p>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Project ID:</span>
            <p className={inputBoxClass}>123</p>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Tower ID:</span>
            <p className={inputBoxClass}>123</p>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Overall Percentage:</span>
            <p className={inputBoxClass}>123</p>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>RERA Progress:</span>
            <p className={inputBoxClass}>123</p>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Registration Start?:</span>
            <div className='flex-[5]'>
              <input type='checkbox' className='toggle' />
            </div>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>First Reg Date:</span>
            <input className={inputBoxClass} name='firstRegDate' />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Display Status:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              isClearable
              options={[
                { label: 'Pre-RERA', value: 'pre-rera' },
                { label: 'Recent Launch', value: 'recent-launch' },
                { label: 'Under Construction', value: 'under-construction' },
                { label: 'Advanced Construction', value: 'adv-construction' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3] text-xl'>Quoted Price(sq.ft.):</span>
            <input className={inputBoxClass} name='reraProgress' />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3]'>Current Booking Ratio RERA:</span>
            <input className={inputBoxClass} name='reraProgress' />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[3]'>Current Booking Ratio Display:</span>
            <input className={inputBoxClass} name='reraProgress' />
          </label>
        </form>
      </div>
    </div>
  );
}

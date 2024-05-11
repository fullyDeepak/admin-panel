'use client';

import Select from 'react-select';
import { formatISO } from 'date-fns';
import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';

export default function ProjectStatus() {
  const asiaCurrentDate = formatISO(
    new Date().toLocaleString('en-Us', {
      timeZone: 'Asia/Kolkata',
    }),
    { representation: 'date' }
  );

  const { projectFormDataRera } = useProjectStoreRera();
  const { towerFormDataRera } = useTowerStoreRera();

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>
        Section: Project Status(WIP)
      </h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[3] text-xl'>Updated at:</span>
        <p className={inputBoxClass}>{asiaCurrentDate}</p>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[3] text-xl'>Project ID:</span>
        <p className={`${inputBoxClass} h-11`}>
          {projectFormDataRera.projectIds.join('||')}
        </p>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[3] text-xl'>Tower ID:</span>
        <p className={`${inputBoxClass} h-11`}>
          {towerFormDataRera.map((item) => item.reraTowerId).join(',')}
        </p>
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
    </>
  );
}

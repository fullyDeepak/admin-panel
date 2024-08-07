'use client';

import Select from 'react-select';
import { formatISO } from 'date-fns';
import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStoreRera } from './useProjectStoreRera';
import { useTowerStoreRera } from './useTowerStoreRera';
import { MultiSelect } from 'react-multi-select-component';

export default function ProjectStatus() {
  const asiaCurrentDate = formatISO(
    new Date().toLocaleString('en-Us', {
      timeZone: 'Asia/Kolkata',
    }),
    { representation: 'date' }
  );

  const { projectFormDataRera, updateProjectFormDataRera } =
    useProjectStoreRera();
  const { towerFormDataRera } = useTowerStoreRera();
  const towerOptions = towerFormDataRera.map((item) => ({
    label: `${item.id}:${item.etlTowerName}`,
    value: item.id,
  }));
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Status</h3>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Updated at:</span>
        <p className={inputBoxClass}>{asiaCurrentDate}</p>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Tower ID:</span>
        <MultiSelect
          options={towerOptions}
          className='w-full flex-[5]'
          labelledBy='status-tower-id-dropdown'
          value={projectFormDataRera.selectedProjectStatusTowers}
          onChange={(
            e: {
              label: string;
              value: number;
            }[]
          ) => {
            updateProjectFormDataRera({ selectedProjectStatusTowers: e });
          }}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Overall Percentage:</span>
        <p className={inputBoxClass}>123</p>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>RERA Progress:</span>
        <p className={inputBoxClass}>123</p>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Registration Start?:</span>
        <div className='flex-[5]'>
          <input type='checkbox' className='toggle' />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>First Reg Date:</span>
        <input className={inputBoxClass} name='firstRegDate' />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
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
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Quoted Price(sq.ft.):</span>
        <input className={inputBoxClass} name='reraProgress' />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Current Booking Ratio RERA:</span>
        <input className={inputBoxClass} name='reraProgress' />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Current Booking Ratio Display:</span>
        <input className={inputBoxClass} name='reraProgress' />
      </label>
    </>
  );
}

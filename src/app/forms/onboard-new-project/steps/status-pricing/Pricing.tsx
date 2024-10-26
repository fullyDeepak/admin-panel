import { inputBoxClass } from '@/app/constants/tw-class';
import { cn, getCurrentDate } from '@/lib/utils';
import { MultiSelect } from 'react-multi-select-component';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { RiCloseLine } from 'react-icons/ri';
import { useState } from 'react';
import { handleProjectStatusSave } from './utils';

type Props = {
  towerOptions: {
    label: string;
    value: number;
  }[];
};

export default function Pricing({ towerOptions }: Props) {
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [value, setValue] = useState('');
  const [selectedProjectStatusTowers, setSelectedProjectStatusTowers] =
    useState<
      {
        label: string;
        value: number;
      }[]
    >([]);

  const { projectPricingStatus, deleteProjectStatusData } = useTowerUnitStore();
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='my-4 text-2xl font-semibold'>Section: Pricing</h3>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Updated at:</span>
        <p className={cn(inputBoxClass, 'ml-2')}>{getCurrentDate()}</p>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Tower IDs:</span>
        <MultiSelect
          options={towerOptions}
          className='w-full flex-[5]'
          labelledBy='status-tower-id-dropdown'
          value={selectedProjectStatusTowers}
          onChange={(
            e: {
              label: string;
              value: number;
            }[]
          ) => {
            setSelectedProjectStatusTowers(e);
            if (towerOptions.length === e.length) {
              setIsAllSelected(true);
            } else {
              setIsAllSelected(false);
            }
          }}
        />
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Quoted Price(sq.ft.):</span>
        <input
          type='number'
          className={inputBoxClass}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </label>
      <button
        className='btn btn-neutral btn-sm min-w-20 max-w-fit self-center'
        type='button'
        onClick={() => {
          handleProjectStatusSave(
            'pricing',
            selectedProjectStatusTowers,
            isAllSelected,
            value,
            setValue
          );
          setValue('');
          setIsAllSelected(true);
          setSelectedProjectStatusTowers([]);
        }}
      >
        Save
      </button>
      {projectPricingStatus && projectPricingStatus.length > 0 && (
        <div className='mx-auto max-w-min flex-1 text-sm tabular-nums'>
          <p className='text-center text-xl font-semibold'>Pricing data</p>
          <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
            <span className='min-w-28'>Updated At</span>
            <span className='min-w-16'>Tower Id</span>
            <span className='min-w-28'>Updated field</span>
            <span className='min-w-28'>Updated Value</span>
            <span className='min-w-12'>Delete</span>
          </div>
          {projectPricingStatus.map((item) => (
            <div
              className='flex gap-2 border-y py-1 last:border-b-2'
              key={item.tower_id}
            >
              <span className='min-w-28'>{item.updated_at}</span>
              <span className='min-w-16 text-center'>{item.tower_id}</span>
              <span className='min-w-28'>{item.updated_field}</span>
              <span className='min-w-28 text-center'>{item.updated_value}</span>
              <div className='flex min-w-10 items-center justify-center self-center'>
                <button
                  className='flex h-5 w-5 items-center justify-center rounded-full bg-red-200 p-[1px]'
                  type='button'
                  onClick={() => {
                    deleteProjectStatusData('pricing', item.tower_id);
                  }}
                >
                  <RiCloseLine className='text-red-500' size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

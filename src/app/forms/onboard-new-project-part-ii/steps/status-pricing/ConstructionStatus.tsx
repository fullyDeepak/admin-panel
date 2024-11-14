import { inputBoxClass } from '@/app/constants/tw-class';
import { cn, getCurrentDate } from '@/lib/utils';
import { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import Select from 'react-select';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { RiCloseLine } from 'react-icons/ri';
import { handleProjectStatusSave } from './utils';

type Props = {
  towerOptions: {
    label: string;
    value: number;
  }[];
};

export default function ConstructionStatus({ towerOptions }: Props) {
  const [selectedProjectStatusTowers, setSelectedProjectStatusTowers] =
    useState<
      {
        label: string;
        value: number;
      }[]
    >([]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [selectedDisplayStatus, setSelectedDisplayStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const { projectConstructionStatus, deleteProjectStatusData } =
    useTowerUnitStore();
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='my-4 text-2xl font-semibold'>
        Section: Construction Status
      </h3>
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
        <span className='flex-[3] text-xl'>Select Status:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          isClearable
          options={[
            { label: 'Complete', value: 'complete' },
            { label: 'Under Construction', value: 'under_construction' },
            { label: 'Recent Completion', value: 'recent_completion' },
          ]}
          value={selectedDisplayStatus}
          onChange={(e) => {
            setSelectedDisplayStatus(e);
          }}
        />
      </label>
      <button
        className='btn btn-neutral btn-sm min-w-20 max-w-fit self-center'
        type='button'
        onClick={() => {
          handleProjectStatusSave(
            'display_construction_status',
            selectedProjectStatusTowers,
            isAllSelected,
            undefined,
            undefined,
            selectedDisplayStatus
          );
          setIsAllSelected(true);
          setSelectedProjectStatusTowers([]);
          setSelectedDisplayStatus(null);
        }}
      >
        Save
      </button>
      {projectConstructionStatus && projectConstructionStatus.length > 0 && (
        <div className='mx-auto max-w-min flex-1 text-sm tabular-nums'>
          <p className='text-center text-xl font-semibold'>
            Construction Status data
          </p>
          <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
            <span className='min-w-28'>Updated At</span>
            <span className='min-w-16'>Tower Id</span>
            <span className='min-w-52'>Updated field</span>
            <span className='min-w-36'>Updated Value</span>
            <span className='min-w-12'>Delete</span>
          </div>
          {projectConstructionStatus.map((item) => (
            <div
              className='flex gap-2 border-y py-1 last:border-b-2'
              key={item.tower_id}
            >
              <span className='min-w-28'>{item.updated_at}</span>
              <span className='min-w-16 text-center'>{item.tower_id}</span>
              <span className='min-w-52'>{item.updated_field}</span>
              <span className='min-w-36 text-center'>{item.updated_value}</span>
              <div className='flex min-w-10 items-center justify-center self-center'>
                <button
                  className='flex h-5 w-5 items-center justify-center rounded-full bg-red-200 p-[1px]'
                  type='button'
                  onClick={() => {
                    deleteProjectStatusData(
                      'display_construction_status',
                      item.tower_id
                    );
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

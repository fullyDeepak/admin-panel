'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { useEditProjectStore } from './useEditProjectStore';
import { useEditTowerStore } from './useEditTowerStore';
import { MultiSelect } from 'react-multi-select-component';
import { useState } from 'react';
import { getCurrentDate } from '@/lib/utils';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { RiCloseLine } from 'react-icons/ri';

const existingProjectStatusDataColumn = [
  {
    header: 'Updated At',
    accessorKey: 'updated_at',
  },
  {
    header: 'Project Id',
    accessorKey: 'project_id',
  },
  {
    header: 'Tower Id',
    accessorKey: 'tower_id',
  },
  {
    header: 'Updated Field',
    accessorKey: 'updated_field',
  },
  {
    header: 'Updated Value',
    accessorKey: 'updated_value',
  },
];

export default function ProjectStatus() {
  const {
    editProjectFormData,
    updateEditProjectFormData,
    projectBookingStatus,
    projectPricingStatus,
    projectConstructionStatus,
    updateProjectStatus,
    deleteProjectStatusData,
    existingProjectStatusData,
  } = useEditProjectStore();
  const { editTowerFormData } = useEditTowerStore();
  const towerOptions = editTowerFormData.map((item) => ({
    label: `${item.towerId}:${item.etlTowerName}`,
    value: item.towerId,
  }));
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [value, setValue] = useState('');
  const [selectedDisplayStatus, setSelectedDisplayStatus] = useState<{
    label: string;
    value: string;
  } | null>(null);

  function handleSave() {
    const updateKey = editProjectFormData.selectedProjectStatusType?.value;
    const towers = isAllSelected
      ? ['0']
      : editProjectFormData.selectedProjectStatusTowers.map((item) =>
          item.value.toString()
        );
    if (updateKey === 'booking' && value) {
      const data: {
        updated_at: string;
        project_id: number;
        tower_id: string;
        updated_field: 'manual_bookings';
        updated_value: string;
      }[] = towers.map((item) => ({
        project_id: editProjectFormData.selectedProject!,
        tower_id: item,
        updated_at: getCurrentDate(),
        updated_value: value,
        updated_field: 'manual_bookings',
      }));
      updateProjectStatus(updateKey, data);
      setValue('');
    } else if (updateKey === 'pricing' && value) {
      const data: {
        updated_at: string;
        project_id: number;
        tower_id: string;
        updated_field: 'price';
        updated_value: string;
      }[] = towers.map((item) => ({
        project_id: editProjectFormData.selectedProject!,
        tower_id: item,
        updated_at: getCurrentDate(),
        updated_value: value,
        updated_field: 'price',
      }));
      updateProjectStatus(updateKey, data);
      setValue('');
    } else if (
      updateKey === 'display_construction_status' &&
      selectedDisplayStatus
    ) {
      const data: {
        updated_at: string;
        project_id: number;
        tower_id: string;
        updated_field: 'display_construction_status';
        updated_value: string;
      }[] = towers.map((item) => ({
        project_id: editProjectFormData.selectedProject!,
        tower_id: item,
        updated_at: getCurrentDate(),
        updated_value: selectedDisplayStatus.value,
        updated_field: 'display_construction_status',
      }));
      console.log({ data });
      updateProjectStatus(updateKey, data);
      setSelectedDisplayStatus(null);
    }
  }
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Status</h3>
      {existingProjectStatusData && existingProjectStatusData.length > 0 && (
        <div className='max-h-screen rounded-2xl border-2 p-4'>
          <h3 className='my-4 text-center text-xl font-semibold'>
            Available Project Status Data
          </h3>
          <TanstackReactTable
            data={existingProjectStatusData}
            columns={existingProjectStatusDataColumn}
          />
        </div>
      )}
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Updated at:</span>
        <p className={inputBoxClass}>{getCurrentDate()}</p>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Tower IDs:</span>
        <MultiSelect
          options={towerOptions}
          className='w-full flex-[5]'
          labelledBy='status-tower-id-dropdown'
          value={editProjectFormData.selectedProjectStatusTowers}
          onChange={(
            e: {
              label: string;
              value: number;
            }[]
          ) => {
            updateEditProjectFormData({ selectedProjectStatusTowers: e });
            if (towerOptions.length === e.length) {
              setIsAllSelected(true);
            } else {
              setIsAllSelected(false);
            }
          }}
        />
      </div>{' '}
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Update Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          isClearable
          options={[
            { label: 'Pricing', value: 'pricing' },
            { label: 'Booking', value: 'booking' },
            {
              label: 'Construction Status',
              value: 'display_construction_status',
            },
          ]}
          value={editProjectFormData.selectedProjectStatusType}
          onChange={(e) => {
            updateEditProjectFormData({ selectedProjectStatusType: e });
            setValue('');
          }}
        />
      </label>
      {editProjectFormData.selectedProjectStatusTowers.length > 0 &&
      editProjectFormData.selectedProjectStatusType?.value ? (
        <>
          {editProjectFormData.selectedProjectStatusType.value ===
            'pricing' && (
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
          )}
          {editProjectFormData.selectedProjectStatusType.value ===
            'booking' && (
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3] text-xl'>Booking Count:</span>
              <input
                type='number'
                className={inputBoxClass}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </label>
          )}
          {editProjectFormData.selectedProjectStatusType.value ===
            'display_construction_status' && (
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
          )}
          <button
            className='btn btn-neutral btn-sm min-w-20 max-w-fit self-center'
            type='button'
            onClick={handleSave}
          >
            Save
          </button>
        </>
      ) : null}
      <div className='mt-10 flex flex-wrap justify-around gap-x-4 gap-y-8 transition-all duration-500'>
        {projectBookingStatus && projectBookingStatus.length > 0 ? (
          <div className='max-w-min flex-1 text-sm tabular-nums'>
            <p className='text-center text-xl font-semibold'>Booking data</p>
            <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
              <span className='min-w-28'>Updated At</span>
              <span className='min-w-16'>Tower Id</span>
              <span className='min-w-28'>Updated field</span>
              <span className='min-w-28'>Updated Value</span>
              <span className='min-w-12'>Delete</span>
            </div>
            {projectBookingStatus.map((item) => (
              <div
                className='flex gap-2 border-y py-1 last:border-b-2'
                key={item.tower_id}
              >
                <span className='min-w-28'>{item.updated_at}</span>
                <span className='min-w-16 text-center'>{item.tower_id}</span>
                <span className='min-w-28'>{item.updated_field}</span>
                <span className='min-w-28 text-center'>
                  {item.updated_value}
                </span>
                <div className='flex min-w-10 items-center justify-center self-center'>
                  <button
                    className='flex h-5 w-5 items-center justify-center rounded-full bg-red-200 p-[1px]'
                    type='button'
                    onClick={() => {
                      deleteProjectStatusData('booking', item.tower_id);
                    }}
                  >
                    <RiCloseLine className='text-red-500' size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {projectPricingStatus && projectPricingStatus.length > 0 ? (
          <div className='max-w-min flex-1 text-sm tabular-nums'>
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
                <span className='min-w-28 text-center'>
                  {item.updated_value}
                </span>
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
        ) : null}
        {projectConstructionStatus && projectConstructionStatus.length > 0 ? (
          <div className='max-w-min flex-1 text-sm tabular-nums'>
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
                <span className='min-w-36 text-center'>
                  {item.updated_value}
                </span>
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
        ) : null}
      </div>
    </>
  );
}

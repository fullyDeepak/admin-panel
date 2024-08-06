'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { useEditProjectStore } from './useEditProjectStore';
import { useEditTowerStore } from './useEditTowerStore';
import { MultiSelect } from 'react-multi-select-component';
import { useState } from 'react';
import { getCurrentDate } from '@/lib/utils';
import TanstackReactTable from '@/components/tables/TanstackReactTable';

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
    updateProjectStatus,
    existingProjectStatusData,
  } = useEditProjectStore();
  const { editTowerFormData } = useEditTowerStore();
  const towerOptions = editTowerFormData.map((item) => ({
    label: `${item.id}:${item.etlTowerName}`,
    value: item.id,
  }));
  const [isAllSelected, setIsAllSelected] = useState(true);
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Status</h3>
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
          ]}
          value={editProjectFormData.selectedProjectStatusType}
          onChange={(e) =>
            updateEditProjectFormData({ selectedProjectStatusType: e })
          }
        />
      </label>
      {editProjectFormData.selectedProjectStatusTowers.length > 0 &&
      editProjectFormData.selectedProjectStatusType?.value === 'pricing' ? (
        <label className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-xl'>Quoted Price(sq.ft.):</span>
          <input
            type='number'
            className={inputBoxClass}
            name='quoted-price'
            value={
              isAllSelected
                ? projectPricingStatus['0'] || ''
                : projectPricingStatus[
                    editProjectFormData.selectedProjectStatusTowers
                      .map((item) => item.value.toString())
                      .join(',')
                  ] || ''
            }
            onChange={(e) => {
              const key = isAllSelected
                ? '0'
                : editProjectFormData.selectedProjectStatusTowers
                    .map((item) => item.value)
                    .join(',');
              updateProjectStatus('pricing', {
                ...projectPricingStatus,
                [key]: e.target.value,
              });
            }}
          />
        </label>
      ) : null}
      {editProjectFormData.selectedProjectStatusTowers.length > 0 &&
      editProjectFormData.selectedProjectStatusType?.value === 'booking' ? (
        <label className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-xl'>Booking:</span>
          <input
            type='number'
            className={inputBoxClass}
            name='booking'
            value={
              isAllSelected
                ? projectBookingStatus['0'] || ''
                : projectBookingStatus[
                    editProjectFormData.selectedProjectStatusTowers
                      .map((item) => item.value.toString())
                      .join(',')
                  ] || ''
            }
            onChange={(e) => {
              const key = isAllSelected
                ? '0'
                : editProjectFormData.selectedProjectStatusTowers
                    .map((item) => item.value)
                    .join(',');
              updateProjectStatus('booking', {
                ...projectBookingStatus,
                [key]: e.target.value,
              });
              console.log(`Update key: ${key} and value: ${e.target.value}`);
            }}
          />
        </label>
      ) : null}
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
    </>
  );
}

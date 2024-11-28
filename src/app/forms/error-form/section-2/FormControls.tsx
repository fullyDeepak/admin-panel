'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { dropdownOptionStyle } from '@/styles/react-select';
import { useId } from 'react';
import Select, { SingleValue } from 'react-select';
import { ProjectOptionType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

const errOptions = [
  {
    label: `Error-1`,
    value: 'err-1',
  },
  {
    label: `Error-2`,
    value: 'err-2',
  },
  {
    label: `Error-3`,
    value: 'err-3',
  },
  {
    label: `Error-4`,
    value: 'err-4',
  },
  { label: 'Missing', value: 'missing' },
];

export default function FormControls() {
  const { errorFormData, updateErrorFormData, updateRecordsByProjectId } =
    useErrorFormStore();
  const { data: projectOptions, isLoading } = useFetchData<ProjectOptionType[]>(
    '/onboarding/getProjectsForPart2'
  );
  return (
    <div
      className={cn(
        'mx-auto mt-5 flex w-[80%] flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
      )}
    >
      <h3 className='my-4 text-3xl font-semibold'>Section: 2</h3>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-5'>
          <span className='flex-[2]'>Search by:</span>
          <div className='flex w-full flex-[5] gap-10'>
            <label
              className={cn(
                'flex min-w-32 cursor-pointer select-none items-center justify-evenly gap-2 rounded border-2 px-3 py-2',
                errorFormData.selectedMainFilter === 'ERROR' &&
                  'border-violet-600 bg-violet-600/10 text-violet-600'
              )}
            >
              <input
                type='radio'
                name='error-form-main-filter'
                className='peer'
                checked={errorFormData.selectedMainFilter === 'ERROR'}
                hidden
                onChange={() => {
                  updateErrorFormData({
                    selectedMainFilter: 'ERROR',
                    errorOptions: [],
                    towerOptions: [],
                    floorOptions: [],
                    unitOptions: [],
                    selectedMainError: null,
                    selectedMainProject: null,
                    selectedProject: null,
                  });

                  updateRecordsByProjectId([]);
                }}
              />
              <span>Error</span>
              <CircleCheck className='hidden peer-checked:inline-block' />
            </label>
            <label
              className={cn(
                'flex min-w-32 cursor-pointer select-none items-center justify-evenly gap-2 rounded border-2 px-3 py-2',
                errorFormData.selectedMainFilter === 'PROJECT' &&
                  'border-violet-600 bg-violet-600/10 text-violet-600'
              )}
            >
              <input
                type='radio'
                name='error-form-main-filter'
                className='peer'
                hidden
                checked={errorFormData.selectedMainFilter === 'PROJECT'}
                onChange={() => {
                  updateErrorFormData({
                    selectedMainFilter: 'PROJECT',
                    errorOptions: [],
                    towerOptions: [],
                    floorOptions: [],
                    unitOptions: [],
                    selectedMainError: null,
                    selectedMainProject: null,
                    selectedProject: null,
                  });
                  updateRecordsByProjectId([]);
                }}
              />
              <span>Project</span>
              <CircleCheck className='hidden peer-checked:inline-block' />
            </label>
          </div>
        </div>
        {errorFormData.selectedMainFilter === 'ERROR' && (
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2]'>Error Type:</span>
            <Select
              styles={{
                option: dropdownOptionStyle,
              }}
              className='w-full flex-[5]'
              key='error-type-main-filter'
              options={errOptions}
              isDisabled={errorFormData.selectedMainFilter !== 'ERROR'}
              value={errorFormData.selectedMainError}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: string;
                }>
              ) =>
                updateErrorFormData({
                  selectedMainError: e,
                  selectedMainProject: null,
                })
              }
            />
          </label>
        )}
        {errorFormData.selectedMainFilter === 'PROJECT' && (
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2]'>Projects:</span>
            <Select
              styles={{
                option: dropdownOptionStyle,
              }}
              className='w-full flex-[5]'
              isLoading={isLoading}
              key={'projects'}
              options={projectOptions?.map((item) => ({
                label: `${item.id}:${item.project_name}`,
                value: item.id,
              }))}
              value={errorFormData.selectedMainProject}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) =>
                updateErrorFormData({
                  selectedMainError: null,
                  selectedMainProject: e,
                })
              }
            />
          </label>
        )}
        <h3 className='my-4 text-2xl font-semibold'>Filters:</h3>
        {errorFormData.selectedMainFilter === 'ERROR' && (
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2]'>Projects:</span>
            <Select
              styles={{
                option: dropdownOptionStyle,
              }}
              className='w-full flex-[5]'
              isLoading={isLoading}
              key={'projects'}
              options={projectOptions?.map((item) => ({
                label: `${item.id}:${item.project_name}`,
                value: item.id,
              }))}
              value={errorFormData.selectedProject}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => updateErrorFormData({ selectedProject: e })}
            />
          </label>
        )}
        {errorFormData.selectedMainFilter === 'PROJECT' && (
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2]'>Error Code:</span>
            <Select
              className='w-full flex-[5]'
              styles={{
                option: dropdownOptionStyle,
              }}
              key={'error-code'}
              options={errorFormData.errorOptions || []}
              value={null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: string;
                }>
              ) => {
                console.log(e);
              }}
            />
          </label>
        )}
        <div className='flex items-center justify-between gap-5'>
          <span className='flex-[2]'>Filters Selected Project:</span>
          <div className='flex flex-[5] items-center gap-5'>
            <span className='flex-[2]'>Tower:</span>
            <Select
              className='w-full flex-[5]'
              instanceId={useId()}
              key={'tower-name'}
              options={errorFormData.towerOptions || []}
              value={null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                console.log(e);
              }}
            />
            <span className='flex-[2]'>Floor:</span>
            <Select
              className='w-full flex-[5]'
              instanceId={useId()}
              key={'floor'}
              options={[]}
              value={null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                console.log(e);
              }}
            />
            <span className='flex-[2]'>Unit:</span>
            <Select
              className='w-full flex-[5]'
              instanceId={useId()}
              key={'unit'}
              options={[]}
              value={null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                console.log(e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

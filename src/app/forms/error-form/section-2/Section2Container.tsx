'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { dropdownOptionStyle } from '@/styles/react-select';
import { useId } from 'react';
import Select, { SingleValue } from 'react-select';

const errorOption: { value: string; label: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Clean', value: '1' },
  { label: 'Error-1', value: 'err-1' },
  { label: 'Error-2', value: 'err-2' },
  { label: 'Error-3', value: 'err-3' },
  { label: 'Error-4', value: 'err-4' },
  { label: 'Missing', value: 'missing' },
];

export default function Section2Container() {
  const { data: projectOptions, isLoading } = useFetchData<
    { id: number; project_name: string; config_tagging: boolean }[]
  >('/onboarding/getProjectsForPart2');
  return (
    <div>
      <h3 className='my-4 text-2xl font-semibold'>Section: 2</h3>
      <div className='flex flex-col gap-2'>
        <label className='flex items-center justify-between gap-5'>
          <span className='flex-[2] text-xl'>Projects:</span>
          <Select
            styles={{
              option: dropdownOptionStyle,
            }}
            className='w-full flex-[5]'
            instanceId={useId()}
            isLoading={isLoading}
            key={'projects'}
            options={projectOptions?.map((item) => ({
              label: `${item.id}:${item.project_name}`,
              value: item.id,
            }))}
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
        </label>
        <div className='flex items-center justify-between gap-5'>
          <span className='flex-[2] text-xl'>Error Code:</span>
          <div className='flex flex-[5] items-center gap-5'>
            <Select
              className='w-full flex-[5]'
              styles={{
                option: dropdownOptionStyle,
              }}
              instanceId={useId()}
              key={'error-code'}
              options={errorOption}
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
            <span className='flex-[2] text-xl'>Tower Name:</span>
            <Select
              className='w-full flex-[5]'
              instanceId={useId()}
              key={'tower-name'}
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
        <div className='flex items-center justify-between gap-5'>
          <span className='flex-[2] text-xl'>Floor:</span>
          <div className='flex flex-[5] items-center gap-5'>
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
            <span className='flex-[2] text-xl'>Unit:</span>
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

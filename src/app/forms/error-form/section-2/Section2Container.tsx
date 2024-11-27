'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { dropdownOptionStyle } from '@/styles/react-select';
import { useId } from 'react';
import Select, { SingleValue } from 'react-select';
import { ErrorTypeCountRes, ProjectOptionType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';

export default function Section2Container() {
  const { errorFormData, updateErrorFormData } = useErrorFormStore();
  const { data: projectOptions, isLoading } = useFetchData<ProjectOptionType[]>(
    '/onboarding/getProjectsForPart2'
  );

  const { data: errorTypeCountRes, isLoading: isLoadingErrCount } =
    useFetchData<ErrorTypeCountRes>(
      errorFormData.selectedProject
        ? `/error-correction/error-type-counts?project_id=${errorFormData.selectedProject?.value}`
        : null
    );

  const errorCountOptions = [
    {
      label: `All:${+(errorTypeCountRes?.err_1 || 0) + +(errorTypeCountRes?.err_2 || 0) + +(errorTypeCountRes?.err_3 || 0) + +(errorTypeCountRes?.err_4 || 0)}`,
      value: 'all',
    },
    { label: 'Clean', value: '1' },
    {
      label: `Error-1:${errorTypeCountRes?.err_1}`,
      value: 'err-1',
    },
    {
      label: `Error-2:${errorTypeCountRes?.err_2}`,
      value: 'err-2',
    },
    {
      label: `Error-3:${errorTypeCountRes?.err_3}`,
      value: 'err-3',
    },
    {
      label: `Error-4:${errorTypeCountRes?.err_4}`,
      value: 'err-4',
    },
    { label: `Missing:${errorTypeCountRes?.no_match}`, value: 'missing' },
  ];
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
            value={errorFormData.selectedProject}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => updateErrorFormData({ selectedProject: e })}
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
              isDisabled={!errorFormData.selectedProject}
              key={'error-code'}
              isLoading={isLoadingErrCount}
              options={errorCountOptions}
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

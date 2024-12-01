'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { dropdownOptionStyle } from '@/styles/react-select';
import { useEffect, useId } from 'react';
import Select, { SingleValue } from 'react-select';
import { GET__RecordsByProjectResp, ProjectOptionType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import { countBy, uniqBy } from 'lodash';
import { Option, OptionValNum } from '@/types/types';
import { makeErrorTableData } from './utils';

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
  const {
    errorFormData,
    updateErrorFormData,
    setRecordsByProjectResp,
    recordsByProjectResp,
    setErrorTableData,
    setSelectedTableRows,
    setTableRowSelection,
  } = useErrorFormStore();
  const { data: projectOptions, isLoading } = useFetchData<ProjectOptionType[]>(
    '/onboarding/getProjectsForPart2'
  );
  function handleFilter() {
    let filteredData: GET__RecordsByProjectResp[] = recordsByProjectResp;
    if (errorFormData.selectedError?.value) {
      filteredData = recordsByProjectResp.filter(
        (item) => item.error_type_inferred == errorFormData.selectedError?.value
      );
    }
    if (errorFormData.selectedProject?.value) {
      filteredData = filteredData.filter(
        (item) => item.project_id == errorFormData.selectedProject?.value
      );
    }
    if (errorFormData.selectedTower?.value) {
      filteredData = filteredData.filter(
        (item) => item.tower_id == errorFormData.selectedTower?.value
      );
    }
    if (errorFormData.selectedFloor?.value) {
      filteredData = filteredData.filter(
        (item) => item.floor_number == errorFormData.selectedFloor?.value
      );
    }
    if (errorFormData.selectedUnit?.value) {
      filteredData = filteredData.filter(
        (item) => item.unit_number == errorFormData.selectedUnit?.value
      );
    }
    const errorOptions: Option[] = [];
    const towerOptions: OptionValNum[] = [];
    const floorOptions: OptionValNum[] = [];
    const unitOptions: Option[] = [];

    filteredData.map((item) => {
      errorOptions.push({
        value: item.error_type_inferred,
        label: item.error_type_inferred,
      });
      towerOptions.push({
        value: item.tower_id,
        label: item.tower_id.toString(),
      });
      floorOptions.push({
        value: item.floor_number,
        label: item.floor_number.toString(),
      });
      unitOptions.push({
        value: item.unit_number,
        label: item.unit_number,
      });
    });
    setErrorTableData(makeErrorTableData(filteredData));
    const errCount = countBy(errorOptions, 'value');
    updateErrorFormData({
      towerOptions: uniqBy(towerOptions, 'value'),
      floorOptions: uniqBy(floorOptions, 'value'),
      unitOptions: uniqBy(unitOptions, 'value'),
      errorOptions: uniqBy(errorOptions, 'value')
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((item) => ({
          ...item,
          label: `${item.label} (${errCount[item.value]})`,
        })),
    });
    setSelectedTableRows([]);
    setTableRowSelection({});
  }

  useEffect(() => {
    handleFilter();
  }, [
    errorFormData.selectedError,
    errorFormData.selectedProject,
    errorFormData.selectedFloor,
    errorFormData.selectedUnit,
    errorFormData.selectedTower,
  ]);
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

                  setRecordsByProjectResp([]);
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
                  setRecordsByProjectResp([]);
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
              onChange={(e: SingleValue<Option>) =>
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
              className='z-[12] w-full flex-[5]'
              isLoading={isLoading}
              key={'projects'}
              options={projectOptions?.map((item) => ({
                label: `${item.id}:${item.project_name}`,
                value: item.id,
              }))}
              value={errorFormData.selectedMainProject}
              onChange={(e: SingleValue<OptionValNum>) =>
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
              className='z-[11] w-full flex-[5]'
              isLoading={isLoading}
              key={'projects'}
              options={[]}
              value={errorFormData.selectedProject}
              onChange={(e: SingleValue<OptionValNum>) =>
                updateErrorFormData({ selectedProject: e })
              }
            />
          </label>
        )}
        {errorFormData.selectedMainFilter === 'PROJECT' && (
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2]'>Error Type:</span>
            <Select
              className='z-[11] w-full flex-[5]'
              styles={{
                option: dropdownOptionStyle,
              }}
              key={'error-type'}
              options={errorFormData.errorOptions || []}
              value={errorFormData.selectedError}
              isClearable
              onChange={(e: SingleValue<Option>) =>
                updateErrorFormData({ selectedError: e })
              }
            />
          </label>
        )}
        <div className='flex items-center justify-between gap-5'>
          <span className='flex-[2]'>Filters Selected Project:</span>
          <div className='flex flex-[5] items-center gap-5'>
            <span className='flex-[2]'>Tower:</span>
            <Select
              className='z-10 w-full flex-[5]'
              instanceId={useId()}
              styles={{
                option: dropdownOptionStyle,
              }}
              key={'tower-name'}
              isClearable
              options={errorFormData.towerOptions || []}
              value={errorFormData.selectedTower}
              onChange={(e: SingleValue<OptionValNum>) =>
                updateErrorFormData({ selectedTower: e })
              }
            />
            <span className='flex-[2]'>Floor:</span>
            <Select
              className='z-10 w-full flex-[5]'
              instanceId={useId()}
              styles={{
                option: dropdownOptionStyle,
              }}
              isClearable
              key={'floor'}
              options={errorFormData.floorOptions || []}
              value={errorFormData.selectedFloor}
              onChange={(e: SingleValue<OptionValNum>) =>
                updateErrorFormData({ selectedFloor: e })
              }
            />
            <span className='flex-[2]'>Unit:</span>
            <Select
              className='z-10 w-full flex-[5]'
              instanceId={useId()}
              styles={{
                option: dropdownOptionStyle,
              }}
              isClearable
              key={'unit'}
              options={errorFormData.unitOptions || []}
              value={errorFormData.selectedUnit}
              onChange={(e: SingleValue<Option>) =>
                updateErrorFormData({ selectedUnit: e })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

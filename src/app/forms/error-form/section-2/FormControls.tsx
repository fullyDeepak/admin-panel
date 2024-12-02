'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { dropdownOptionStyle } from '@/styles/react-select';
import { useEffect, useId } from 'react';
import Select, { SingleValue } from 'react-select';
import { GET__RecordsByProjectResp, ProjectOptionType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import { cn } from '@/lib/utils';
import { countBy, uniqBy } from 'lodash';
import { Option, OptionValNum } from '@/types/types';
import { makeErrorTableData } from './utils';

export default function FormControls() {
  const {
    errorFormData,
    updateErrorFormData,
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
            value={errorFormData.selectedProject}
            onChange={(e: SingleValue<OptionValNum>) =>
              updateErrorFormData({
                selectedProject: e,
              })
            }
          />
        </label>
        <h3 className='my-4 text-2xl font-semibold'>Filters:</h3>
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

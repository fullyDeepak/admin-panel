'use client';

import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { isEqual, uniqWith } from 'lodash';
import { useEffect, useId } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import Select, { SingleValue } from 'react-select';
export default function ErrorTypeOne() {
  const {
    selectedProject,
    selectedFloor,
    selectedTower,
    towerOptions,
    setFloorOption,
    floorOptions,
    setTableData,
    umManualDataStore,
    loadingErrOneTableData,
    setSelectedProject,
    fetchUMManualData,
    setSelectedTower,
    setSelectedFloor,
  } = useUMCorrectionFormStore();
  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get<{
          data: {
            project_id: number;
            name: string;
            total_count: number;
            uniq_count: number;
          }[];
        }>('/unitmaster/projects');
        const options = res.data.data.map((item) => ({
          value: item.project_id,
          label: `${item.project_id}:${item.name}-(${item.total_count})-(${item.uniq_count})`,
        }));
        return options;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    fetchUMManualData();
  }, [selectedProject?.value]);
  return (
    <>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'projectOptions'}
          isClearable
          placeholder='Select Project Id and Name'
          instanceId={useId()}
          value={selectedProject}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setSelectedProject(e);
            setSelectedTower(null);
            setFloorOption(null);
            setSelectedFloor([]);
          }}
          options={projectOptions}
          isLoading={loadingProjectOptions}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Select Tower:</span>
        <Select
          className='w-full flex-[5]'
          key={'tower'}
          isLoading={loadingErrOneTableData === 'loading'}
          isClearable
          isDisabled={Boolean(!selectedProject?.value)}
          instanceId={useId()}
          value={selectedTower || null}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setSelectedTower(e);
            setSelectedFloor([]);
            if (e === null && umManualDataStore) {
              setTableData(umManualDataStore);
              setFloorOption(null);
            } else if (umManualDataStore) {
              const newTableData = umManualDataStore?.filter(
                (item) => item.tower_id === e?.value
              );
              const floorOptions = uniqWith(
                newTableData.map((item) => ({
                  value: item.floor,
                  label: item.floor.toString(),
                })),
                isEqual
              );
              setTableData(newTableData);
              setFloorOption(floorOptions);
              setSelectedFloor(floorOptions);
            }
          }}
          options={towerOptions}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Select Floor:</span>
        <MultiSelect
          className='w-full flex-[5]'
          key={'floor'}
          labelledBy='floor-MultiSelect'
          options={floorOptions || []}
          isLoading={loadingErrOneTableData === 'loading'}
          value={selectedFloor}
          disabled={Boolean(!selectedTower?.value)}
          onChange={(
            e: {
              value: number;
              label: string;
            }[]
          ) => {
            setSelectedFloor(e);
            const selectedFloorIds = e.map((item) => item.value);
            if (selectedTower?.value && umManualDataStore) {
              const newTableData = umManualDataStore.filter(
                (item) =>
                  selectedFloorIds.includes(item.floor) &&
                  item.tower_id === selectedTower.value
              );
              setTableData(newTableData);
            }
          }}
        />
      </div>
    </>
  );
}

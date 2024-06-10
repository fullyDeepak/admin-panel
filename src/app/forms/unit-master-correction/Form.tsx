'use client';
import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';
import { isEqual, uniqWith } from 'lodash';
import { useId } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import Select, { SingleValue } from 'react-select';

type FormProps = {
  projectOptions:
    | {
        value: number;
        label: string;
      }[]
    | undefined;
  loadingProjectOptions: boolean;
};

export default function Form({
  projectOptions,
  loadingProjectOptions,
}: FormProps) {
  const {
    selectedProject,
    selectedFloor,
    selectedTower,
    towerOptions,
    setFloorOption,
    floorOptions,
    setTableData,
    umManualDataStore,
    setSelectedProject,
    setSelectedTower,
    setSelectedFloor,
  } = useUMCorrectionFormStore();
  return (
    <form
      className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[50%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
      id='UMCorrectionForm'
      // onSubmit={submitForm}
    >
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>
          Select Error Type:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'projectOptions'}
          isClearable
          instanceId={useId()}
          onChange={(
            e: SingleValue<{
              value: string;
              label: string;
            }>
          ) => {}}
          options={[{ label: 'Error Type-1', value: 'err-type-1' }]}
        />
      </label>
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
    </form>
  );
}

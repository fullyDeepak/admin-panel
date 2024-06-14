import { useEffect, useId, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';
import { isEqual, uniqWith } from 'lodash';
import { MultiSelect } from 'react-multi-select-component';

export default function Form() {
  const [errorType, setErrorType] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);

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

  useEffect(() => {
    fetchUMManualData();
  }, [selectedProject?.value]);

  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects', errorType?.value],
    queryFn: async () => {
      try {
        let options: { value: number; label: string }[] = [];
        if (errorType?.value === 'err-type-1') {
          const res = await axiosClient.get<{
            data: {
              project_id: number;
              name: string;
              total_count: number;
              uniq_count: number;
            }[];
          }>('/unitmaster/errOneProjects');
          res.data.data.map((item) => {
            options.push({
              value: item.project_id,
              label: `${item.project_id}:${item.name}-(${item.total_count})-(${item.uniq_count})`,
            });
          });
        } else if (errorType?.value === 'err-type-2') {
          const res = await axiosClient.get<{
            data: {
              project_id: number;
              name: string;
              total_count: number;
            }[];
          }>('/unitmaster/errTwoProjects');
          res.data.data.map((item) => {
            options.push({
              value: item.project_id,
              label: `${item.project_id}:${item.name}-(${item.total_count})`,
            });
          });
        }

        if (selectedProject && selectedProject.value) {
          const selectedProjectTemp = selectedProject.value;
          const newSelectedProject = options.find(
            (item) => item.value === selectedProjectTemp
          );
          setSelectedProject(newSelectedProject);
        }
        return options;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  return (
    <form
      className='z-10 mb-16 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[50%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
      id='UMCorrectionForm'
    >
      <label className='flex flex-wrap items-start justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>
          Select Error Type:
        </span>
        <div className='w-full flex-[5]'>
          <Select
            className=''
            key={'projectOptions'}
            isClearable
            value={errorType}
            instanceId={useId()}
            onChange={(
              e: SingleValue<{
                value: string;
                label: string;
              }>
            ) => {
              setErrorType(e);
            }}
            options={[
              { label: 'Error Type-1', value: 'err-type-1' },
              { label: 'Error Type-2', value: 'err-type-2' },
            ]}
          />
          {errorType?.value === 'err-type-1' && (
            <span className='m-0 p-0 text-xs'>
              Applied Filter: is_in_transactions = TRUE AND door_number_matched
              = TRUE AND verified IS NULL
            </span>
          )}
          {errorType?.value === 'err-type-2' && (
            <span className='m-0 p-0 text-xs'>
              Applied Filter: ( is_in_transactions = TRUE AND is_in_hm = TRUE
              AND door_number_matched = FALSE ) OR ( is_in_transactions = TRUE
              AND door_number_matched = TRUE AND verified = FALSE )
            </span>
          )}
        </div>
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
      {/* <ErrorTypeOne /> */}
    </form>
  );
}

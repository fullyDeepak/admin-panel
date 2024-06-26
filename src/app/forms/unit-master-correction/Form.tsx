import { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';
import { isEqual, uniqWith } from 'lodash';
import { MultiSelect } from 'react-multi-select-component';
import { nanoid } from 'nanoid';

export default function Form() {
  const {
    errorType,
    setErrorType,
    selectedProject,
    selectedFloor,
    selectedErrTwoFloor,
    selectedTower,
    towerOptions,
    setFloorOption,
    errTwoType,
    setErrTwoType,
    setLoadingErrData,
    floorOptions,
    setTableData,
    umManualDataStore,
    errTwoTFU,
    loadingErrData,
    setSelectedProject,
    fetchUMMErrData,
    setSelectedTower,
    errTwoSelectedUnit,
    setErrTwoSelectedUnit,
    fetchUMMErrTwoData,
    setSelectedErrTwoFloor,
    resetErrTwoLeftRightData,
    setSelectedFloor,
  } = useUMCorrectionFormStore();

  useEffect(() => {
    if (errorType?.value === 'err-type-1' || errTwoType) {
      fetchUMMErrData();
    }
  }, [selectedProject?.value, errTwoType]);

  useEffect(() => {
    fetchUMMErrTwoData();
  }, [errTwoSelectedUnit?.value]);

  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects', errorType?.value, errTwoType],
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
        } else if (errorType?.value === 'err-type-2' && errTwoType) {
          const res = await axiosClient.get<{
            data: {
              project_id: number;
              name: string;
              total_count: number;
            }[];
          }>('/unitmaster/errTwoProjects', { params: { type: errTwoType } });
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

  const [unitOptions, setUnitOptions] = useState<
    | {
        value: string;
        label: string;
      }[]
    | undefined
  >(undefined);

  return (
    <form
      className='z-20 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[50%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
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
            instanceId={nanoid()}
            onChange={(
              e: SingleValue<{
                value: string;
                label: string;
              }>
            ) => {
              setErrorType(e);
              setLoadingErrData('idle');
              setErrTwoType(null);
            }}
            options={[
              { label: 'Error Type-1', value: 'err-type-1' },
              { label: 'Error Type-2', value: 'err-type-2' },
            ]}
          />
          {errorType?.value === 'err-type-1' && (
            <span className='m-0 mt-2 block p-0 text-xs'>
              Applied Filter: <br />
              is_in_transactions = TRUE <br /> AND door_number_matched = TRUE{' '}
              <br />
              AND verified = False
            </span>
          )}
        </div>
      </label>
      {errorType?.value === 'err-type-2' && (
        <div className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Choose Project Sub-Type:
          </span>
          <div className='flex w-full flex-[5] items-center gap-5'>
            <label
              className={`${errTwoType === 'type-a' ? 'border-violet-600' : ''} flex items-center justify-evenly gap-2 rounded border-2 px-3 py-2`}
            >
              <input
                type='radio'
                name='err-type-2-subtype'
                checked={errTwoType === 'type-a'}
                className='radio checked:bg-violet-600'
                onChange={() => setErrTwoType('type-a')}
              />
              <span>Type A</span>
            </label>
            <label
              className={`${errTwoType === 'type-b' ? 'border-violet-600' : ''} flex items-center gap-2 rounded border-2 px-3 py-2`}
            >
              <input
                type='radio'
                name='err-type-2-subtype'
                className='radio checked:bg-violet-600'
                checked={errTwoType === 'type-b'}
                onChange={() => setErrTwoType('type-b')}
              />
              <span>Type B</span>
            </label>
          </div>
        </div>
      )}
      {errTwoType === 'type-a' && (
        <div className='flex gap-5'>
          <span className='w-full flex-[3]'></span>
          <span className='m-0 -my-3 block w-full flex-[5] p-0 text-xs'>
            Applied Filter: <br />
            is_in_transactions = true <br />
            AND door_number_matched = FALSE <br />
            AND transaction_hm_match_confidence = &apos;HIGH&apos; <br />
            AND verified = FALSE
          </span>
        </div>
      )}
      {errTwoType === 'type-b' && (
        <div className='flex gap-5'>
          <span className='w-full flex-[3]'></span>
          <span className='m-0 -my-3 block w-full flex-[5] p-0 text-xs'>
            Applied Filter: <br />
            is_in_transactions = true <br />
            AND door_number_matched = FALSE <br />
            AND transaction_hm_match_confidence != &apos;HIGH&apos; <br />
            AND verified = FALSE
          </span>
        </div>
      )}
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'projectOptions'}
          isClearable
          isDisabled={Boolean(!errorType?.value)}
          placeholder='Select Project Id and Name'
          instanceId={nanoid()}
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
            setSelectedErrTwoFloor(null);
            setErrTwoSelectedUnit(null);
            resetErrTwoLeftRightData();
            setLoadingErrData('idle');
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
          isLoading={loadingErrData === 'loading'}
          isClearable
          isDisabled={Boolean(!selectedProject?.value)}
          instanceId={nanoid()}
          value={selectedTower || null}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setLoadingErrData('loading');
            setSelectedTower(e);
            setSelectedFloor([]);
            if (errorType?.value === 'err-type-1') {
              if (e === null && umManualDataStore) {
                setTableData(umManualDataStore);
                setFloorOption(null);
                setLoadingErrData('complete');
              } else if (umManualDataStore) {
                const newTableData = umManualDataStore?.filter(
                  (item) => item.tower_id === e?.value
                );
                console.log({ newTableData });
                const floorOptions = uniqWith(
                  newTableData.map((item) => ({
                    value: item.floor,
                    label: item.floor.toString(),
                  })),
                  isEqual
                );
                setLoadingErrData('complete');
                setTableData(newTableData);
                setFloorOption(floorOptions);
                setSelectedFloor(floorOptions);
                resetErrTwoLeftRightData();
              }
            } else if (errorType?.value === 'err-type-2') {
              const newTowerTFU = errTwoTFU?.filter(
                (item) => item.tower_id === e?.value
              );
              const floorOptions = uniqWith(
                newTowerTFU.map((item) => ({
                  value: item.floor,
                  label: item.floor.toString(),
                })),
                isEqual
              );
              setFloorOption(floorOptions);
              setSelectedFloor(floorOptions);
              setSelectedErrTwoFloor(null);
              setErrTwoSelectedUnit(null);
            }
          }}
          options={towerOptions}
        />
      </label>

      {errorType && (
        <div className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select Floor:</span>
          {errorType?.value === 'err-type-1' && (
            <MultiSelect
              className='w-full flex-[5]'
              key={'floor'}
              labelledBy='floor-MultiSelect'
              options={floorOptions || []}
              isLoading={loadingErrData === 'loading'}
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
          )}
          {errorType?.value === 'err-type-2' && (
            <Select
              className='w-full flex-[5]'
              key={'tower'}
              instanceId={nanoid()}
              options={floorOptions || []}
              value={selectedErrTwoFloor}
              isDisabled={Boolean(!selectedTower?.value)}
              onChange={(e) => {
                setLoadingErrData('idle');
                setSelectedErrTwoFloor(e);
                setErrTwoSelectedUnit(null);
                const selectedTowerFU = errTwoTFU?.find(
                  (item) =>
                    item.tower_id === selectedTower?.value &&
                    item.floor === e?.value
                );

                const unitOptions = selectedTowerFU!.unit_numbers.map(
                  (unit) => ({
                    value: unit,
                    label: unit.toString(),
                  })
                );
                setUnitOptions(unitOptions);
                resetErrTwoLeftRightData();
              }}
            />
          )}
        </div>
      )}
      {errorType?.value === 'err-type-2' && (
        <label className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select Unit:</span>
          <Select
            className='w-full flex-[5]'
            key={'units'}
            isLoading={loadingErrData === 'loading'}
            isClearable
            isDisabled={selectedErrTwoFloor?.value == null}
            instanceId={nanoid()}
            value={errTwoSelectedUnit || null}
            onChange={(
              e: SingleValue<{
                value: string;
                label: string;
              }>
            ) => {
              setLoadingErrData('idle');
              resetErrTwoLeftRightData();
              setErrTwoSelectedUnit(e);
            }}
            options={unitOptions || []}
          />
        </label>
      )}
    </form>
  );
}

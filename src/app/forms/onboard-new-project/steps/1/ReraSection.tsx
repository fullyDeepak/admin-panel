// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { SingleValue } from 'react-select';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { isEqual, uniq, uniqBy, uniqWith } from 'lodash';
import { inputBoxClass } from '@/app/constants/tw-class';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';

type Props = {
  reraProjects:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  isLoadingReraProjects: boolean;
  reraForTempProjects: {
    [key: string]: string[];
  };
};

export default function ReraSection({
  reraProjects,
  isLoadingReraProjects,
  reraForTempProjects,
}: Props) {
  const { onboardingData, updateOnboardingData, resetData } =
    useOnboardingDataStore();
  const [loadingProjectDetails, setLoadingProjectDetails] = useState(false);

  async function fetchProjectsDetails() {
    resetData();
    const selectedProjectIds = onboardingData.selectedReraProjects.map(
      (item) => +item.value
    );
    setLoadingProjectDetails(true);
    const response = await axiosClient.get<{
      data: [
        {
          project_id: string;
          project_name: string;
          project_type: string;
          project_subtype: string;
          village_id: string;
          survey_number: string;
          plot_number: string;
          rera_id: string;
          developer_name: string;
          tower_count: number;
          tower_id: string;
          tower_name: string;
          tower_type: string;
          max_floor_id: string;
          min_floor: number;
          gf_max_unit_count: string;
          typical_floor_max_unit: string;
          etl_unit_configs: {
            configName: string;
            minArea: number;
            maxArea: number;
          }[];
        },
      ];
    }>('/forms/rera/getProjectsDetails', {
      params: { projectIds: JSON.stringify(selectedProjectIds) },
    });
    const data = response.data.data;
    const developers = uniq(data.map((item) => item.developer_name));

    const phases: Record<number, number> = {};
    const projectIds = uniq(data.map((item) => +item.project_id));
    projectIds.map((num, index) => (phases[num] = index + 1));
  }
  return (
    <>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>
          Select Rera Projects:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'reraSourceProjects'}
          options={reraProjects || []}
          isLoading={isLoadingReraProjects}
          value={null}
          styles={{
            menu: (baseStyles: any, _state: any) => ({
              ...baseStyles,
              height: '15vh',
              overflowY: 'scroll',
            }),
          }}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            if (e) {
              updateOnboardingData({
                selectedReraProjects: uniqBy(
                  [
                    ...onboardingData.selectedReraProjects,
                    {
                      label: e.label,
                      value: e.value,
                    },
                  ],
                  (ele) => ele.value
                ),
              });
            }
          }}
          isDisabled={Boolean(!onboardingData.projectSourceType)}
        />
      </label>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-4'>
          <span>
            Recommended Rera Projects to Inherit From :{' '}
            {Object.entries(reraForTempProjects).map(([key, val]) => {
              return (
                <span
                  className='btn btn-neutral btn-sm mx-2 max-w-fit self-center text-white hover:bg-red-200 hover:text-black'
                  key={key + val}
                  onClick={() => {
                    const toAppend = reraProjects?.find((item) =>
                      val.includes(item.value)
                    );
                    console.log(toAppend);
                    if (toAppend) {
                      updateOnboardingData({
                        selectedReraProjects: uniqBy(
                          [
                            ...onboardingData.selectedReraProjects,
                            {
                              label: toAppend.label,
                              value: toAppend.value,
                            },
                          ],
                          (ele) => ele.value
                        ),
                      });
                    }
                  }}
                >{`${key}: ${val.join(', ')}`}</span>
              );
            })}
          </span>
          <span>
            Selected Rera Projects to Inherit From :{' '}
            {onboardingData.selectedReraProjects.map((e) => {
              return (
                <span
                  className='btn btn-error btn-sm mx-2 max-w-fit self-center text-white hover:bg-red-200 hover:text-black'
                  key={e.value}
                  onClick={() => {
                    updateOnboardingData({
                      selectedReraProjects:
                        onboardingData.selectedReraProjects.filter(
                          (item) => item.value !== e.value
                        ),
                    });
                    // remove recommended projects
                    // change main project name
                  }}
                >
                  {e.label.split(':')[1].trim().split('(')[0]}
                </span>
              );
            })}
          </span>
        </div>
        <button
          className='btn btn-error btn-sm text-white'
          onClick={fetchProjectsDetails}
          disabled={onboardingData.selectedReraProjects.length === 0}
        >
          Fetch Rera Project Details
        </button>
      </div>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Assign Main Project Name:
        </span>
        <input
          className={`${inputBoxClass}`}
          type='text'
          value={onboardingData.mainProjectName}
          onChange={(e) =>
            updateOnboardingData({ mainProjectName: e.target.value })
          }
          placeholder='Enter Main Project Name'
        />
      </label>
    </>
  );
}

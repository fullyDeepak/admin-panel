// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { SingleValue } from 'react-select';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { isEqual, uniq, uniqBy, uniqWith } from 'lodash';
import { inputBoxClass } from '@/app/constants/tw-class';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { UnitCardType, useTowerUnitStore } from '../../useTowerUnitStore';

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
  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();
  const { setTowerFormData } = useTowerUnitStore();
  const [loadingProjectDetails, setLoadingProjectDetails] = useState(false);

  async function fetchProjectsDetails() {
    const selectedProjectIds = onboardingData.selectedReraProjects.map(
      (item) => +item.value
    );
    setLoadingProjectDetails(true);
    const response = await axiosClient.get<{
      data: {
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
          facing:
            | 'EAST'
            | 'EF'
            | 'NF'
            | 'NORTH'
            | 'SF'
            | 'SOUTH'
            | 'WEST'
            | 'WF'
            | null;
          corner: boolean;
        }[];
      }[];
    }>('/forms/rera/getProjectsDetails', {
      params: { projectIds: JSON.stringify(selectedProjectIds) },
    });
    const data = response.data.data;
    const developers = uniq(data.map((item) => item.developer_name));
    let projectSubType = { value: '', label: '' };
    let projectType = { value: '', label: '' };
    if (
      data[0].project_type === 'Mixed Development (Residential & Commercial)'
    ) {
      projectType = {
        value: 'MIXED',
        label: 'Mixed',
      };
    } else if (data[0].project_type === 'Residential') {
      projectType = {
        value: 'RESIDENTIAL',
        label: 'Residential',
      };
    } else if (data[0].project_type === 'Commercial') {
      projectType = {
        value: 'COMMERCIAL',
        label: 'Commercial',
      };
    }
    if (data[0].project_subtype === 'Residential - Apartment') {
      projectSubType = {
        value: 'APARTMENT - GATED',
        label: 'Apartment - Gated',
      };
    } else if (data[0].project_subtype === 'Residential - Villa') {
      projectSubType = {
        value: 'VILLA',
        label: 'Villa',
      };
    } else if (data[0].project_subtype === 'Residential - Mixed') {
      projectSubType = {
        value: 'MIXED RESIDENTIAL',
        label: 'Mixed Residential',
      };
    }
    updateOnboardingData({
      suggestedPlot: uniq(data.map((item) => item.plot_number)),
      suggestedSurvey: uniq(data.map((item) => item.survey_number)),
      projectType: projectType,
      projectSubType: projectSubType,
    });

    const phases: Record<number, number> = {};
    const projectIds = uniq(data.map((item) => +item.project_id));
    projectIds.map((num, index) => (phases[num] = index + 1));
    const towersData = data.map((item, index) => {
      let gfMin = null;
      let gfMax = null;
      let unitMin = null;
      let unitMax = null;
      let reraTowerId = null;
      gfMin = item.min_floor == 0 ? '1' : '';
      gfMax = item.min_floor == 0 ? item.gf_max_unit_count : '';
      unitMin = '1';
      unitMax = `${item.typical_floor_max_unit}`;
      reraTowerId = item.tower_id;
      const unitCards: UnitCardType[] = [];
      item.etl_unit_configs.map((etl, idx) => {
        unitCards.push({
          id: idx + 1,
          reraUnitType: null,
          existingUnitType: null,
          floorNos: '',
          salableAreaMin: etl.minArea,
          salableAreaMax: etl.maxArea,
          extentMin: 0,
          extentMax: 0,
          facing: etl.facing?.substring(0, 1) || null,
          corner: false,
          configName: etl.configName,
          configVerified: true,
          unitFloorCount: null,
          unitNos: '',
        });
      });

      return {
        id: index + 1,
        projectPhase: phases[+item.project_id],
        reraId: item.rera_id || '',
        reraTowerId: reraTowerId,
        towerTypeSuggestion: item.tower_type || '',
        towerType: {
          label: '',
          value: '',
        },
        displayTowerType: null,
        singleUnit: false,
        towerNameDisplay: item.tower_name,
        towerNameETL: item.tower_name,
        etlUnitConfigs: uniqWith(item.etl_unit_configs, isEqual),
        towerDoorNo: '',
        minFloor: item.min_floor == 0 ? '0' : item.min_floor || '',
        maxFloor: item.max_floor_id || '',
        validTowerUnits: null,
        groundFloorName: '',
        groundFloorUnitNoMin: gfMin,
        groundFloorUnitNoMax: gfMax,
        typicalFloorUnitNoMin: unitMin,
        typicalFloorUnitNoMax: unitMax,
        deleteFullUnitNos: '',
        exceptionUnitNos: '',
        towerDoorNoString: '',
        unitCards: unitCards,
      };
    });
    setTowerFormData(towersData);
    setLoadingProjectDetails(false);
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
          disabled={
            onboardingData.selectedReraProjects.length === 0 ||
            loadingProjectDetails
          }
        >
          {loadingProjectDetails ? (
            <LoadingCircle size='medium' tailwindClass='bg-white' />
          ) : (
            'Fetch Rera Project Details'
          )}
        </button>
      </div>
    </>
  );
}

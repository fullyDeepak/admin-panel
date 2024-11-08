import LoadingCircle from '@/components/ui/LoadingCircle';
import axiosClient from '@/utils/AxiosClient';
import _, { isEqual, uniq, uniqBy, uniqWith } from 'lodash';
import { useState } from 'react';
import { SingleValue } from 'react-select';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { UnitCardType, useTowerUnitStore } from '../../useTowerUnitStore';
import { useQuery } from '@tanstack/react-query';

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
        total_land_area_sqmt: number;
        calculated_net_land_area_sqmt: number;
        village_id: string;
        survey_number: string;
        plot_number: string;
        rera_id: string;
        developer_name: string;
        master_developer_id: number | null;
        jv_id: number | null;
        is_jv: boolean;
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
    const master_developer_id = data[0].master_developer_id;
    const is_jv = data[0].is_jv;
    const jv_id = data[0].jv_id;
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

    const phases: Record<number, number> = {};
    const projectIds = uniq(data.map((item) => +item.project_id));
    projectIds.map((num, index) => (phases[num] = index + 1));
    const reraTotalLandAreaObj: Record<string, number> = {};
    const reraCalcNetLandAreaObj: Record<string, number> = {};

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
      reraTotalLandAreaObj[item.project_id] = item.total_land_area_sqmt;
      reraCalcNetLandAreaObj[item.project_id] =
        item.calculated_net_land_area_sqmt;
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
    console.log({ reraTotalLandAreaObj, reraCalcNetLandAreaObj });
    updateOnboardingData({
      suggestedPlot: uniq(data.map((item) => item.plot_number)),
      suggestedSurvey: uniq(data.map((item) => item.survey_number)),
      projectType: projectType,
      projectSubType: projectSubType,
      developerMasterId: is_jv
        ? 'JV:' + jv_id?.toString()
        : 'DEVELOPER:' + master_developer_id?.toString(),
      reraTotalLandArea: Object.values(reraTotalLandAreaObj)
        .map((item) => item)
        .reduce((a, b) => a + b, 0),
      reraCalcNetLandArea: Object.values(reraCalcNetLandAreaObj)
        .map((item) => item)
        .reduce((a, b) => a + b, 0),
    });
    setTowerFormData(towersData);
    setLoadingProjectDetails(false);
  }
  const { data: _reraForTemp } = useQuery({
    queryKey: ['reraForTempProjects', onboardingData.selectedTempProject],
    queryFn: async () => {
      if (!onboardingData.selectedTempProject) return [];
      const res = await axiosClient.get<{
        data?: { temp_project_id: string; rera_ids: string[] };
      }>('/onboarding/rera-matches-for-temp-project', {
        params: {
          project_id: onboardingData.selectedTempProject.value,
        },
      });
      if (res.data?.data?.rera_ids && res.data?.data?.rera_ids.length) {
        updateOnboardingData({
          reraForTempProjects: {
            [onboardingData.selectedTempProject.value]:
              res.data?.data?.rera_ids || [],
          },
        });
        console.log(
          res.data?.data?.rera_ids
            .map((ele) => {
              const reraProject = reraProjects?.find((project) => {
                return project.value === ele;
              });
              console.log(reraProject);
              return reraProject;
            })
            .filter((ele) => !ele)
        );

        const reraProjectsToSelect = res.data?.data?.rera_ids
          .map((ele) => {
            const reraProject = reraProjects?.find((project) => {
              return project.value === ele;
            });
            console.log(reraProject);
            return reraProject;
          })
          .filter((ele) => !!ele);
        console.log(reraProjectsToSelect);
        if (reraProjectsToSelect.length > 0) {
          updateOnboardingData({
            selectedReraProjects: _.uniqBy(
              [...onboardingData.selectedReraProjects, ...reraProjectsToSelect],
              (ele) => ele.value
            ),
          });
        }
      }
      return [];
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
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
              if (onboardingData.projectSourceType === 'RERA') {
                updateOnboardingData({
                  mainProjectName: uniqBy(
                    [
                      ...onboardingData.selectedReraProjects,
                      {
                        label: e.label,
                        value: e.value,
                      },
                    ],
                    (ele) => ele.value
                  )[0]
                    .label.split(':')[1]
                    .trim(),
                });
              }
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
              console.log(e);
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
                      mainProjectName:
                        onboardingData.projectSourceType === 'RERA'
                          ? uniqBy(
                              onboardingData.selectedReraProjects.filter(
                                (item) => item.value !== e.value
                              ),
                              (ele) => ele.value
                            )?.[0]
                              ?.label.split(':')[1]
                              .trim() || ''
                          : onboardingData.mainProjectName,
                    });
                    // remove recommended projects
                    // change main project name
                  }}
                >
                  {e.label.split(':')[0].trim()} -{' '}
                  {e.label.split(':')[1].trim().split('(')[0]}
                </span>
              );
            })}
          </span>
        </div>
        <button
          className='btn btn-neutral btn-sm text-white'
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

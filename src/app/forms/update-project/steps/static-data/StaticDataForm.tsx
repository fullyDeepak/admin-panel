import { MasterDevelopers } from '@/components/dropdowns/MasterDevelopers';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { MultiValue, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { parseISO } from 'date-fns';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { NewProjectData } from '../../api_types';
import useETLDataStore from '../../useETLDataStore';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import ProjectMatcherSection from './ProjectMatcherSection';
import { useSourceDataStore } from '../../useSourceDataStore';
const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 bg-transparent shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 ';

const projectTypeOptions = [
  {
    label: 'Residential',
    value: 'RESIDENTIAL',
  },
  {
    label: 'Commercial',
    value: 'COMMERCIAL',
  },
  {
    label: 'Mixed',
    value: 'MIXED',
  },
];
const projectSubTypeOptions = [
  'Apartment - Gated',
  'Apartment - Standalone',
  'Villa',
  'Mixed Residential',
  'Other',
].map((e) => {
  return {
    label: e,
    value: e
      .toUpperCase()
      .replace(' - ', '-')
      .replace(' ', '_')
      .replace('-', '_'),
  };
});
export default function StaticDataForm() {
  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();

  const { setSourceData: setSourceData } = useSourceDataStore();
  const { updateTowerFormData, towerFormData, setTowerFormData } =
    useTowerUnitStore();
  const { setData: setEtlData } = useETLDataStore();
  const { data: amenitiesOptions, isLoading: loadingAmenities } = useQuery({
    queryKey: ['amenitiesOptions'],
    queryFn: async () => {
      const data = await axiosClient.get('/forms/amenities');
      const amenities: { id: number; amenity: string }[] = data.data?.data;
      const amenitiesOptions = amenities.map((item) => ({
        label: item.amenity,
        value: item.id,
      }));
      return amenitiesOptions;
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });
  const { data: colonyTagOptions, isLoading: loadingColonyTagOptions } =
    useQuery({
      queryKey: ['colonyTagOptions'],
      queryFn: async () => {
        const data = await axiosClient.get('/colony-tags');
        const colony_tags: { id: number; tag: string }[] = data.data?.data;
        const colonyTagOptions = colony_tags.map((item) => ({
          label: item.tag,
          value: item.id,
        }));
        return colonyTagOptions;
      },
      staleTime: Infinity,
      refetchOnMount: false,
    });
  const { data: layoutOptions, isLoading: loadingLayoutOptions } = useQuery({
    queryKey: ['layoutOptions'],
    queryFn: async () => {
      const data = await axiosClient.get('/layout-tags');
      const layout_tags: { id: number; tag: string }[] = data.data?.data;
      const layoutOptions = layout_tags.map((item) => ({
        label: item.tag,
        value: item.id,
      }));
      return layoutOptions;
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { data: projectOptions, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: { id: number; project_name: string }[];
      }>('/projects');
      console.log(res.data.data);
      return res.data.data.map((ele) => ({
        label: `${ele.id}:${ele.project_name}`,
        value: ele.id,
      }));
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });
  return (
    <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none'>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'onBoardedProjects'}
          options={projectOptions || []}
          isLoading={loadingProjects}
          onChange={async (
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            if (e) {
              const projectData = await axiosClient.get<NewProjectData>(
                '/onboarding/projects/' + e.value
              );
              setSourceData({
                projectData: {
                  amenities: projectData.data.data.amenities.map((ele) => ({
                    label: ele.amenity,
                    value: ele.id,
                  })),
                  colonyTags: projectData.data.data.colonies.map((ele) => ({
                    label: ele.colony,
                    value: ele.id,
                  })),
                  layoutTags: projectData.data.data.micromarkets.map((ele) => ({
                    label: ele.micromarket,
                    value: ele.id,
                  })),
                  projectType: projectTypeOptions.find(
                    (ele) =>
                      ele.value === projectData.data.data.project_category
                  )!,
                  projectSubType: projectSubTypeOptions.find(
                    (ele) => ele.value === projectData.data.data.project_subtype
                  )!,
                  mainProjectName: projectData.data.data.project_name,
                  developerMasterId: projectData.data.data.developer.is_jv
                    ? `JV:${projectData.data.data.developer.jv_id}`
                    : `DEVELOPER:${projectData.data.data.developer.developer_master_id}`,
                  isLuxuryProject: projectData.data.data.is_luxury_project,
                  houseMasterLocalities: projectData.data.data.localities,
                  taggedKeywords: [
                    ...projectData.data.data.landlord_keywords.map((ele) => ({
                      party: ele,
                      keyword_type: 'developer' as const,
                      removed: false,
                    })),
                    ...projectData.data.data.developer_keywords.map((ele) => ({
                      party: ele,
                      keyword_type: 'landlord' as const,
                      removed: false,
                    })),
                  ],
                  reraIds: projectData.data.data.rera_id,
                  project_id: projectData.data.data.project_id,
                  developmentAgreements: projectData.data.data.root_docs.map(
                    (ele) => ({
                      ...ele,
                      execution_date: parseISO(ele.execution_date),
                    })
                  ),
                  clubhouse_area:
                    projectData.data.data.metadata.find(
                      (ele) => ele.key === 'clubhouse_area'
                    )?.val || '',
                  rootDocArea: projectData.data.data.root_docs
                    .filter((ele) => ele.area_attached)
                    .reduce((acc, ele) => acc + +ele.extent, 0),
                },
                towerData: projectData.data.data.towers.map((ele, index) => ({
                  id: index + 1,
                  towerId: ele.tower_id,
                  displayTowerType:
                    [
                      { label: 'APARTMENT', value: 'APARTMENT' },
                      { label: 'VILLA', value: 'VILLA' },
                    ].find((type) => type.value === ele.display_tower_type) ||
                    null,
                  projectPhase: +ele.phase,
                  reraId: ele.rera_id,
                  minFloor: ele.min_floor,
                  reraTowerId: ele.rera_tower_id,
                  towerDoorNoString: ele.tower_door_no,
                  singleUnit: ele.singleunit,
                  towerNameDisplay: ele.tower_name_alias,
                  towerNameETL: ele.etl_tower_name,
                  towerType:
                    [
                      { label: 'Apartment', value: 'apartment' },
                      { label: 'Apartment-Single', value: 'apartmentSingle' },
                      { label: 'Villa', value: 'villa' },
                      { label: 'Mixed', value: 'mixed' },
                    ].find((type) => type.value === ele.type) || null,
                })),
                etlData: projectData.data.data.ProjectETLTagDataType.map(
                  (ele, index) => ({
                    id: index + 1,
                    village: {
                      label: ele.village.name,
                      value: ele.village.id,
                    },
                    apartmentContains: ele.apartment_contains,
                    counterpartyContains: ele.counterparty_contains,
                    aptSurveyPlotDetails: ele.aptSurveyPlotDetails,
                    counterpartySurveyPlotDetails:
                      ele.counterpartySurveyPlotDetails,
                    localityContains:
                      ele.locality_wb_plot?.[0].locality_contains,
                    wardBlock: ele.locality_wb_plot?.[0].ward_block,
                    localityPlot: ele.locality_wb_plot?.[0].locality_plot,
                    surveyEquals: ele.survey_equals,
                    plotEquals: ele.plot_equals,
                    surveyContains: ele.survey_contains,
                    plotContains: ele.plot_contains,
                    doorNoStartWith: ele.door_no_start,
                    aptNameNotContains: ele.apt_name_not_contains,
                    docId: ele.doc_id,
                    docIdNotEquals: ele.doc_id_not_equals,
                    singleUnit: ele.single_unit,
                    rootDocs: ele.root_docs,
                    oldPattern: !ele.etl_pattern?.flags.newLang,
                    patterns: ele.etl_pattern
                      ? ele.etl_pattern.flags.newLang
                        ? JSON.parse(ele.etl_pattern.pattern)
                        : [
                            {
                              pattern: '',
                              type: 'tower',
                              priority: 1,
                            },
                            {
                              pattern: '',
                              type: 'floor',
                              priority: 2,
                            },
                            {
                              pattern: '',
                              type: 'unit',
                              priority: 3,
                            },
                          ]
                      : [
                          {
                            pattern: '',
                            type: 'tower',
                            priority: 1,
                          },
                          {
                            pattern: '',
                            type: 'floor',
                            priority: 2,
                          },
                          {
                            pattern: '',
                            type: 'unit',
                            priority: 3,
                          },
                        ],
                  })
                ),
              });
              updateOnboardingData({
                mainProjectName: projectData.data.data.project_name,
                developerMasterId: projectData.data.data.developer.is_jv
                  ? `JV:${projectData.data.data.developer.jv_id}`
                  : `DEVELOPER:${projectData.data.data.developer.developer_master_id}`,
                amenities: projectData.data.data.amenities.map((ele) => {
                  return {
                    label: ele.amenity,
                    value: ele.id,
                  };
                }),
                layoutTags: projectData.data.data.micromarkets.map((ele) => {
                  return {
                    label: ele.micromarket,
                    value: ele.id,
                  };
                }),
                colonyTags: projectData.data.data.colonies.map((ele) => {
                  return {
                    label: ele.colony,
                    value: ele.id,
                  };
                }),
                projectType: projectTypeOptions.find(
                  (ele) => ele.value === projectData.data.data.project_category
                ),
                projectSubType: projectSubTypeOptions.find(
                  (ele) => ele.value === projectData.data.data.project_subtype
                ),
                clubhouse_area: projectData.data.data.metadata.find(
                  (ele) => ele.key === 'clubhouse_area'
                )?.val,
                isLuxuryProject: projectData.data.data.is_luxury_project,
                houseMasterLocalities: projectData.data.data.localities,
                taggedKeywords: [
                  ...projectData.data.data.landlord_keywords.map((ele) => ({
                    party: ele,
                    keyword_type: 'landlord' as const,
                    removed: false,
                  })),
                  ...projectData.data.data.developer_keywords.map((ele) => ({
                    party: ele,
                    keyword_type: 'developer' as const,
                    removed: false,
                  })),
                ],
                reraIds: projectData.data.data.rera_id,
                project_id: projectData.data.data.project_id,
                developmentAgreements: projectData.data.data.root_docs.map(
                  (ele) => ({
                    ...ele,
                    execution_date: parseISO(ele.execution_date),
                  })
                ),
                rootDocArea: projectData.data.data.root_docs
                  .filter((ele) => ele.area_attached)
                  .reduce((acc, ele) => acc + +ele.extent, 0),
              });
              setEtlData(
                projectData.data.data.ProjectETLTagDataType.map(
                  (ele, index) => ({
                    id: index + 1,
                    village: {
                      label: ele.village.name,
                      value: ele.village.id,
                    },
                    apartmentContains: ele.apartment_contains,
                    counterpartyContains: ele.counterparty_contains,
                    aptSurveyPlotDetails: ele.aptSurveyPlotDetails,
                    counterpartySurveyPlotDetails:
                      ele.counterpartySurveyPlotDetails,
                    localityContains:
                      ele.locality_wb_plot?.[0].locality_contains,
                    wardBlock: ele.locality_wb_plot?.[0].ward_block,
                    localityPlot: ele.locality_wb_plot?.[0].locality_plot,
                    surveyEquals: ele.survey_equals,
                    plotEquals: ele.plot_equals,
                    surveyContains: ele.survey_contains,
                    plotContains: ele.plot_contains,
                    doorNoStartWith: ele.door_no_start,
                    aptNameNotContains: ele.apt_name_not_contains,
                    docId: ele.doc_id,
                    docIdNotEquals: ele.doc_id_not_equals,
                    singleUnit: ele.single_unit,
                    rootDocs: ele.root_docs,
                    oldPattern: !ele.etl_pattern?.flags.newLang,
                    rawPattern: ele.etl_pattern?.pattern,
                    patterns: ele.etl_pattern
                      ? ele.etl_pattern.flags.newLang
                        ? JSON.parse(ele.etl_pattern.pattern)
                        : [
                            {
                              pattern: '',
                              type: 'tower',
                              priority: 1,
                            },
                            {
                              pattern: '',
                              type: 'floor',
                              priority: 2,
                            },
                            {
                              pattern: '',
                              type: 'unit',
                              priority: 3,
                            },
                          ]
                      : [
                          {
                            pattern: '',
                            type: 'tower',
                            priority: 1,
                          },
                          {
                            pattern: '',
                            type: 'floor',
                            priority: 2,
                          },
                          {
                            pattern: '',
                            type: 'unit',
                            priority: 3,
                          },
                        ],
                  })
                )
              );
              setTowerFormData(
                projectData.data.data.towers.map((ele, index) => ({
                  id: index + 1,
                  towerId: ele.tower_id,
                  displayTowerType:
                    [
                      { label: 'APARTMENT', value: 'APARTMENT' },
                      { label: 'VILLA', value: 'VILLA' },
                    ].find((type) => type.value === ele.display_tower_type) ||
                    null,
                  projectPhase: +ele.phase,
                  reraId: ele.rera_id,
                  minFloor: ele.min_floor,
                  reraTowerId: ele.rera_tower_id,
                  towerDoorNoString: ele.tower_door_no,
                  singleUnit: ele.singleunit,
                  towerNameDisplay: ele.tower_name_alias,
                  towerNameETL: ele.etl_tower_name,
                  towerType:
                    [
                      { label: 'Apartment', value: 'apartment' },
                      { label: 'Apartment-Single', value: 'apartmentSingle' },
                      { label: 'Villa', value: 'villa' },
                      { label: 'Mixed', value: 'mixed' },
                    ].find((type) => type.value === ele.type) || null,
                }))
              );
            }
          }}
        />
      </label>

      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Main Project Name:
        </span>
        <input
          className={`${inputBoxClass}`}
          type='text'
          value={onboardingData.mainProjectName}
          placeholder='Enter Main Project Name'
          disabled={true}
        />
      </label>

      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Developer :{' '}
        </span>
        <MasterDevelopers
          className='w-full flex-[5]'
          SetValue={onboardingData.developerMasterId}
          onChange={(e) => {
            updateOnboardingData({
              developerMasterId: (
                e as SingleValue<{ label: string; value: string }>
              )?.value,
            });
          }}
        />
      </label>

      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Layout / Micromarket Tags :{' '}
        </span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={layoutOptions || []} //{micromarketOptions || []}
          isLoading={loadingLayoutOptions}
          value={onboardingData.layoutTags}
          isClearable
          isMulti
          instanceId={'micromarket-selector'}
          onChange={(
            e: MultiValue<{
              label: string;
              value: string | number;
              __isNew__?: boolean | undefined;
            }>
          ) => {
            updateOnboardingData({
              layoutTags: e as {
                label: string;
                value: string | number;
                __isNew__?: boolean;
              }[], //? to fix type error since it thinks it is readonly
            });
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Colony Tags: </span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={colonyTagOptions || []} //{streetTagOptions || []}
          isLoading={loadingColonyTagOptions}
          value={onboardingData.colonyTags}
          isClearable
          isMulti
          instanceId={'colony-selector'}
          onChange={(
            e: MultiValue<{
              label: string;
              value: string | number;
              __isNew__?: boolean | undefined;
            }>
          ) => {
            updateOnboardingData({
              colonyTags: e as {
                label: string;
                value: string | number;
                __isNew__?: boolean;
              }[], //? to fix type error since it thinks it is readonly
            });
          }}
        />
      </label>

      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Project Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'project-type'}
          options={projectTypeOptions}
          value={onboardingData.projectType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            updateOnboardingData({ projectType: e });
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Project Sub-Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'project-sub-type'}
          options={projectSubTypeOptions}
          value={onboardingData.projectSubType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            updateOnboardingData({ projectSubType: e });
            const towerIds = towerFormData.map((item) => item.id);
            if (towerIds.length > 0) {
              if (e?.value.includes('APARTMENT')) {
                updateTowerFormData(1, {
                  towerType: {
                    label: 'Apartment',
                    value: 'apartment',
                  },
                  displayTowerType: {
                    label: 'APARTMENT',
                    value: 'APARTMENT',
                  },
                });
              } else if (e?.value.includes('VILLA')) {
                updateTowerFormData(1, {
                  towerType: {
                    label: 'Villa',
                    value: 'villa',
                  },
                  displayTowerType: {
                    label: 'VILLA',
                    value: 'VILLA',
                  },
                });
              } else if (e?.value.includes('MIXED')) {
                updateTowerFormData(1, {
                  towerType: {
                    label: 'Mixed',
                    value: 'mixed',
                  },
                  displayTowerType: null,
                });
              }
            }
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Luxury Project?:</span>
        No
        <input type='checkbox' className='toggle toggle-primary' />
        Yes
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Amenities Tags:</span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={amenitiesOptions || []}
          isLoading={loadingAmenities}
          value={onboardingData.amenities}
          isClearable
          isMulti
          instanceId={'amenities-selector'}
          onChange={(
            e: MultiValue<{
              label: string;
              value: string | number;
              __isNew__?: boolean | undefined;
            }>
          ) => {
            updateOnboardingData({
              amenities: e as {
                label: string;
                value: string | number;
                __isNew__?: boolean;
              }[], //? to fix type error since it thinks it is readonly
            });
          }}
        />
      </label>
      {onboardingData.amenities.find((ele) =>
        ele.label.toUpperCase().includes('CLUBHOUSE')
      ) && (
        <label className='flex items-center justify-between gap-5'>
          <span className='flex-[2]'>Club House Area:</span>
          <input
            className={`${inputBoxClass} !ml-0`}
            type='number'
            value={onboardingData.clubhouse_area}
            onChange={(e) =>
              updateOnboardingData({ clubhouse_area: e.target.value })
            }
            placeholder='Enter Clubhouse Amenities'
          />
        </label>
      )}
      <ProjectMatcherSection />
    </div>
  );
}

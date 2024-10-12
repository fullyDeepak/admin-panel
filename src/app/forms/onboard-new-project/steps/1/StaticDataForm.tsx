import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import useDMVDataStore from '../../useDMVDataStore';
import useETLDataStore from '../../useETLDataStore';
import {
  TempProjectSourceData,
  useOnboardingDataStore,
} from '../../useOnboardingDataStore';
import ProjectMatcherSection from './ProjectMatcherSection';
const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 bg-transparent shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 ';

export default function StaticDataForm() {
  const {
    onboardingData,
    updateOnboardingData,
    addTempProjectSourceData,
    tempProjectSourceData,
    resetData,
  } = useOnboardingDataStore();
  const {
    setDMVData,
    DMVData,
    districtOptions,
    mandalOptions,
    setDistrictOptions,
    setMandalOptions,
    setVillageOptions,
    villageOptions,
  } = useDMVDataStore();
  const { setData } = useETLDataStore();
  const [reraForTempProjects, setReraForTempProjects] = useState<{
    [key: string]: string[];
  }>({});
  const { isLoading: isLoadingDMV } = useQuery({
    queryKey: ['village-project-cleaner-developer-tagger'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          state_name: string;
          state_id: number;
          districts: {
            district_id: number;
            district_name: string;
            mandals: {
              mandal_id: number;
              mandal_name: string;
              villages: { village_id: number; village_name: string }[];
            }[];
          }[];
        }[];
      }>('/forms/getOnboardedSDMV');
      console.log(res.data.data);
      const telanganaData = res.data.data.find(
        (item) => item.state_id === 36
      )?.districts;
      if (!telanganaData) return null;
      setDMVData(telanganaData);
      const districtOpts = telanganaData.map((item) => ({
        label: `${item.district_id}:${item.district_name}`,
        value: item.district_id,
      }));
      setDistrictOptions(districtOpts);
      return res.data.data;
    },
  });
  const { data: tempProjects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['tempProjects', onboardingData.selectedVillage],
    queryFn: async () => {
      if (!onboardingData.selectedVillage) return [];
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
          occurrence_count: number;
        }[];
      }>('/temp-projects', {
        params: {
          village_id: onboardingData.selectedVillage?.value,
        },
      });
      console.log(res.data.data);
      return res.data.data
        .sort((a, b) => b.occurrence_count - a.occurrence_count)
        .map((e) => ({
          label: `${e.id}:${e.name} (${e.occurrence_count})`,
          value: e.id,
        }));
    },
    staleTime: Infinity,
  });
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
  });
  const { data: reraProjects, isLoading: isLoadingReraProjects } = useQuery({
    queryKey: [
      'reraProjects',
      onboardingData.selectedVillage,
      onboardingData.projectSourceType,
    ],
    queryFn: async () => {
      if (!onboardingData.selectedVillage) return [];
      console.log(
        'Gettging Rera Projects for',
        onboardingData.selectedVillage,
        onboardingData.projectSourceType
      );
      const res = await axiosClient.get<{
        data: {
          id: string;
          project_name: string;
          unit_count: number;
        }[];
      }>('/onboarding/rera-projects', {
        params: {
          village_id: onboardingData.selectedVillage?.value,
          filter_onboarded: onboardingData.projectSourceType === 'RERA',
        },
      });
      console.log(res.data.data);
      return res.data.data
        .sort((a, b) => b.unit_count - a.unit_count)
        .map((e) => ({
          label: `${e.id}:${e.project_name} (${e.unit_count})`,
          value: e.id,
        }));
    },
    staleTime: Infinity,
  });
  const { data: _reraForTemp } = useQuery({
    queryKey: ['reraProjects', onboardingData.selectedTempProject],
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
        setReraForTempProjects({
          [onboardingData.selectedTempProject.value]:
            res.data?.data?.rera_ids || [],
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
          .filter((ele) => !!ele) as {
          label: string;
          value: string;
        }[];
        console.log(reraProjectsToSelect);
        if (reraProjectsToSelect) {
          updateOnboardingData({
            selectedReraProjects: _.uniqBy(
              [...onboardingData.selectedReraProjects, ...reraProjectsToSelect],
              (ele) => ele.value
            ),
          });
        }
      }
    },
    staleTime: Infinity,
  });

  return (
    <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none'>
      {/*  DISTRICT SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={districtOptions || []}
          value={onboardingData.selectedDistrict}
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateOnboardingData({
              selectedDistrict: e,
            });
            if (e) {
              const mandalOpts = DMVData?.find(
                (item) => item.district_id === e.value
              )?.mandals.map((item) => ({
                label: `${item.mandal_id}:${item.mandal_name}`,
                value: item.mandal_id,
              }));
              console.log('mandal options', mandalOpts);
              setMandalOptions(mandalOpts || []);
            } else {
              setMandalOptions([]);
            }
            updateOnboardingData({ selectedMandal: null });
          }}
        />
      </label>

      {/* MANDAL SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={mandalOptions || []}
          value={onboardingData.selectedMandal}
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateOnboardingData({ selectedMandal: e });
            if (e) {
              const villageOpts = DMVData?.find(
                (item) =>
                  item.district_id === onboardingData.selectedDistrict?.value
              )
                ?.mandals.find((item) => item.mandal_id === e.value)
                ?.villages.map((item) => ({
                  label: `${item.village_id}:${item.village_name}`,
                  value: item.village_id,
                }));
              setVillageOptions(villageOpts || []);
            } else {
              setVillageOptions([]);
            }
            updateOnboardingData({ selectedVillage: null });
            setReraForTempProjects({});
          }}
          isDisabled={Boolean(!onboardingData.selectedDistrict)}
        />
      </label>

      {/* VILLAGE SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          options={villageOptions || []}
          value={
            onboardingData.selectedMandal
              ? onboardingData.selectedVillage
              : null
          }
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateOnboardingData({ selectedVillage: e });
            resetData();
          }}
          isDisabled={Boolean(!onboardingData.selectedMandal)}
        />
      </label>

      {/* PROJECT SOURCE TYPE */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>
          Project Source Type:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'project-source-type'}
          isClearable={false}
          options={[
            {
              label: 'RERA',
              value: 'RERA',
            },
            {
              label: 'TEMP',
              value: 'TEMP',
            },
            {
              label: 'HYBRID',
              value: 'HYBRID',
            },
          ]}
          value={
            onboardingData.projectSourceType && {
              label: onboardingData.projectSourceType,
              value: onboardingData.projectSourceType,
            }
          }
          onChange={(
            e: SingleValue<{
              label: string;
              value: 'RERA' | 'TEMP' | 'HYBRID';
            }>
          ) => {
            console.log(e);
            setReraForTempProjects({});
            updateOnboardingData({
              projectSourceType: e?.value,
              selectedReraProjects: [],
              selectedTempProject: null,
            });
          }}
          isDisabled={Boolean(!onboardingData.selectedVillage)}
        />
      </label>

      {/* SELECT Source Temp Projects */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>
          Select Temp Projects:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'tempProject'}
          options={tempProjects || []}
          isLoading={isLoadingProjects}
          value={onboardingData.selectedTempProject}
          styles={{
            menu: (baseStyles: any, _state: any) => ({
              ...baseStyles,
              height: '15vh',
              overflowY: 'scroll',
            }),
          }}
          onChange={async (
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            if (e) {
              updateOnboardingData({
                selectedTempProject: e,
                selectedReraProjects: [],
              });
              setReraForTempProjects({});
              const tempProjectData = await axiosClient.get<{
                data: TempProjectSourceData;
              }>(`/temp-projects/${e.value}`);
              addTempProjectSourceData(e.value, tempProjectData.data.data);
              if (!onboardingData.mainProjectName) {
                updateOnboardingData({
                  mainProjectName: e.label.split(':')[1].trim(),
                });
                setData([
                  {
                    id: 1,
                    village: villageOptions.find(
                      (ele) =>
                        ele.value === onboardingData.selectedVillage?.value
                    ),
                    docId: [],
                    rootDocs:
                      tempProjectData.data.data.root_docs?.map(
                        (item) => item.doc_id
                      ) || [],
                    apartmentContains:
                      tempProjectData.data.data.raw_apartment_names,
                    aptNameNotContains: [],
                    aptSurveyPlotDetails: false,
                    counterpartyContains: [], // ! couterpartykeywords?
                    counterpartySurveyPlotDetails: false,
                    docIdNotEquals: [],
                    suggestedDoorNumberStartsWith:
                      tempProjectData.data.data.municipal_door_numbers?.map(
                        (ele) => {
                          return `${ele.core_string} : ${ele.unit_numbers.join(', ')} : ${ele.occurrence_count}`;
                        }
                      ) || [],
                    doorNoStartWith: [],
                    etlPattern: '',
                    localityContains: [],
                    localityPlot: [],
                    plotContains: [],
                    surveyContains: [],
                    singleUnit: false,
                    wardBlock: [],
                    surveyEquals:
                      tempProjectData.data.data.keywords
                        ?.filter(
                          (ele) =>
                            ele.keyword_type === 'SURVEY_EQUALS' &&
                            ele.is_attached
                        )
                        .map((ele) => ele.keyword.split('|'))
                        .reduce((acc, val) => acc.concat(val), []) || [],
                    plotEquals:
                      tempProjectData.data.data.keywords
                        ?.filter(
                          (ele) =>
                            ele.keyword_type === 'PLOT_EQUALS' &&
                            ele.is_attached
                        )
                        .map((ele) => ele.keyword.split('|'))
                        .reduce((acc, val) => acc.concat(val), []) || [],
                  },
                ]);
              }
            } else {
              // cleanup
              updateOnboardingData({
                selectedReraProjects: [],
                selectedTempProject: null,
              });
              setReraForTempProjects({});
            }
          }}
          isDisabled={
            Boolean(!onboardingData.projectSourceType) ||
            onboardingData.projectSourceType === 'RERA'
          }
        />
      </label>
      {/* <div className='flex flex-wrap gap-5'>
        Selected Source Projects to Inherit from:{' '}
        {onboardingData.selectedTempProjects.map((e) => {
          return (
            <span
              className='btn btn-error btn-sm mx-2 max-w-fit self-center text-white hover:bg-red-200 hover:text-black'
              key={e.value}
              onClick={() => {
                updateOnboardingData({
                  selectedTempProjects:
                    onboardingData.selectedTempProjects.filter(
                      (item) => item.value !== e.value
                    ),
                  mainProjectName: onboardingData.selectedTempProjects
                    .filter((item) => item.value !== e.value)[0]
                    ?.label.split(':')[1]
                    .trim(),
                });
                //! remove recommended projects
                setReraForTempProjects((prev) => {
                  return Object.fromEntries(
                    Object.entries(prev).filter(
                      ([key, _val]) => key !== e.value
                    )
                  );
                });
              }}
            >
              {e.label.split(':')[1].trim()}
            </span>
          );
        })}
      </div> */}
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
                selectedReraProjects: _.uniqBy(
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
                    selectedReraProjects: _.uniqBy(
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
      <label className='flex items-center justify-between gap-5'>
        <span>GeoCoded Address : </span>
        {Object.entries(tempProjectSourceData).map(([projectId, data]) => {
          return data.geojson_data?.[0].full_address ? (
            <span className='border' key={projectId}>
              {projectId} : {data.geojson_data?.[0].full_address}
            </span>
          ) : (
            <span className='rounded-xl border px-8' key={projectId}>
              N/A
            </span>
          );
        })}
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Layout / Micromarket Tags :{' '}
        </span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={[]} //{micromarketOptions || []}
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
          options={[]} //{streetTagOptions || []}
          // {loadingStreetTags}
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
          key={'project-source-type'}
          options={[
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
          ]}
          value={onboardingData.projectType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            updateOnboardingData({ projectType: e });
          }}
          isDisabled={Boolean(!onboardingData.projectSourceType)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Project Sub-Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'project-source-type'}
          options={[
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
          })}
          value={onboardingData.projectSubType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            updateOnboardingData({ projectSubType: e });
          }}
          isDisabled={Boolean(!onboardingData.projectSourceType)}
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

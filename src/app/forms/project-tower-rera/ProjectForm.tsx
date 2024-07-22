import { useQuery } from '@tanstack/react-query';
import Select, { MultiValue, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import React, { useId, useState } from 'react';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import axiosClient from '@/utils/AxiosClient';
import { MultiSelect } from 'react-multi-select-component';
import { extractKMLCoordinates } from '@/utils/extractKMLCoordinates';
import toast from 'react-hot-toast';
import { uniq, startCase } from 'lodash';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';
import { useReraDocStore } from '@/store/useReraDocStore';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import DocsETLTagData from './DocsETLTagData';
import ProjectMatcherSection from '@/components/forms/ProjectMatcherSection';

const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 ';

export default function ProjectForm() {
  const {
    projectFormDataRera,
    updateProjectFormDataRera,
    resetProjectFormDataRera,
  } = useProjectStoreRera();
  const { setTowersDataRera } = useTowerStoreRera();
  const { resetReraDocs } = useReraDocStore();
  const [mainProject, setMainProject] = useState<string>('');
  const [projectOptions, setProjectOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [projectMVDetails, setProjectMVDetails] = useState<
    {
      id: number;
      project_name: string;
      mandal_id: number;
      mandal_name: string;
      village_id: number;
      village_name: string;
    }[]
  >([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProjectFormDataRera({ [name]: value });
  };

  //   district dropdown
  const { isPending: loadingDistricts, data: districtOptions } = useQuery({
    queryKey: ['district'],
    queryFn: async () => {
      const options = await fetchDropdownOption('districts', 'state', 36);
      return options.map((item) => ({
        label: `${item.value}:${startCase(item.label.toLowerCase())}`,
        value: item.value,
      }));
    },
    staleTime: Infinity,
  });

  // mandal dropdown
  const { isPending: loadingMandalsData, data: mandalData } = useQuery({
    queryKey: ['mandal', projectFormDataRera.district],
    queryFn: async () => {
      if (
        projectFormDataRera.district !== undefined &&
        projectFormDataRera.district !== null
      ) {
        const [optionsResponse, projectResponse] = await Promise.all([
          await fetchDropdownOption(
            'mandals',
            'district',
            projectFormDataRera.district?.value
          ),
          await axiosClient.get<{
            data: {
              id: number;
              project_name: string;
              mandal_id: number;
              mandal_name: string;
              village_id: number;
              village_name: string;
            }[];
            message: string;
            statusCode: number;
          }>(`/forms/rera/getProjects`, {
            params: { district_id: projectFormDataRera.district?.value },
          }),
        ]);
        const mandalOptions = optionsResponse.map((item) => ({
          label: `${item.value}:${startCase(item.label.toLowerCase())}`,
          value: item.value,
        }));
        const projectOptions = projectResponse?.data?.data;
        setProjectMVDetails(projectOptions);
        const projectDropdownOptions = projectOptions.map((item) => ({
          value: item.id,
          label: `${item.id}:${startCase(item.project_name.toLowerCase())}`,
        }));
        setProjectOptions(projectDropdownOptions);
        return { mandalOptions, projectDropdownOptions };
      }
    },
    staleTime: Infinity,
  });

  //   village dropdown
  const { isPending: loadingVillages, data: villageOptions } = useQuery({
    queryKey: ['village', projectFormDataRera.mandal],
    queryFn: async () => {
      if (
        projectFormDataRera.mandal !== undefined &&
        projectFormDataRera.mandal !== null
      ) {
        console.log('fetching villages', projectFormDataRera.mandal);

        const [options, projectResponse] = await Promise.all([
          await fetchDropdownOption(
            'villages',
            'mandal',
            projectFormDataRera.mandal?.value
          ),
          await axiosClient.get<{
            data: {
              id: number;
              project_name: string;
              mandal_id: number;
              mandal_name: string;
              village_id: number;
              village_name: string;
            }[];
            message: string;
            statusCode: number;
          }>(`/forms/rera/getProjects`, {
            params: {
              district_id: projectFormDataRera.district?.value,
              mandal_id: projectFormDataRera?.mandal?.value,
            },
          }),
        ]);
        const projectOptions = projectResponse?.data?.data;
        setProjectMVDetails(projectOptions);
        const projectDropdownOptions = projectOptions.map((item) => ({
          value: item.id,
          label: `${item.id}:${startCase(item.project_name.toLowerCase())}`,
        }));
        setProjectOptions(projectDropdownOptions);
        return options.map((item) => ({
          label: `${item.value}:${startCase(item.label.toLowerCase())}`,
          value: item.value,
        }));
      }
    },
    staleTime: Infinity,
  });

  //   projects dropdown
  const { isPending: loadingProjects, data: _ } = useQuery({
    queryKey: ['project', projectFormDataRera.village],
    queryFn: async () => {
      if (
        projectFormDataRera.mandal !== undefined &&
        projectFormDataRera.mandal !== null &&
        projectFormDataRera.village !== undefined &&
        projectFormDataRera.village !== null
      ) {
        const res = await axiosClient.get<{
          data: {
            id: number;
            project_name: string;
            mandal_id: number;
            mandal_name: string;
            village_id: number;
            village_name: string;
          }[];
          message: string;
          statusCode: number;
        }>(`/forms/rera/getProjects`, {
          params: {
            district_id: projectFormDataRera.district?.value,
            // mandal_id: projectFormDataRera?.mandal?.value,
            village_id: projectFormDataRera.village.value,
          },
        });
        const options = res?.data?.data;
        setProjectMVDetails(options);
        const dropdownOptions = options.map((item) => {
          return {
            value: item.id,
            label: `${item.id}:${startCase(item.project_name.toLowerCase())}`,
          };
        });
        setProjectOptions(dropdownOptions);
        return true;
      }
    },
    staleTime: Infinity,
  });

  let loadingToastId: string;

  async function postMainProject() {
    toast.loading(`Setting Main Project Id and Name...`, {
      id: loadingToastId,
    });
    try {
      const projectIds = projectFormDataRera.projects.map(
        (item) => +item.value
      );
      console.log({ projectIds, mainProjectName: mainProject });
      const res = await axiosClient.post('/forms/rera/setMainProject', {
        projectIds,
        mainProjectName: mainProject,
      });
      if (res.status === 200) {
        toast.dismiss(loadingToastId);
        toast.success(
          `Main Project Id:${Math.min(...projectIds)} and Name:${mainProject} set `,
          {
            id: loadingToastId,
            duration: 5000,
          }
        );
      }
    } catch {
      toast.dismiss(loadingToastId);
      toast.error(`Couldn't set the Main Project Id & name.`, {
        id: loadingToastId,
        duration: 3000,
      });
    }
  }

  async function fetchProjectsDetails() {
    const dmvp = {
      district: projectFormDataRera.district,
      mandal: projectFormDataRera.mandal,
      village: projectFormDataRera.village,
      projects: projectFormDataRera.projects,
    };
    console.log(dmvp);
    resetProjectFormDataRera();
    resetReraDocs();
    updateProjectFormDataRera(dmvp);
    const selectedProjectIds = projectFormDataRera.projects.map(
      (item) => +item.value
    );
    const response = await axiosClient.get<{
      data: [
        {
          project_id: string;
          project_name: string;
          developer_name: string;
          project_type: string;
          project_subtype: string;
          village_id: number;
          survey_number: string;
          plot_number: string;
          rera_id: string;
          tower_id: string;
          tower_name: string;
          tower_type: string;
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
    updateProjectFormDataRera({
      village_id: data[0].village_id,
      projectName: uniq(data.map((item) => item.project_name)).join(' || '),
      projectIds: uniq(data.map((item) => +item.project_id)),
      developer: developers.join(' || '),
      projectTypeSuggestion: uniq(data.map((item) => item.project_type)),
      projectSubTypeSuggestion: uniq(data.map((item) => item.project_subtype)),
      surveySuggestion: uniq(data.map((item) => item.survey_number)),
      plotSuggestion: uniq(data.map((item) => item.plot_number)),
    });
    const phases: Record<number, number> = {};
    const projectIds = uniq(data.map((item) => +item.project_id));
    projectIds.map((num, index) => (phases[num] = index + 1));
    console.log('phases', phases);
    const towersData = data.map((item, index) => {
      return {
        id: index + 1,
        projectPhase: phases[+item.project_id],
        reraId: item.rera_id,
        reraTowerId: item.tower_id,
        towerTypeSuggestion: item.tower_type,
        towerType: {
          label: '',
          value: '',
        },
        etlTowerName: item.tower_name,
        towerNameAlias: item.tower_name,
        etlUnitConfigs: item.etl_unit_configs,
        towerDoorNo: '',
        minFloor: 0,
        maxFloor: 0,
        validTowerUnits: null,
        groundFloorName: '',
        groundFloorUnitNoMin: 0,
        groundFloorUnitNoMax: 0,
        typicalFloorUnitNoMin: 0,
        typicalFloorUnitNoMax: 0,
        deleteFullUnitNos: '',
        exceptionUnitNos: '',
      };
    });
    setTowersDataRera(towersData);
  }
  function setMandalVillageSuggestion(
    e: {
      label: string;
      value: number;
    }[]
  ) {
    const projectIds = e.map((item) => item.value);
    const mandals: string[] = [];
    const villages: string[] = [];
    projectMVDetails.map((item) => {
      if (projectIds.includes(item.id)) {
        mandals.push(
          `${item.mandal_id === -1 ? 'NULL' : item.mandal_id}:${item.mandal_name}`
        );
        villages.push(
          `${item.village_id === -1 ? 'NULL' : item.village_id}:${item.village_name}`
        );
      }
    });
    updateProjectFormDataRera({ mandalSuggestion: mandals });
    updateProjectFormDataRera({ villageSuggestion: villages });
  }
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={districtOptions || undefined}
          isLoading={loadingDistricts}
          value={projectFormDataRera.district}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateProjectFormDataRera({ district: e, mandal: null });
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Mandal:</span>
        <div className='flex w-full flex-[5]'>
          <Select
            className='w-full flex-1'
            key={'mandal'}
            options={mandalData?.mandalOptions || undefined}
            isLoading={loadingMandalsData}
            value={projectFormDataRera.mandal}
            onChange={(e) => {
              updateProjectFormDataRera({ mandal: e, village: null });
            }}
            isDisabled={Boolean(!projectFormDataRera.district)}
          />
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
            <span>{projectFormDataRera.mandalSuggestion.join(', ')}</span>
          </span>
        </div>
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Village:</span>
        <div className='flex w-full flex-[5]'>
          <Select
            className='w-full flex-1'
            key={'village'}
            options={villageOptions || undefined}
            isLoading={loadingVillages}
            value={projectFormDataRera.village}
            onChange={(e) => {
              updateProjectFormDataRera({ village: e });
            }}
            isDisabled={Boolean(!projectFormDataRera.mandal)}
          />
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
            <span>{projectFormDataRera.villageSuggestion.join(', ')}</span>
          </span>
        </div>
      </label>
      {projectFormDataRera.isRERAProject && (
        <>
          <div className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>Select Projects:</span>
            <div className='flex flex-[5] items-center gap-5'>
              <MultiSelect
                className='w-full'
                options={projectOptions || []}
                isLoading={loadingProjects}
                value={projectFormDataRera.projects}
                onChange={(
                  e: {
                    label: string;
                    value: number;
                  }[]
                ) => {
                  updateProjectFormDataRera({ projects: e });
                  setMandalVillageSuggestion(e);
                }}
                labelledBy={'projects'}
                isCreatable={false}
                hasSelectAll={true}
                disabled={Boolean(!projectFormDataRera.district)}
                valueRenderer={(selected, _options) => {
                  return selected.length
                    ? selected.map(({ label }) => label)
                    : '';
                }}
              />
              <button
                className='btn-rezy-sm'
                type='button'
                disabled={Boolean(!projectFormDataRera.projects.length)}
                onClick={fetchProjectsDetails}
              >
                Fetch
              </button>
              <span
                className={`badge aspect-square h-10 rounded-full bg-violet-300 ${projectOptions?.length > 100 ? 'text-base' : 'text-lg'} `}
              >
                {projectOptions?.length}
              </span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>Assign Main Project Name:</span>
            <div className='flex w-full flex-[5] items-center gap-5'>
              <input
                className={`${inputBoxClass} !ml-0`}
                name='mainProjectName'
                onChange={(e) => setMainProject(e.target.value)}
              />
              <button
                className='btn-rezy-sm'
                type='button'
                disabled={Boolean(
                  !(mainProject.trim().length > 3) ||
                    !projectFormDataRera.projects.length
                )}
                onClick={() => postMainProject()}
              >
                Save
              </button>
            </div>
          </div>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Project IDs:</span>
            </span>
            <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
              <span>{projectFormDataRera.projectIds.join(', ')}</span>
            </span>
          </label>
        </>
      )}
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Name:</span>
        <input
          className={inputBoxClass}
          name='projectName'
          value={projectFormDataRera.projectName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Layout Name:</span>
        <input
          className={inputBoxClass}
          name='layoutName'
          defaultValue={projectFormDataRera.layoutName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Developers:</span>
        <input
          className={inputBoxClass}
          name='developer'
          defaultValue={projectFormDataRera.developer}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Developer Group:</span>
        <input
          className={inputBoxClass}
          name='developerGroup'
          defaultValue={projectFormDataRera.developerGroup}
          onChange={handleChange}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Type:</span>
        <div className='flex w-full flex-[5]'>
          <Select
            className='w-full flex-1'
            options={[
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              {
                label: 'Mixed Development (Residential & Commercial)',
                value: 'mixed',
              },
            ]}
            value={projectFormDataRera.projectType}
            onChange={(
              e: SingleValue<{
                label: string;
                value: string;
              }>
            ) => {
              updateProjectFormDataRera({ projectType: e });
              if (e?.value === 'residential') {
                updateProjectFormDataRera({
                  towerTypeOptions: [
                    { label: 'Apartment', value: 'apartment' },
                    { label: 'Apartment-Single', value: 'apartmentSingle' },
                    { label: 'Villa', value: 'villa' },
                    { label: 'Mixed', value: 'mixed' },
                  ],
                });
                updateProjectFormDataRera({
                  projectSubTypeOptions: [
                    { label: 'Gated', value: 'gated' },
                    { label: 'Standalone', value: 'standalone' },
                  ],
                });
              } else if (e?.value === 'commercial') {
                updateProjectFormDataRera({
                  towerTypeOptions: [
                    { label: 'Office', value: 'Office' },
                    { label: 'Mall', value: 'Mall' },
                    { label: 'Hotel', value: 'Hotel' },
                    { label: 'Other', value: 'Other' },
                  ],
                });
                updateProjectFormDataRera({
                  projectSubTypeOptions: [
                    { label: 'SEZ Layout', value: 'SEZ Layout' },
                    { label: 'Regular Layout', value: 'Regular Layout' },
                    { label: 'SEZ Standalone', value: 'SEZ Standalone' },
                    {
                      label: 'Regular Standalone',
                      value: 'Regular Standalone',
                    },
                  ],
                });
              } else if (e?.value === 'mixed') {
                updateProjectFormDataRera({
                  projectSubTypeOptions: undefined,
                });
                updateProjectFormDataRera({
                  towerTypeOptions: undefined,
                });
              }
              updateProjectFormDataRera({ projectType: e });
            }}
            name='projectType'
          />
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
            <span>{projectFormDataRera.projectTypeSuggestion.join(', ')}</span>
          </span>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Sub-Type:</span>
        <div className='flex w-full flex-[5]'>
          <Select
            className='w-full flex-1'
            name='projectSubType2'
            options={projectFormDataRera.projectSubTypeOptions}
            defaultValue={projectFormDataRera.projectSubType}
            onChange={(
              e: SingleValue<{
                label: string;
                value: string;
              }>
            ) => updateProjectFormDataRera({ projectSubType: e })}
          />
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
            <span>
              {projectFormDataRera.projectSubTypeSuggestion.join(', ')}
            </span>
          </span>
        </div>
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Description:</span>
        <textarea
          rows={6}
          className={inputBoxClass}
          name='projectDesc'
          value={projectFormDataRera.projectDesc}
          onChange={(e) =>
            updateProjectFormDataRera({ projectDesc: e.target.value })
          }
          placeholder='Add description here...'
        ></textarea>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Amenities Tags:</span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={amenitiesOptions || []}
          isLoading={loadingAmenities}
          value={projectFormDataRera.amenitiesTags}
          isClearable
          isMulti
          instanceId={useId()}
          onChange={(
            e: MultiValue<{
              label: string;
              value: string | number;
              __isNew__?: boolean | undefined;
            }>
          ) => {
            updateProjectFormDataRera({
              amenitiesTags: e,
            });
          }}
        />
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Upload KML File:</span>
        <input
          type='file'
          name='kmlFile'
          accept='.kml'
          className='file-input input-bordered ml-[6px] w-full flex-[5]'
          onChange={async (e) => {
            const text = await extractKMLCoordinates(e);
            updateProjectFormDataRera({ projectCoordinates: text });
          }}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Coordinates:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectCoordinates'
          value={projectFormDataRera.projectCoordinates}
          onChange={() => {}}
        />
      </label>
      <DocsETLTagData
        villageOptions={villageOptions}
        loadingVillages={loadingVillages}
      />
      <ProjectMatcherSection
        formData={projectFormDataRera}
        updateFormData={updateProjectFormDataRera}
      />
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import React, { useEffect, useState } from 'react';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import ETLTagData from './ETLTagData';
import axiosClient from '@/utils/AxiosClient';
import { MultiSelect } from 'react-multi-select-component';
import { startCase } from 'lodash';
import { extractKMLCoordinates } from '@/utils/extractKMLCoordinates';
import toast from 'react-hot-toast';
import { uniq } from 'lodash';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';
import ChipInput from '@/components/ui/Chip';
import { useReraDocStore } from '@/store/useReraDocStore';

const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';

export default function ProjectForm() {
  const {
    projectFormDataRera,
    updateProjectFormDataRera,
    resetProjectFormDataRera,
  } = useProjectStoreRera();
  const {
    addEtlUnitConfigRera,
    addNewTowerDataRera,
    deleteEtlUnitConfigRera,
    deleteTowerFormDataRera,
    resetTowerFormDataRera,
    towerFormDataRera,
    updateTowerFormDataRera,
    setTowersDataRera,
  } = useTowerStoreRera();
  const { resetReraDocs } = useReraDocStore();
  const [mainProject, setMainProject] = useState<string>('');

  async function fetchDropdownOption(
    type: 'districts' | 'mandals' | 'villages' | 'projects',
    params?: object
  ) {
    if (params !== undefined && type !== 'projects') {
      const res = await axiosClient.get<{
        data: { name: string }[];
        message: string;
        statusCode: number;
      }>(`/forms/rera/get${startCase(type)}`, { params: params });
      const options = res?.data?.data;
      const dropdownOptions = options.map((item) => {
        return { value: item.name, label: startCase(item.name.toLowerCase()) };
      });
      return dropdownOptions;
    } else if (type === 'projects') {
      const res = await axiosClient.get<{
        data: { id: string; project_name: string }[];
        message: string;
        statusCode: number;
      }>(`/forms/rera/get${startCase(type)}`, { params: params });
      const options = res?.data?.data;
      const dropdownOptions = options.map((item) => {
        return {
          value: item.id,
          label: `${item.id}:${startCase(item.project_name.toLowerCase())}`,
        };
      });
      return dropdownOptions;
    } else {
      const res = await axiosClient.get<{
        data: { name: string }[];
        message: string;
        statusCode: number;
      }>(`/forms/rera/get${startCase(type)}`);
      const options = res?.data?.data;
      const dropdownOptions = options.map((item) => {
        return { value: item.name, label: startCase(item.name.toLowerCase()) };
      });
      return dropdownOptions;
    }
  }

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
  const {
    isPending: loadingDistricts,
    error: distError,
    status: districtCallStatus,
    data: districtOptions,
  } = useQuery({
    queryKey: ['district'],
    queryFn: () => {
      return fetchDropdownOption('districts');
    },
    staleTime: Infinity,
  });

  // mandal dropdown
  const {
    isPending: loadingMandals,
    error: mandalError,
    status: mandalCallStatus,
    data: mandalOptions,
  } = useQuery({
    queryKey: ['mandal', projectFormDataRera.district],
    queryFn: () => {
      if (
        projectFormDataRera.district !== undefined &&
        projectFormDataRera.district !== null
      ) {
        return fetchDropdownOption('mandals', {
          district: projectFormDataRera.district?.value,
        });
      }
    },
    staleTime: Infinity,
  });

  //   village dropdown
  const {
    isPending: loadingVillages,
    error: villageError,
    status: villageCallStatus,
    data: villageOptions,
  } = useQuery({
    queryKey: ['village', projectFormDataRera.mandal],
    queryFn: () => {
      if (
        projectFormDataRera.mandal !== undefined &&
        projectFormDataRera.mandal !== null
      ) {
        return fetchDropdownOption('villages', {
          district: projectFormDataRera.district?.value,
          mandal: projectFormDataRera.mandal?.value,
        });
      }
    },
    staleTime: Infinity,
  });

  //   projects dropdown
  const {
    isPending: loadingProjects,
    error: projectLoadingError,
    status: projectCallStatus,
    data: projectOptions,
  } = useQuery({
    queryKey: ['project', projectFormDataRera.village],
    queryFn: () => {
      if (
        projectFormDataRera.mandal !== undefined &&
        projectFormDataRera.mandal !== null &&
        projectFormDataRera.village !== undefined &&
        projectFormDataRera.village !== null
      ) {
        return fetchDropdownOption('projects', {
          district: projectFormDataRera.district?.value,
          mandal: projectFormDataRera.mandal?.value,
          village: projectFormDataRera.village?.value,
        });
      }
    },
    staleTime: Infinity,
  });

  //   useEffect(() => {
  //     updateProjectFormDataRera({ village: null });
  //   }, [projectFormDataRera.mandal]);

  //   useEffect(() => {
  //     updateProjectFormDataRera({ projects: [] });
  //   }, [projectFormDataRera.village]);

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
    updateProjectFormDataRera({
      projectIds: uniq(data.map((item) => +item.project_id)),
      developers: uniq(data.map((item) => item.developer_name)),
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
        towerId: item.tower_id,
        towerTypeSuggestion: item.tower_type,
        towerType: {
          label: '',
          value: '',
        },
        towerName: item.tower_name,
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
  useEffect(() => {
    console.log(projectFormDataRera.village);
  });
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex items-center justify-between gap-5 '>
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
              value: string;
            }>
          ) => {
            updateProjectFormDataRera({ district: e, mandal: null });
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5 '>
        <span className='flex-[2] text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={mandalOptions || undefined}
          isLoading={loadingMandals}
          value={projectFormDataRera.mandal}
          onChange={(e) => {
            updateProjectFormDataRera({ mandal: e, village: null });
          }}
          isDisabled={Boolean(!projectFormDataRera.district)}
        />
      </label>
      <label className='flex items-center justify-between gap-5 '>
        <span className='flex-[2] text-xl'>Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          options={villageOptions || undefined}
          isLoading={loadingVillages}
          value={projectFormDataRera.village}
          onChange={(e) => {
            updateProjectFormDataRera({ village: e });
          }}
          isDisabled={Boolean(!projectFormDataRera.mandal)}
        />
      </label>
      <div className='flex items-center justify-between gap-5 '>
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
                value: string;
              }[]
            ) => {
              updateProjectFormDataRera({ projects: e });
            }}
            labelledBy={'projects'}
            isCreatable={false}
            hasSelectAll={true}
            disabled={Boolean(!projectFormDataRera.village)}
            valueRenderer={(selected, _options) => {
              return selected.length ? selected.map(({ label }) => label) : '';
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
        </div>
      </div>
      <div className='flex items-center justify-between gap-5 '>
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
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Project IDs:</span>
        </span>
        <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
          <span>{projectFormDataRera.projectIds.join(', ')}</span>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developers:</span>
        <ChipInput
          chips={projectFormDataRera.developers}
          updateFormData={updateProjectFormDataRera}
          updateKey='developers'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developer Group:</span>
        <input
          className={inputBoxClass}
          name='developerGroup'
          defaultValue={projectFormDataRera.developerGroup}
          onChange={handleChange}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Type:</span>
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
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
            <span>{projectFormDataRera.projectTypeSuggestion.join(', ')}</span>
          </span>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub-Type:</span>
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
          <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
            <span>
              {projectFormDataRera.projectSubTypeSuggestion.join(', ')}
            </span>
          </span>
        </div>
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Description:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectDesc'
          defaultValue={projectFormDataRera.projectDesc}
          onChange={handleChange}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Amenities Tags:</span>
        {amenitiesOptions && amenitiesOptions.length > 0 && (
          <MultiSelect
            className='w-full flex-[5]'
            options={amenitiesOptions}
            isLoading={loadingAmenities}
            value={projectFormDataRera.amenitiesTags}
            onChange={(
              e: {
                label: string;
                value: string;
                __isNew__?: boolean | undefined;
              }[]
            ) => {
              updateProjectFormDataRera({
                amenitiesTags: e,
              });
            }}
            labelledBy={'amenitiesTags'}
            isCreatable={true}
            hasSelectAll={false}
          />
        )}
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Upload KML File:</span>
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
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Coordinates:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectCoordinates'
          value={projectFormDataRera.projectCoordinates}
          onChange={(e) => {}}
        />
      </label>
      <ETLTagData />
    </>
  );
}

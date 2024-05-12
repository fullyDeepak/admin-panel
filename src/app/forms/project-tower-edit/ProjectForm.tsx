import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import axiosClient from '@/utils/AxiosClient';
import {
  EditProjectTaggingType,
  useEditProjectStore,
} from '@/store/useEditProjectStore';
import { editTowerDetail, useEditTowerStore } from '@/store/useEditTowerStore';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import { MultiSelect } from 'react-multi-select-component';
import { GetProjectDetails } from '@/types/types';
import ETLTagData from '@/components/forms/ETLTagData';
import { inputBoxClass } from '@/app/constants/tw-class';

export default function ProjectForm() {
  const {
    editProjectFormData,
    updateEditProjectFormData,
    resetEditProjectFormData,
    updateOldProjectFormData,
  } = useEditProjectStore();
  const { setNewTowerEditData, setOldTowerEditData } = useEditTowerStore();

  // populate project dropdown
  useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get('/projects');
        const options = res.data.data.map(
          (item: { id: Number; project_name: String }) => ({
            value: item.id,
            label: `${item.id}:${item.project_name}`,
          })
        );
        updateEditProjectFormData({ selectedProjectOption: options });
        return options;
      } catch (error) {
        console.log(error);
      }
    },
  });

  //   populated amenities options
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
    refetchOnWindowFocus: false,
  });

  //   populated localities options
  const { data: localitiesOptions, isLoading: loadingLocalities } = useQuery({
    queryKey: ['localitiesOptions'],
    queryFn: async () => {
      const response = await axiosClient.get<{
        data: string[];
      }>('/forms/localities');
      const localities = response.data.data;
      const localitiesOptions: {
        label: string;
        value: string;
      }[] = [];
      localities.map((item) => {
        if (item.length > 2) {
          localitiesOptions.push({
            label: item,
            value: item,
          });
        }
      });
      console.log({ localitiesOptions });
      return localitiesOptions;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // populate village option
  const { isPending: loadingVillages, data: villageOptions } = useQuery({
    queryKey: ['village'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/forms/getOnboardedDMV');
        const data = response.data.data;
        const newData = [];
        for (const district of data) {
          for (const subDistrict of district.districts.districts) {
            for (const mandal of subDistrict.mandals) {
              for (const village of mandal.villages) {
                newData.push({
                  value: village.village_id,
                  label: `${(subDistrict.district_name as string).charAt(0).toUpperCase() + (subDistrict.district_name as string).slice(1).toLowerCase()}-${(mandal.mandal_name as string).charAt(0).toUpperCase() + (mandal.mandal_name as string).slice(1).toLowerCase()}-${(village.village_name as string).charAt(0).toUpperCase() + (village.village_name as string).slice(1).toLowerCase()}`,
                });
              }
            }
          }
        }
        return newData;
      } catch (error) {
        return [];
      }
    },
    staleTime: Infinity,
  });

  // populate form fields
  useQuery({
    queryKey: ['project', editProjectFormData.selectedProject],
    queryFn: async () => {
      try {
        if (editProjectFormData.selectedProject) {
          const res = await axiosClient.get<{ data: GetProjectDetails }>(
            `/projects/${editProjectFormData.selectedProject}`
          );
          const projectData = res.data.data;
          console.log(projectData);
          const towerDataRes = projectData.towers;
          const towerData: editTowerDetail[] = towerDataRes.map(
            (item, index) => ({
              id: index + 1,
              towerId: item.tower_id,
              projectPhase: +item.phase,
              reraId: item.rera_id,
              towerType: item.type,
              towerName: item.name,
              etlUnitConfigs: item.unit_configs.map((unit) => ({
                configName: unit.config,
                minArea: unit.min_built,
                maxArea: unit.max_built,
              })),
              minFloor: item.min_floor,
              maxFloor: item.max_floor,
              groundFloorName: item.ground_floor_name,
              deleteFullUnitNos: item.delete_full_unit_nos,
              exceptionUnitNos: item.exception_unit_nos,
              groundFloorUnitNoMax: item.ground_floor_unit_no_max,
              groundFloorUnitNoMin: item.ground_floor_unit_no_min,
              typicalFloorUnitNoMax: item.typical_floor_unit_no_max,
              typicalFloorUnitNoMin: item.typical_floor_unit_no_min,
              towerDoorNo: item.tower_door_no,
              validTowerUnits: null,
            })
          );
          console.log(towerData);
          setNewTowerEditData(towerData);
          setOldTowerEditData(towerData);
          const surveyEquals = projectData?.survey_equals;
          const surveyContains = projectData?.survey_contains;
          const plotEquals = projectData?.plot_equals;
          const amenities = projectData.amenities.map(
            (item: { id: number; amenity: string }) => ({
              label: item.amenity,
              value: item.id,
            })
          );

          const localities: {
            label: string;
            value: string;
          }[] = JSON.parse(projectData?.localities || '[]')?.map(
            (locality: string) => ({
              label: locality,
              value: locality,
            })
          );
          const localityWbPlot: {
            locality_contains: string[];
            ward_block: string[];
            locality_plot: string[];
          } =
            projectData.locality_wb_plot.length > 0
              ? JSON.parse(projectData.locality_wb_plot[0])
              : {
                  locality_contains: [],
                  ward_block: [],
                  locality_plot: [],
                };
          const projectFormData: Partial<EditProjectTaggingType> = {
            village_id: projectData.village_id,
            projectName: projectData.project_name,
            developerGroup: projectData.developer_group_name,
            developer: projectData.developer_name,
            layoutName: projectData.project_layout,
            projectDesc: projectData.project_description,
            projectType: projectData.project_category,
            projectSubType: projectData.project_subtype,
            surveyContains: surveyContains || [],
            surveyEquals: surveyEquals || [],
            plotEquals: plotEquals || [],
            amenitiesTags: amenities,
            apartmentContains: projectData.apartment_contains || [],
            counterpartyContains: projectData.counterparty_contains || [],
            aptSurveyPlotDetails: projectData.aptsurveyplotdetails,
            aptNameNotContains: projectData.apt_name_not_contains,
            counterpartySurveyPlotDetails:
              projectData.counterpartysurveyplotdetails,
            docId: projectData.doc_id,
            doorNoStartWith: projectData.door_no_start,
            rootDocs: projectData.linked_doc,
            plotContains: projectData.plot_contains,
            localityContains: localityWbPlot.locality_contains,
            localityPlot: localityWbPlot.locality_plot,
            wardBlock: localityWbPlot.ward_block,
            singleUnit: projectData?.single_unit,
            towerPattern: projectData?.tower_pattern || '',
            floorPattern: projectData?.floor_pattern || '',
            unitPattern: projectData?.unit_pattern || '',
            localities: localities || [],
          };
          updateEditProjectFormData(projectFormData);
          updateOldProjectFormData(projectFormData);
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: Infinity,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEditProjectFormData({ [name]: value });
  };

  useEffect(() => {
    if (editProjectFormData.projectType === 'residential') {
      updateEditProjectFormData({
        towerTypeOptions: [
          { label: 'Apartment', value: 'apartment' },
          { label: 'Apartment - Single', value: 'apartmentSingle' },
          { label: 'Villa', value: 'villa' },
          { label: 'Mixed', value: 'mixed' },
        ],
      });
      updateEditProjectFormData({
        projectSubTypeOptions: [
          { label: 'Gated', value: 'gated' },
          { label: 'Standalone', value: 'standalone' },
        ],
      });
    } else if (editProjectFormData.projectType === 'commercial') {
      updateEditProjectFormData({
        towerTypeOptions: [
          { label: 'Office', value: 'Office' },
          { label: 'Mall', value: 'Mall' },
          { label: 'Hotel', value: 'Hotel' },
          { label: 'Other', value: 'Other' },
        ],
      });
      updateEditProjectFormData({
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
    } else if (editProjectFormData.projectType === 'mixed') {
      updateEditProjectFormData({
        projectSubTypeOptions: undefined,
      });
      updateEditProjectFormData({
        towerTypeOptions: undefined,
      });
    }
  }, [editProjectFormData.projectType]);

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Select Project to Edit:</span>
        <span className='flex w-full flex-[5] items-center gap-5'>
          <Select
            showSearch
            animation='slide-up'
            optionFilterProp='desc'
            value={editProjectFormData.selectedProject}
            onChange={(e) => updateEditProjectFormData({ selectedProject: e })}
            placeholder='Select Project Id and Name'
            className='rounded-full'
          >
            {editProjectFormData.selectedProjectOption.map((item, i) => (
              <Option
                key={i}
                value={item.value}
                className='cursor-pointer'
                desc={item.label}
              >
                {item.label}
              </Option>
            ))}
          </Select>
          {editProjectFormData.projectName && (
            <button
              type='button'
              className='btn btn-error  btn-xs rounded-full text-white'
              onClick={() =>
                (
                  document.getElementById(
                    'project-delete-modal'
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              Delete
            </button>
          )}
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Select Village:</span>
        <span className='w-full flex-[5]'>
          <Select
            showSearch
            animation='slide-up'
            optionFilterProp='desc'
            value={editProjectFormData.village_id || undefined}
            onChange={(e) => updateEditProjectFormData({ village_id: e })}
            placeholder='Select Village'
          >
            {villageOptions?.map((item, i) => (
              <Option
                key={i}
                value={item.value}
                className='cursor-pointer'
                desc={item.label}
              >
                {item.label}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Name:</span>
        <input
          className={inputBoxClass}
          name='projectName'
          defaultValue={editProjectFormData.projectName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Layout Name:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='layoutName'
          defaultValue={editProjectFormData.layoutName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developer:</span>
        <input
          className={inputBoxClass}
          name='developer'
          defaultValue={editProjectFormData.developer}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developer Group:</span>
        <input
          className={inputBoxClass}
          name='developerGroup'
          defaultValue={editProjectFormData.developerGroup}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Type:</span>
        <span className='w-full flex-[5] pl-2'>
          <Select
            value={editProjectFormData.projectType}
            onChange={(e) => {
              updateEditProjectFormData({ projectType: e });
            }}
          >
            {[
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Mixed', value: 'mixed' },
            ].map((option, index) => (
              <Option
                key={index}
                value={option.value}
                className='cursor-pointer'
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub Type:</span>
        <span className='w-full flex-[5] pl-2'>
          <Select
            onChange={(e) => updateEditProjectFormData({ projectSubType: e })}
            value={editProjectFormData.projectSubType}
            className='w-full'
          >
            {editProjectFormData.projectSubTypeOptions.map((option, index) => (
              <Option
                key={index}
                value={option.value}
                className='cursor-pointer'
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Description:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectDesc'
          defaultValue={editProjectFormData.projectDesc}
          onChange={handleChange}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Amenities Tags:</span>
        <MultiSelect
          className='w-full flex-[5]'
          options={amenitiesOptions || []}
          isLoading={loadingAmenities}
          value={editProjectFormData.amenitiesTags}
          onChange={(
            e: {
              label: string;
              value: string;
              __isNew__?: boolean | undefined;
            }[]
          ) => {
            updateEditProjectFormData({
              amenitiesTags: e,
            });
            console.log(e);
          }}
          labelledBy={'amenitiesTags'}
          isCreatable={true}
          hasSelectAll={false}
        />
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Localities:</span>
        <MultiSelect
          className='w-full flex-[5]'
          options={localitiesOptions || []}
          isLoading={loadingLocalities}
          value={editProjectFormData.localities}
          onChange={(
            e: {
              label: string;
              value: string;
            }[]
          ) => {
            updateEditProjectFormData({
              localities: e,
            });
          }}
          labelledBy={'amenitiesTags'}
          isCreatable={false}
          hasSelectAll={false}
        />
      </div>
      <ETLTagData
        formData={editProjectFormData}
        updateFormData={updateEditProjectFormData}
      />
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import ETLTagData from './ETLTagData';
import axiosClient from '@/utils/AxiosClient';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import { useEditTowerStore } from '@/store/useEditTowerStore';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import { MultiSelect } from 'react-multi-select-component';

const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';

export default function ProjectForm() {
  const {
    editProjectFormData,
    updateEditProjectFormData,
    resetEditProjectFormData,
  } = useEditProjectStore();
  const { setNewTowerEditData } = useEditTowerStore();

  // populate project dropdown
  const { isPending: loadingProjects, data: projectOptions } = useQuery({
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

  // populate form fields
  useQuery({
    queryKey: ['project', editProjectFormData.selectedProject],
    queryFn: async () => {
      try {
        if (editProjectFormData.selectedProject) {
          const res = await axiosClient.get(
            `/projects/${editProjectFormData.selectedProject}`
          );
          const projectData = res.data.data;
          console.log(projectData);
          const towerDataRes: {
            name: string;
            type: string;
            phase: number;
            rera_id: string;
            tower_id: number;
            unit_configs: {
              id: number;
              config: string;
              tower_id: number;
              max_built: number;
              min_built: number;
              project_id: number;
            }[];
          }[] = projectData.towers;
          const towerData = towerDataRes.map((item, index) => ({
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
          }));
          console.log(towerData);
          setNewTowerEditData(towerData);
          const surveyContains: string[] = [];
          const surveyEqual: string[] = [];
          const plotEqual: string[] = [];
          projectData?.surveys?.map(
            (item: {
              surveys: {
                type: 'CONTAINS' | 'EQUALS';
                surveys: string[];
              };
            }) => {
              if (
                item.surveys.type === 'CONTAINS' &&
                item.surveys.surveys.length > 0
              ) {
                for (const iterator of item.surveys.surveys) {
                  surveyContains.push(iterator);
                }
              }
              if (
                item.surveys.type === 'EQUALS' &&
                item.surveys.surveys.length > 0
              ) {
                for (const iterator of item.surveys.surveys) {
                  surveyEqual.push(iterator);
                }
              }
            }
          );
          projectData?.plots?.map(
            (item: {
              plots: {
                type: 'EQUALS';
                plots: string[];
              };
            }) => {
              if (item.plots.type === 'EQUALS' && item.plots.plots.length > 0) {
                for (const iterator of item.plots.plots) {
                  plotEqual.push(iterator);
                }
              }
            }
          );
          const amenities = projectData.amenities.map(
            (item: { id: number; amenity: string }) => ({
              label: item.amenity,
              value: item.id,
            })
          );
          updateEditProjectFormData({
            village_id: projectData.village_id,
            projectName: projectData.project_name,
            developerGroup: projectData.developer_group_name,
            developer: projectData.developer_name,
            layoutName: projectData.project_layout,
            projectDesc: projectData.project_description,
            projectType: projectData.project_category,
            projectSubType: projectData.project_subtype,
            surveyContains: surveyContains,
            surveyEqual: surveyEqual,
            plotEqual: plotEqual,
            amenitiesTags: amenities,
            apartmentContains: projectData.apartment_contains || [],
            counterpartyContains: projectData.counterparty_contains || [],
          });
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
        <span className='w-full flex-[5]'>
          <Select
            showSearch
            animation='slide-up'
            optionFilterProp='label'
            value={editProjectFormData.selectedProject}
            onChange={(e) => updateEditProjectFormData({ selectedProject: e })}
            options={editProjectFormData.selectedProjectOption}
            placeholder='Select Project Id and Name'
          />
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Village ID:</span>
        <span className='w-full flex-[5] pl-2 font-semibold'>
          {editProjectFormData.village_id}
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
        <span className='w-full flex-[5] pl-2 font-semibold'>
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
              <Option key={index} value={option.value}>
                {option.value}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub Type:</span>
        <span className='w-full flex-[5] pl-2 font-semibold'>
          <Select
            onChange={(e) => updateEditProjectFormData({ projectSubType: e })}
            value={editProjectFormData.projectSubType}
            className='w-full'
          >
            {editProjectFormData.projectSubTypeOptions.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.value}
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
        {amenitiesOptions && amenitiesOptions.length > 0 && (
          <MultiSelect
            className='w-full flex-[2]'
            options={amenitiesOptions}
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
        )}
      </div>
      <ETLTagData />
    </>
  );
}

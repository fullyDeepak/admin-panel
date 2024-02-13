import { useQuery } from '@tanstack/react-query';
import { XMLParser } from 'fast-xml-parser';
import Select, { SingleValue } from 'react-select';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ChipInput from './Chip';
import ETLTagData from './ETLTagData';
import axiosClient from '@/utils/AxiosClient';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import { useEditTowerStore } from '@/store/useEditTowerStore';

const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';

export default function ProjectForm() {
  const { editProjectFormData, updateEditProjectFormData } =
    useEditProjectStore();
  const { setNewTowerEditData } = useEditTowerStore();
  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    value: number;
  } | null>();

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
        return options;
      } catch (error) {
        console.log(error);
      }
    },
  });

  // populate form fields
  useQuery({
    queryKey: ['project', selectedProject?.value],
    queryFn: async () => {
      try {
        if (selectedProject) {
          const res = await axiosClient.get(
            `/projects/${selectedProject?.value}`
          );
          const projectData = res.data.data[0];
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
          updateEditProjectFormData({
            projectName: projectData.project_name,
            developerGroup: projectData.developer_group_name,
            developer: projectData.developer_name,
            projectDesc: projectData.project_description,
            projectType: projectData.project_category,
            projectSubType: projectData.project_subtype,
            surveyContains: surveyContains,
            surveyEqual: surveyEqual,
            plotEqual: plotEqual,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEditProjectFormData({ [name]: value });
  };

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Select Project to Edit:</span>
        <Select
          className='w-full flex-[5]'
          name='village_id'
          key={'village'}
          options={projectOptions}
          isLoading={loadingProjects}
          required={true}
          value={selectedProject}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setSelectedProject(e);
          }}
        />
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
          {editProjectFormData.projectType}
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub Type:</span>
        <span className='w-full flex-[5] pl-2 font-semibold'>
          {editProjectFormData.projectSubType}
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
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Amenities Tags:</span>
        <ChipInput
          chips={editProjectFormData.amenitiesTags}
          updateFormData={updateEditProjectFormData}
          updateKey='amenitiesTags'
        />
      </label>
      <ETLTagData />
    </>
  );
}

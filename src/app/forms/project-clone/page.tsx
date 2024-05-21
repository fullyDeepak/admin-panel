'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactSelect, { SingleValue } from 'react-select';
import Select from 'rc-select';
import 'rc-select/assets/index.css';
import { usePathname } from 'next/navigation';
import ChipInput from '@/components/ui/Chip';

export default function ProjectClonePage() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [selectedVillage, setSelectedVillage] = useState<
    SingleValue<{
      label: string;
      value: number;
    }>
  >();
  const [plotEqual, setPlotEqual] = useState<{
    plotEqual: string[];
  }>({
    plotEqual: [],
  });
  const [surveyEqual, setSurveyEqual] = useState<{
    surveyEqual: string[];
  }>({
    surveyEqual: [],
  });
  const [surveyContains, setSurveyContains] = useState<{
    surveyContains: string[];
  }>({
    surveyContains: [],
  });
  const [selectedProject, setSelectedProject] = useState();
  const [existingEtlData, setExistingEtlData] = useState<{
    villageId: number;
    surveyEqual: string[];
    surveyContains: string[];
    plotEqual: string[];
  }>({ villageId: -1, surveyEqual: [], plotEqual: [], surveyContains: [] });
  let loadingToastId: string;

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
  // populated existing data
  useQuery({
    queryKey: ['project', selectedProject],
    queryFn: async () => {
      try {
        if (selectedProject) {
          const res = await axiosClient.get(`/projects/${selectedProject}`);
          const projectData = res.data.data;
          console.log(projectData);
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
          setExistingEtlData({
            villageId: projectData.village_id,
            plotEqual: plotEqual,
            surveyContains: surveyContains,
            surveyEqual: surveyEqual,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: Infinity,
  });

  const submitForm = async () => {
    toast.loading(`Saving to database.`, {
      id: loadingToastId,
    });
    const data = {
      projectId: selectedProject,
      villageId: selectedVillage?.value,
      surveyContains: surveyContains.surveyContains,
      surveyEqual: surveyEqual.surveyEqual,
      plotEqual: plotEqual.plotEqual,
    };
    try {
      const res = await axiosClient.post('/projects/clone', data);
      if (res.status === 200) {
        toast.dismiss(loadingToastId);
        toast.success(
          `ETL Info added for project id: ${res?.data?.data?.id}.`,
          {
            id: loadingToastId,
            duration: 3000,
          }
        );
        setResponseData(res.data);
      } else {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't add ETL info`, {
          id: loadingToastId,
          duration: 3000,
        });
        setResponseData(res.data);
        return null;
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        setResponseData(errMsg);
        toast.dismiss(loadingToastId);
        toast.error(`Error: ${errMsg}`, {
          id: loadingToastId,
          duration: 3000,
        });
      }
    }
  };
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

  return (
    <div className='mx-auto mt-10 flex w-full flex-col md:w-[80%]'>
      <Toaster />
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Add Additional ETL Tag Data
      </h1>
      <div
        className='mt-5 flex w-full max-w-full  flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerForm'
      >
        <h3 className='my-4 text-2xl font-semibold'>
          Section: Project Details
        </h3>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Select Project to Edit:</span>
          <span className='w-full flex-[5]'>
            <Select
              showSearch
              animation='slide-up'
              optionFilterProp='label'
              value={selectedProject}
              onChange={(e) => setSelectedProject(e)}
              options={projectOptions}
              placeholder='Select Project Id and Name'
            />
          </span>
        </label>
        {selectedProject && selectedProject > 0 && (
          <>
            <div className='divider'>Existing Data</div>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Existing Village Id:</span>
              <span className='w-full flex-[5] pl-2 font-semibold'>
                {existingEtlData.villageId > 0 ? existingEtlData.villageId : ''}
              </span>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Existing Survey Equal:</span>
              <span className='w-full flex-[5] pl-2 font-semibold'>
                {existingEtlData.surveyEqual.join(',')}
              </span>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Existing Survey Contains:</span>
              <span className='w-full flex-[5] pl-2 font-semibold'>
                {existingEtlData.surveyContains.join(',')}
              </span>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Existing Plot Equal:</span>
              <span className='w-full flex-[5] pl-2 font-semibold'>
                {existingEtlData.plotEqual.join(',')}
              </span>
            </label>
            <div className='divider'>Add New Data</div>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>DMV:</span>
              <ReactSelect
                className='w-full flex-[5]'
                name='village_id'
                key={'village'}
                options={villageOptions || undefined}
                isLoading={loadingVillages}
                required={true}
                value={selectedVillage}
                onChange={(
                  e: SingleValue<{
                    label: string;
                    value: number;
                  }>
                ) => {
                  setSelectedVillage(e);
                }}
              />
            </label>{' '}
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Survey Equals:</span>
              {/* <ChipInput
                chips={surveyEqual.surveyEqual}
                updateFormData={setSurveyEqual as (newDetails: object) => void}
                updateKey='surveyEqual'
              /> */}
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Survey Contains:</span>
              {/* <ChipInput
                chips={surveyContains.surveyContains}
                updateFormData={
                  setSurveyContains as (newDetails: object) => void
                }
                updateKey='surveyContains'
              /> */}
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[2] '>Plot Equals:</span>
              {/* <ChipInput
                chips={plotEqual.plotEqual}
                updateFormData={setPlotEqual as (newDetails: object) => void}
                updateKey='plotEqual'
              /> */}
            </label>
            <button className='btn btn-info' onClick={submitForm}>
              Submit
            </button>
          </>
        )}
      </div>
      {responseData && (
        <div className=' flex w-full justify-center'>
          <textarea
            rows={8}
            className='my-10 min-w-[80%] text-wrap rounded-md border-2 border-gray-600 bg-slate-100 p-2 text-center text-xl outline-none'
          >
            {JSON.stringify(responseData)}
          </textarea>
        </div>
      )}
      <div className='mt-40'></div>
    </div>
  );
}

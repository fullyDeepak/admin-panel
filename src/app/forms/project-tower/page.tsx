'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, ReactElement, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import TowerForm from './TowerForm';
import PreviewProjectTower from './PreviewProjectTower';
import { useProjectStore } from '@/store/useProjectStore';
import { useTowerStore } from '@/store/useTowerStore';

export default function page() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [formCount, setFormCount] = useState<number>(0);
  const { projectFormData, resetProjectFormData } = useProjectStore();
  const { towerFormData, resetTowerFormData } = useTowerStore();
  let loadingToastId: string;

  let newProjectFormData: any;
  newProjectFormData = { ...projectFormData };
  delete newProjectFormData.towerTypeOptions;
  delete newProjectFormData.projectSubTypeOptions;
  newProjectFormData.village_id = newProjectFormData.village_id?.value;
  newProjectFormData.projectType = newProjectFormData.projectType?.value;
  newProjectFormData.projectSubType = newProjectFormData.projectSubType?.value;
  let newTowerFormData: any;
  newTowerFormData = towerFormData.map((item) => ({
    ...item,
    towerType: item.towerType?.value,
    etlUnitConfigs: item.etlUnitConfigs.filter(
      (item) => item.configName !== ''
    ),
  }));
  const formsStep: ReactElement[] = [
    <ProjectForm key={1} />,
    <TowerForm key={2} />,
    <PreviewProjectTower
      key={3}
      projectFormData={newProjectFormData}
      towerFormData={newTowerFormData}
    />,
  ];

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    toast.loading(`Saving to database.`, {
      id: loadingToastId,
    });
    e.preventDefault();

    try {
      if (!newProjectFormData.projectName) {
        toast.dismiss(loadingToastId);
        toast.error(`Project name is missing.`, {
          id: loadingToastId,
          duration: 3000,
        });
        return null;
      }
      const projectRes = await axiosClient.post(
        '/projects',
        newProjectFormData
      );
      if (projectRes.status !== 200) {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't get the Project ID.`, {
          id: loadingToastId,
          duration: 3000,
        });
        setResponseData(projectRes.data);
        return null;
      } else {
        toast.dismiss(loadingToastId);
        toast.success(`Project added to database.`, {
          id: loadingToastId,
          duration: 3000,
        });
        setResponseData(projectRes.data);
      }
      const projectID = projectRes.data.data.id;
      const towerData = {
        projectId: projectID,
        towerData: newTowerFormData,
      };
      const towerRes = await axiosClient.post('/projects/tower', towerData);
      if (towerRes.status === 200) {
        setResponseData(
          (prev) => JSON.stringify(prev) + JSON.stringify(projectRes.data)
        );
        toast.success(`Towers details added to database.`, {
          id: loadingToastId,
          duration: 3000,
        });
        resetProjectFormData();
        resetTowerFormData();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        setResponseData((prev) => {
          return JSON.stringify(prev) + JSON.stringify(errMsg);
        });
        toast.dismiss(loadingToastId);
        toast.error(`Error: ${errMsg}`, {
          id: loadingToastId,
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className='mx-auto mt-10 flex w-full flex-col md:w-[80%]'>
      <Toaster />
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Tower Tagging
      </h1>
      <form
        className='mt-5 flex w-full max-w-full  flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerForm'
        onSubmit={submitForm}
      >
        <ul className='steps mb-5'>
          <li className={`${formCount >= 0 ? 'step-error' : ''} step`}>
            Project
          </li>
          <li className={`${formCount >= 1 ? 'step-error' : ''} step`}>
            Tower
          </li>
          <li className={`${formCount >= 2 ? 'step-error' : ''} step`}>
            Final Preview
          </li>
        </ul>
        {formsStep[formCount]}
        <div className='mx-auto flex w-full items-center justify-center gap-10 md:w-[80%] md:gap-40 '>
          <button
            type='button'
            className='btn btn-info btn-sm w-32 text-white md:btn-md'
            disabled={formCount === 0}
            onClick={() => setFormCount((prev) => prev - 1)}
          >
            Previous
          </button>
          {formsStep.length - 1 !== formCount && (
            <button
              type='button'
              className='btn btn-info btn-sm w-32 text-white md:btn-md'
              onClick={() => setFormCount((prev) => prev + 1)}
            >
              Next
            </button>
          )}
          {formsStep.length - 1 === formCount && (
            <button
              className='btn btn-sm w-32 border-none bg-rose-500 text-white md:btn-md hover:bg-red-600'
              disabled={
                projectFormData.village_id && projectFormData.projectName
                  ? false
                  : true
              }
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {responseData && (
        <textarea
          rows={8}
          className='my-10 max-w-[80%] text-wrap text-center text-xl'
        >
          {JSON.stringify(responseData)}
        </textarea>
      )}
      <div className='mt-40'></div>
    </div>
  );
}

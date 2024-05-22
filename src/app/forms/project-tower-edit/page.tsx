'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import TowerForm from './TowerForm';
import PreviewProjectTower from './PreviewProjectTower';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import { useEditTowerStore } from '@/store/useEditTowerStore';
import { usePathname } from 'next/navigation';
import { CgInfo } from 'react-icons/cg';

export default function ProjectTowerEditPage() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [formCount, setFormCount] = useState<number>(0);
  const {
    editProjectFormData,
    resetEditProjectFormData,
    oldProjectFormETLTagData,
    oldProjectFormData,
    projectFormETLTagData,
  } = useEditProjectStore();
  const { editTowerFormData, resetEditTowerFormData, oldTowerFormData } =
    useEditTowerStore();
  useEffect(() => {
    resetEditProjectFormData();
    resetEditTowerFormData();
    (
      document.getElementById('projectTowerEditForm') as HTMLFormElement
    ).reset();
  }, [usePathname]);

  let loadingToastId: string;
  let newProjectFormData: any;
  newProjectFormData = { ...editProjectFormData };
  delete newProjectFormData.selectedProjectOption;
  delete newProjectFormData.projectSubTypeOptions;
  delete newProjectFormData.towerTypeOptions;
  newProjectFormData.localities = newProjectFormData?.localities?.map(
    (item: { value: string; label: string }) => item.value
  );
  let newTowerFormData: any;
  newTowerFormData = editTowerFormData.map((item) => ({
    ...item,
    towerType: item.towerType,
    etlUnitConfigs: item.etlUnitConfigs.filter(
      (item) => item.configName !== ''
    ),
  }));
  let newProjectFormETLTagData = projectFormETLTagData.map((item) => ({
    ...item,
    village: item.village?.value,
  }));
  const formsStep: ReactElement[] = [
    <ProjectForm key={1} />,
    <TowerForm key={2} />,
    <PreviewProjectTower
      key={3}
      projectFormETLTagData={newProjectFormETLTagData}
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
      const ifVillageNull: boolean[] = [];
      newProjectFormETLTagData.map((item) => {
        if (item.village) {
          ifVillageNull.push(true);
        }
      });
      if (newProjectFormETLTagData.length !== ifVillageNull.length) {
        toast.dismiss(loadingToastId);
        toast.error(`You forgot to select Project ETL Village.`, {
          id: loadingToastId,
          duration: 5000,
        });
        return null;
      }

      const ifTowerNameNull: boolean[] = [];
      newTowerFormData.map((item: any) => {
        if (item.towerName) {
          ifTowerNameNull.push(true);
        }
      });
      if (newTowerFormData.length !== ifTowerNameNull.length) {
        toast.dismiss(loadingToastId);
        toast.error(`You forget to write tower name.`, {
          id: loadingToastId,
          duration: 5000,
        });
        return null;
      }

      let modifiedOldProjectFormData = JSON.parse(
        JSON.stringify(oldProjectFormData)
      );
      delete modifiedOldProjectFormData?.selectedProjectOption;
      delete modifiedOldProjectFormData?.projectSubTypeOptions;
      delete modifiedOldProjectFormData?.towerTypeOptions;
      const data = {
        new: {
          projectData: {
            ...newProjectFormData,
            ETLTagData: newProjectFormETLTagData,
          },
          towerData: newTowerFormData,
        },
        old: {
          projectData: {
            ...modifiedOldProjectFormData,
            ETLTagData: oldProjectFormETLTagData,
          },
          towerData: oldTowerFormData,
        },
      };
      console.log(data);
      setResponseData(data);
      const projectRes = await axiosClient.put('/projects', data);
      if (projectRes.status === 200) {
        toast.dismiss(loadingToastId);
        toast.success(`Project update saved to database.`, {
          id: loadingToastId,
          duration: 3000,
        });
        setResponseData(projectRes.data);
        resetEditProjectFormData();
        resetEditTowerFormData();
      } else {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't get the Project ID.`, {
          id: loadingToastId,
          duration: 3000,
        });
        setResponseData(projectRes.data);
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
        setResponseData((prev) => {
          return JSON.stringify(prev) + JSON.stringify(errMsg);
        });
        toast.dismiss(loadingToastId);
        toast.error(`Error: ${errMsg}`, {
          id: loadingToastId,
          duration: 3000,
        });
      } else {
        toast.dismiss(loadingToastId);
        toast.error("Couldn't send data to server.", {
          id: loadingToastId,
          duration: 3000,
        });
      }
    }
  };

  async function projectDelete() {
    toast.loading(`Deleting...`, {
      id: loadingToastId,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const projectId = editProjectFormData.selectedProject;
    const res = await axiosClient.delete(`/projects/${projectId}`);
    if (res.status === 200) {
      toast.dismiss(loadingToastId);
      toast.success('Successfully deleted!', {
        id: loadingToastId,
        duration: 3000,
      });
      resetEditProjectFormData();
      resetEditTowerFormData();
      (
        document.getElementById('projectTowerEditForm') as HTMLFormElement
      ).reset();
      (
        document.getElementById('project-delete-modal') as HTMLDialogElement
      ).close();
    } else {
      toast.dismiss(loadingToastId);
      toast.error('Something went wrong!', {
        id: loadingToastId,
        duration: 3000,
      });
    }
  }

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <Toaster />
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Update Project Tower Tagging Data
      </h1>
      <dialog id='project-delete-modal' className='modal backdrop-blur-sm'>
        <Toaster />
        <div className='modal-box h-[50%]'>
          <div className='flex flex-col items-center  justify-center text-red-500'>
            <CgInfo size={60} />
            <h3 className='text-3xl font-bold '>Danger</h3>
          </div>
          <p className='py-4'>Do you want to delete selected project?</p>
          <div className='flex flex-col gap-3'>
            <div className='flex '>
              <span className='flex-1 font-semibold'>Project ID</span>
              <span className='flex-[2]'>
                {editProjectFormData.selectedProject}
              </span>
            </div>
            <div className='flex'>
              <span className='flex-1 font-semibold'>Project Name</span>
              <span className='flex-[2]'>
                {editProjectFormData.projectName}
              </span>
            </div>
          </div>
          <div className='mt-10 flex justify-evenly'>
            <button
              type='button'
              onClick={() =>
                (
                  document.getElementById(
                    'project-delete-modal'
                  ) as HTMLDialogElement
                ).close()
              }
              className='btn btn-neutral btn-sm'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={projectDelete}
              className='btn btn-error btn-sm text-white'
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
      <form
        className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-16 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerEditForm'
        onSubmit={submitForm}
      >
        <ul className='steps mb-5'>
          <li
            className={`${formCount >= 0 ? 'step-error after:!text-white' : ''} step`}
          >
            Project
          </li>
          <li
            className={`${formCount >= 1 ? 'step-error after:!text-white' : ''} step`}
          >
            Tower
          </li>
          <li
            className={`${formCount >= 2 ? 'step-error after:!text-white' : ''} step`}
          >
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
              disabled={editProjectFormData.projectName ? false : true}
            >
              Submit
            </button>
          )}
        </div>
      </form>
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

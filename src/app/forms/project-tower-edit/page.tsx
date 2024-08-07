'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import TowerForm from './TowerForm';
import PreviewProjectTower from './PreviewProjectTower';
import { useEditProjectStore } from './useEditProjectStore';
import { useEditTowerStore } from './useEditTowerStore';
import { usePathname } from 'next/navigation';
import { CgInfo } from 'react-icons/cg';
import { MdContentCopy } from 'react-icons/md';
import Keywords from './Keywords';
import ProjectStatus from './ProjectStatus';

export default function ProjectTowerEditPage() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [sentData, setSentData] = useState<object | undefined>(undefined);
  const [formCount, setFormCount] = useState<number>(0);
  const {
    editProjectFormData,
    resetEditProjectFormData,
    oldProjectFormETLTagData,
    oldProjectFormData,
    projectFormETLTagData,
    projectBookingStatus,
    projectPricingStatus,
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

  let newProjectFormData: any;
  newProjectFormData = { ...editProjectFormData };
  delete newProjectFormData.selectedProjectOption;
  delete newProjectFormData.projectSubTypeOptions;
  delete newProjectFormData.towerTypeOptions;
  delete newProjectFormData.keywordType;
  newProjectFormData.localities = newProjectFormData?.localities?.map(
    (item: { value: string; label: string }) => item.value
  );
  delete newProjectFormData.selectedProjectStatusTowers;
  delete newProjectFormData.selectedProjectStatusType;
  let newTowerFormData: any;
  newTowerFormData = editTowerFormData.map((item) => ({
    ...item,
    towerType: item.towerType,
    etlUnitConfigs: item.etlUnitConfigs.filter(
      (item) => item.configName !== ''
    ),
  }));
  let newProjectFormETLTagData = projectFormETLTagData?.map((item) => ({
    ...item,
    village: item.village?.value,
  }));
  const formsStep: ReactElement[] = [
    <ProjectForm key={1} />,
    <Keywords key={2} />,
    <TowerForm key={3} />,
    <ProjectStatus key={4} />,
    <PreviewProjectTower
      key={3}
      projectFormETLTagData={newProjectFormETLTagData}
      projectFormData={newProjectFormData}
      towerFormData={newTowerFormData}
      statusData={{ projectBookingStatus, projectPricingStatus }}
    />,
  ];

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!newProjectFormData.projectName) {
        alert(`Project name is missing.`);
        return null;
      }
      const ifVillageNull: boolean[] = [];
      newProjectFormETLTagData?.map((item) => {
        if (item.village) {
          ifVillageNull.push(true);
        }
      });
      if (newProjectFormETLTagData?.length !== ifVillageNull.length) {
        alert(`You forgot to select Project ETL Village.`);
        return null;
      }

      const ifTowerNameNull: boolean[] = [];
      newTowerFormData.map((item: any) => {
        if (item.etlTowerName) {
          ifTowerNameNull.push(true);
        }
      });
      if (newTowerFormData.length !== ifTowerNameNull.length) {
        alert(`You forget to write tower name.`);
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
            localities: modifiedOldProjectFormData?.localities?.map(
              (item: any) => item?.value
            ),
            ETLTagData: oldProjectFormETLTagData?.map((item) => ({
              ...item,
              village: item.village?.value,
            })),
          },
          towerData: oldTowerFormData,
        },
      };
      setSentData(data);

      //project status data

      if (projectBookingStatus.length > 0 || projectPricingStatus.length > 0) {
        const projectStatusPromise = axiosClient.post('/projects/status', {
          projectBookingStatus,
          projectPricingStatus,
        });
        await toast.promise(
          projectStatusPromise,
          {
            loading: 'Saving new Project Status...',
            success: 'New Status saved to database.',
            error: 'Something went wrong',
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
      }

      const projectResPromise = axiosClient.put('/projects', data);
      const projectRes = await toast.promise(
        projectResPromise,
        {
          loading: 'Updating database...',
          success: 'Project update saved to database.',
          error: 'Something went wrong',
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      if (projectRes.status === 200) {
        setResponseData(projectRes.data);
        resetEditProjectFormData();
        resetEditTowerFormData();
      } else {
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
        toast.error(`Error: ${errMsg}`);
      } else {
        toast.error("Couldn't send data to server.");
      }
    }
  };

  async function projectDelete() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const projectId = editProjectFormData.selectedProject;
    const resPromise = axiosClient.delete(`/projects/${projectId}`);

    const response = await toast.promise(
      resPromise,
      {
        loading: 'Deleting...',
        success: 'Successfully deleted.',
        error: 'Something went wrong',
      },
      {
        success: {
          duration: 10000,
        },
      }
    );

    if (response.status === 200) {
      resetEditProjectFormData();
      resetEditTowerFormData();
      (
        document.getElementById('projectTowerEditForm') as HTMLFormElement
      ).reset();
      (
        document.getElementById('project-delete-modal') as HTMLDialogElement
      ).close();
    } else {
      toast.error('Something went wrong!');
    }
  }

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Update Project Tower Tagging Data
      </h1>
      <dialog id='project-delete-modal' className='modal backdrop-blur-sm'>
        <div className='modal-box h-[50%]'>
          <div className='flex flex-col items-center justify-center text-red-500'>
            <CgInfo size={60} />
            <h3 className='text-3xl font-bold'>Danger</h3>
          </div>
          <p className='py-4'>Do you want to delete selected project?</p>
          <div className='flex flex-col gap-3'>
            <div className='flex'>
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
            className={`${formCount >= 0 ? 'step-secondary after:!text-white' : ''} step`}
          >
            Project
          </li>
          <li
            className={`${formCount >= 1 ? 'step-secondary after:!text-white' : ''} step`}
          >
            Keyword
          </li>
          <li
            className={`${formCount >= 2 ? 'step-secondary after:!text-white' : ''} step`}
          >
            Tower
          </li>
          <li
            className={`${formCount >= 3 ? 'step-secondary after:!text-white' : ''} step`}
          >
            Status
          </li>
          <li
            className={`${formCount >= 4 ? 'step-secondary after:!text-white' : ''} step`}
          >
            Final Preview
          </li>
        </ul>
        {formsStep[formCount]}
        <div className='mx-auto flex w-full items-center justify-center gap-10 md:w-[80%] md:gap-40'>
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
              className='btn btn-sm w-32 border-none bg-violet-600 text-white md:btn-md hover:bg-violet-700'
              disabled={editProjectFormData.projectName ? false : true}
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {sentData && (
        <div className='flex flex-col items-center justify-between'>
          <p className='mt-10 text-center text-2xl font-semibold'>Sent Data</p>
          <div className='relative my-10 max-h-[500px] min-w-[80%] max-w-[80%] overflow-y-auto border bg-gray-100 font-mono text-sm'>
            <button
              className='btn btn-circle absolute right-0 top-2 border-none bg-violet-600 text-white hover:bg-violet-700'
              type='button'
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(sentData, null, 2))
              }
            >
              <MdContentCopy size={25} />
            </button>
            <pre className=''>{JSON.stringify(sentData, null, 2)}</pre>
          </div>
        </div>
      )}
      {responseData && (
        <div className='flex flex-col items-center justify-between'>
          <p className='mt-10 text-center text-2xl font-semibold'>
            Response from server
          </p>
          <pre className='my-10 max-h-[500px] w-[80%] min-w-[80%] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
      <div className='mt-40'></div>
    </div>
  );
}

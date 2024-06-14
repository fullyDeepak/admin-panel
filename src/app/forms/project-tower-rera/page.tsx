'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import TowerForm from './TowerForm';
import PreviewProjectTower from './PreviewProjectTower';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';
import { usePathname } from 'next/navigation';
import ProjectStatus from './ProjectStatus';
import { MdContentCopy } from 'react-icons/md';

export default function ProjectTowerReraPage() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [sentData, setSentData] = useState<object | undefined>(undefined);
  const [formCount, setFormCount] = useState<number>(0);
  const {
    projectFormDataRera,
    resetProjectFormDataRera,
    updateProjectFormDataRera,
    projectFormETLTagData,
  } = useProjectStoreRera();
  const { towerFormDataRera, resetTowerFormDataRera } = useTowerStoreRera();

  useEffect(() => {
    resetProjectFormDataRera();
    resetTowerFormDataRera();
    (document.getElementById('projectTowerForm') as HTMLFormElement).reset();
  }, [usePathname]);

  let newProjectFormData: any;
  newProjectFormData = { ...projectFormDataRera };

  delete newProjectFormData.towerTypeOptions;
  delete newProjectFormData.projectSubTypeOptions;
  delete newProjectFormData.district;
  delete newProjectFormData.mandal;
  delete newProjectFormData.projects;
  newProjectFormData.village_id = newProjectFormData.village?.value;
  delete newProjectFormData.village;
  newProjectFormData.projectType = newProjectFormData.projectType?.value;
  newProjectFormData.projectSubType = newProjectFormData.projectSubType?.value;
  newProjectFormData.localities = newProjectFormData?.localities?.map(
    (item: { value: string; label: string }) => item.value
  );
  newProjectFormData.projectSubTypeOption =
    newProjectFormData.projectSubTypeOption?.value;
  newProjectFormData.towerTypeOptions =
    newProjectFormData.towerTypeOptions?.value;
  let newTowerFormData: any;
  newTowerFormData = towerFormDataRera.map((item) => ({
    ...item,
    validTowerUnits: null,
    towerType: item.towerType?.value,
    etlUnitConfigs: item.etlUnitConfigs.filter(
      (item) => item.configName !== ''
    ),
  }));
  let newProjectFormETLTagData = projectFormETLTagData.map((item) => ({
    ...item,
    village: item.village?.value,
  }));
  const nonReraFormSteps: ReactElement[] = [
    <ProjectForm key={1} />,
    <TowerForm key={2} />,
    <PreviewProjectTower
      key={3}
      projectFormData={newProjectFormData}
      projectFormETLTagData={newProjectFormETLTagData}
      towerFormData={newTowerFormData}
    />,
  ];

  const reraFormSteps: ReactElement[] = [
    <ProjectForm key={1} />,
    <TowerForm key={2} />,
    <ProjectStatus key={3} />,
    <PreviewProjectTower
      key={4}
      projectFormData={newProjectFormData}
      projectFormETLTagData={newProjectFormETLTagData}
      towerFormData={newTowerFormData}
    />,
  ];

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newProjectFormData);
    if (!newProjectFormData.projectName || !newProjectFormData.village_id) {
      alert(`Project name or Village id is missing.`);
      return null;
    }

    const ifVillageNull: boolean[] = [];
    newProjectFormETLTagData.map((item) => {
      if (item.village) {
        ifVillageNull.push(true);
      }
    });
    if (newProjectFormETLTagData.length !== ifVillageNull.length) {
      alert(`You forgot to select Project ETL Village.`);
      return null;
    }

    const ifTowerNameNull: boolean[] = [];
    newTowerFormData.map((item: any) => {
      if (item.towerName) {
        ifTowerNameNull.push(true);
      }
    });
    if (newTowerFormData.length !== ifTowerNameNull.length) {
      alert(`You forget to write tower name.`);
      return null;
    }

    const data = {
      projectData: {
        ...newProjectFormData,
        ETLTagData: newProjectFormETLTagData,
      },
      towerData: newTowerFormData,
    };
    setSentData(data);
    try {
      const projectResPromise = axiosClient.post('/projects', data);
      const projectRes = await toast.promise(
        projectResPromise,
        {
          loading: 'Saving to database...',
          success: 'Project and Tower data added to database.',
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
        resetProjectFormDataRera();
        resetTowerFormDataRera();
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
        toast.error(`Error: ${errMsg}`, {
          duration: 3000,
        });
      } else {
        toast.error("Couldn't send data to server.", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Tower Tagging v2.0
      </h1>
      <form
        className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
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
          {projectFormDataRera.isRERAProject ? (
            <>
              <li className={`${formCount >= 2 ? 'step-error' : ''} step`}>
                Status
              </li>
              <li className={`${formCount >= 3 ? 'step-error' : ''} step`}>
                Final Preview
              </li>
            </>
          ) : (
            <li className={`${formCount >= 2 ? 'step-error' : ''} step`}>
              Final Preview
            </li>
          )}
        </ul>

        <div className='mx-auto flex flex-wrap items-center justify-between gap-5 rounded-full bg-rose-100 p-2 px-6 text-2xl transition-all'>
          <div className='flex items-center gap-5 transition-all duration-1000'>
            <span>Is RERA project?:</span>
            <input
              className={`toggle ${projectFormDataRera.isRERAProject ? 'toggle-success' : ''}`}
              type='checkbox'
              name='towerDoorNo'
              defaultChecked={projectFormDataRera.isRERAProject}
              onChange={(e) => {
                resetProjectFormDataRera();
                resetTowerFormDataRera();
                updateProjectFormDataRera({
                  isRERAProject: e.target.checked,
                });
                setFormCount(0);
              }}
            />
            <span>{`This is ${projectFormDataRera.isRERAProject ? 'a RERA project' : 'NOT a RERA project'}`}</span>
          </div>
        </div>
        {projectFormDataRera.isRERAProject
          ? reraFormSteps[formCount]
          : nonReraFormSteps[formCount]}
        <div className='mx-auto flex w-full items-center justify-center gap-10 md:w-[80%] md:gap-40'>
          <button
            type='button'
            className='btn btn-info btn-sm w-32 text-white md:btn-md'
            disabled={formCount === 0}
            onClick={() => setFormCount((prev) => prev - 1)}
          >
            Previous
          </button>
          {(projectFormDataRera.isRERAProject
            ? reraFormSteps.length - 1 !== formCount
            : nonReraFormSteps.length - 1 !== formCount) && (
            <button
              type='button'
              className='btn btn-info btn-sm w-32 text-white md:btn-md'
              onClick={() => setFormCount((prev) => prev + 1)}
            >
              Next
            </button>
          )}
          {(projectFormDataRera.isRERAProject
            ? reraFormSteps.length - 1 === formCount
            : nonReraFormSteps.length - 1 === formCount) && (
            <button
              className='btn btn-sm w-32 border-none bg-rose-500 text-white md:btn-md hover:bg-red-600'
              disabled={
                projectFormDataRera.district && projectFormDataRera.projectName
                  ? false
                  : true
              }
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {sentData && (
        <div className='flex flex-col items-center justify-between'>
          <p className='mt-10 text-center text-2xl font-semibold'>Sent Data</p>
          <div className='relative my-10 max-h-[500px] min-w-[80%] overflow-y-auto border bg-gray-100 font-mono text-sm'>
            <button
              className='btn btn-circle absolute right-0 top-2 border-none bg-rose-500 text-white hover:bg-rose-700'
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
          <pre className='my-10 max-h-[500px] min-w-[80%] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
      <div className='mt-40'></div>
    </div>
  );
}

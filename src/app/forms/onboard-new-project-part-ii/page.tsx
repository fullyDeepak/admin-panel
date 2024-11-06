'use client';

import { cn } from '@/lib/utils';
import StepsUI from './StepsUI';
import ProjectContainer from './steps/project/ProjectContainer';
import TowerContainer from './steps/tower/TowerContainer';
import { useProjectDataStore } from './useProjectDataStore';
import axiosClient from '@/utils/AxiosClient';
import { useTowerUnitStore } from './useTowerUnitStore';

export default function Page() {
  const {
    formStepsList,
    setFormSteps,
    currentFormStep: formSteps,
    projectData,
  } = useProjectDataStore();
  const { towerFormData } = useTowerUnitStore();
  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Project Onboarder v3.0
      </h1>
      <div
        className={cn(
          'mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        )}
        id='projectTowerForm'
      >
        <StepsUI
          stepValue={formSteps}
          steps={formStepsList}
          setFormSteps={setFormSteps}
        />
        {formSteps === 'Project' && <ProjectContainer />}
        {formSteps === 'Tower' && <TowerContainer />}

        {/* PAGINATORS */}
        <div className='mx-auto mt-20 flex w-[50%] justify-between'>
          <button
            className='btn-rezy btn w-28'
            onClick={() => {
              setFormSteps(formStepsList[formStepsList.indexOf(formSteps) - 1]);
            }}
            disabled={formSteps === 'Project'}
          >
            Previous
          </button>

          {formSteps !== 'Preview' && (
            <button
              className='btn-rezy btn w-28'
              onClick={() => {
                setFormSteps(
                  formStepsList[formStepsList.indexOf(formSteps) + 1]
                );
              }}
            >
              Next
            </button>
          )}
          {formSteps === 'Preview' && (
            <button
              className='btn btn-error w-28 text-white'
              onClick={async () => {
                await axiosClient.post('/onboarding/testste', {
                  data: {
                    projectData: projectData,
                    towerData: towerFormData,
                  },
                });
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

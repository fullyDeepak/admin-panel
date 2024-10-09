'use client';

import React from 'react';
import StaticDataForm from './steps/1/StaticDataForm';
import DeveloperTagging from './steps/3/DeveloperTagging';
import { useOnboardingDataStore } from './useOnboardingDataStore';
import StepsUI from './StepsUI';
import PreviewData from './PreviewData';
import { TagETLDataForm } from './steps/2/TagETLDataForm';

export default function Page() {
  const {
    currentFormStep: formSteps,
    formStepsList,
    setFormSteps,
  } = useOnboardingDataStore();

  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h1 className='self-center text-2xl md:text-3xl'>
          Onboard New Project
        </h1>
        <div
          className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
          id='projectTowerForm'
        >
          <StepsUI stepValue={formSteps} steps={formStepsList} />
          {formSteps === 'Step 1' && <StaticDataForm />}
          {formSteps === 'Step 2' && <TagETLDataForm />}
          {formSteps === 'Step 3' && <DeveloperTagging />}
          {formSteps === 'Preview' && <PreviewData />}

          {/* PAGINATORS */}
          <div className='mx-auto flex w-[50%] justify-between'>
            <button
              className='btn-rezy btn w-28'
              onClick={() => {
                setFormSteps(
                  formStepsList[formStepsList.indexOf(formSteps) - 1]
                );
              }}
              disabled={formSteps === 'Step 1'}
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
                onClick={() => {
                  alert('add submit form logic here');
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import PreviewData from './PreviewData';
import StaticDataForm from './steps/1/StaticDataForm';
import DeveloperTagging from './steps/2/DeveloperTagging';
import { TagETLDataForm } from './steps/3/TagETLDataForm';
import GeoData from './steps/geo-data/GeoData';
import TowerPage from './steps/tower-unit/TowerPage';
import StepsUI from './StepsUI';
import { useOnboardingDataStore } from './useOnboardingDataStore';

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
          Project Onboarder v3.0
        </h1>
        <div
          className='mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
          id='projectTowerForm'
        >
          <StepsUI
            stepValue={formSteps}
            steps={formStepsList}
            setFormSteps={setFormSteps}
          />
          {formSteps === 'Static Data' && <StaticDataForm />}
          {formSteps === 'Geo-Data' && <GeoData />}
          {formSteps === 'Developer Tagging' && <DeveloperTagging />}
          {formSteps === 'ETL For Project' && <TagETLDataForm />}
          {formSteps === 'Tower - Unit' && <TowerPage />}
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
              disabled={formSteps === 'Static Data'}
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

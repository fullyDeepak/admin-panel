'use client';

import { cn } from '@/lib/utils';
import PreviewData from './PreviewData';
import StaticDataForm from './steps/static-data/StaticDataForm';
import DeveloperTagging from './steps/keyword-tagging/DeveloperTagging';
import ETLForProjectSection from './steps/project-etl-data/ETLForProjectSection';
import GeoData from './steps/geo-data/GeoData';
import TowerPage from './steps/tower-unit/TowerPage';
import StepsUI from './StepsUI';
import { useOnboardingDataStore } from './useOnboardingDataStore';
import RootDocTagging from './steps/root-doc-tagging/RootDocTagging';
import useETLDataStore from './useETLDataStore';
import { useTowerUnitStore } from './useTowerUnitStore';
import { useImageStore } from './useImageStore';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';

export default function Page() {
  const {
    currentFormStep: formSteps,
    formStepsList,
    setFormSteps,
    onboardingData,
    updateOnboardingData,
  } = useOnboardingDataStore();
  const { projectFormETLTagData } = useETLDataStore();
  const { towerFormData } = useTowerUnitStore();
  const { imagesStore } = useImageStore();
  const [draftSaveState, setDraftSaveState] = useState<
    'SAVING' | 'SAVED' | 'UNSAVED'
  >('UNSAVED');
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h1 className='self-center text-2xl md:text-3xl'>
          Project Onboarder v3.0 - Part I
        </h1>
        <div
          className={cn(
            'mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]',
            ['Tower', 'Root Doc'].includes(formSteps) && 'md:max-w-[100%]'
          )}
          id='projectTowerForm'
        >
          <StepsUI
            stepValue={formSteps}
            steps={formStepsList}
            setFormSteps={setFormSteps}
          />
          {formSteps === 'Static Data' && <StaticDataForm />}
          {formSteps === 'Geo-Data' && (
            <GeoData
              onboardingData={onboardingData}
              updateOnboardingData={updateOnboardingData}
            />
          )}
          {formSteps === 'Keyword Tag' && <DeveloperTagging />}
          {formSteps === 'Root Doc' && <RootDocTagging />}
          {formSteps === 'Project ETL' && <ETLForProjectSection />}
          {formSteps === 'Tower' && <TowerPage />}
          {formSteps === 'Preview' && <PreviewData />}

          {/* PAGINATORS */}
          <div className='mx-auto mt-20 flex w-[50%] justify-between'>
            <button
              className='btn-rezy btn w-28'
              onClick={() => {
                setFormSteps(
                  formStepsList[formStepsList.indexOf(formSteps) - 1]
                );
                if (
                  !onboardingData.selectedTempProject?.value ||
                  onboardingData.selectedReraProjects.length < 1
                ) {
                  alert(
                    'Please select a Temp Project and at least one RERA to save as Draft Project.'
                  );
                  return;
                }
                setDraftSaveState('SAVING');
                axiosClient
                  .post('/onboarding/save-onboarding-state', {
                    id: `${onboardingData.projectSourceType}-${onboardingData.selectedTempProject?.value}-${
                      onboardingData.selectedReraProjects[0]?.value
                    }`,
                    data: {
                      staticData: onboardingData,
                      etlData: projectFormETLTagData,
                      towerData: towerFormData,
                      imageData: imagesStore,
                    },
                    onboardingState: formSteps,
                  })
                  .then(() => {
                    setDraftSaveState('SAVED');
                  });
              }}
              disabled={formSteps === 'Static Data'}
            >
              Previous
            </button>
            <button
              className='btn-rezy btn w-28'
              onClick={() => {
                if (
                  !onboardingData.selectedTempProject?.value ||
                  onboardingData.selectedReraProjects.length < 1
                ) {
                  alert(
                    'Please select a Temp Project and at least one RERA to save as Draft Project.'
                  );
                  return;
                }
                setDraftSaveState('SAVING');
                axiosClient
                  .post('/onboarding/save-onboarding-state', {
                    id: `${onboardingData.projectSourceType}-${onboardingData.selectedTempProject?.value}-${
                      onboardingData.selectedReraProjects[0]?.value
                    }`,
                    data: {
                      staticData: onboardingData,
                      etlData: projectFormETLTagData,
                      towerData: towerFormData,
                      imageData: imagesStore,
                    },
                    onboardingState: formSteps,
                  })
                  .then(() => {
                    setDraftSaveState('SAVED');
                  });
              }}
            >
              Save Draft
            </button>
            {formSteps !== 'Preview' && (
              <button
                className='btn-rezy btn w-28'
                onClick={() => {
                  setFormSteps(
                    formStepsList[formStepsList.indexOf(formSteps) + 1]
                  );
                  setDraftSaveState('SAVING');
                  axiosClient
                    .post('/onboarding/save-onboarding-state', {
                      id: `${onboardingData.projectSourceType}-${onboardingData.selectedTempProject?.value}-${
                        onboardingData.selectedReraProjects[0]?.value
                      }`,
                      data: {
                        staticData: onboardingData,
                        etlData: projectFormETLTagData,
                        towerData: towerFormData,
                        imageData: imagesStore,
                      },
                      onboardingState: formSteps,
                    })
                    .then(() => {
                      setDraftSaveState('SAVED');
                    });
                }}
              >
                Next
              </button>
            )}
            {formSteps === 'Preview' && (
              <button
                className='btn btn-error w-28 text-white'
                onClick={async () => {
                  setDraftSaveState('SAVING');
                  await axiosClient
                    .post('/onboarding/onboard-project', {
                      staticData: onboardingData,
                      etlData: projectFormETLTagData,
                      towerData: towerFormData,
                    })
                    .then(() => {
                      setDraftSaveState('SAVED');
                      alert('Onboarded');
                    });
                }}
              >
                Submit
              </button>
            )}
          </div>
          <div className='w-full justify-center text-center text-xl'>
            Draft Status: {draftSaveState}
          </div>
        </div>
      </div>
    </>
  );
}

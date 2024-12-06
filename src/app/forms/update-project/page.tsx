'use client';

import { cn } from '@/lib/utils';
import axiosClient from '@/utils/AxiosClient';
import PreviewData from './PreviewData';
import DeveloperTagging from './steps/keyword-tagging/DeveloperTagging';
import ETLForProjectSection from './steps/project-etl-data/ETLForProjectSection';
import RootDocTagging from './steps/root-doc-tagging/RootDocTagging';
import StaticDataForm from './steps/static-data/StaticDataForm';
import TowerPage from './steps/tower-unit/TowerPage';
import StepsUI from './StepsUI';
import useETLDataStore, { FormProjectETLTagDataType } from './useETLDataStore';
import {
  OnboardingDataType,
  useOnboardingDataStore,
} from './useOnboardingDataStore';
import { TowerDetailType, useTowerUnitStore } from './useTowerUnitStore';
import { useSourceDataStore } from './useSourceDataStore';
import { useEffect, useState } from 'react';
import GeoData from '../onboard-new-project/steps/geo-data/GeoData';
import toast from 'react-hot-toast';

export default function Page() {
  const {
    currentFormStep: formSteps,
    formStepsList,
    setFormSteps,
    onboardingData,
    updateOnboardingData,
    resetData,
  } = useOnboardingDataStore();
  const { projectFormETLTagData, resetAllProjectData } = useETLDataStore();
  const { towerFormData, resetTowerUnitStore } = useTowerUnitStore();
  const {
    projectData: oldData,
    towerData: oldTowerData,
    etlData: oldEtlData,
  } = useSourceDataStore();
  const [final_data, setFinalData] = useState<string>('');
  useEffect(() => {
    return () => {
      setFinalData('');
      resetAllProjectData();
      resetTowerUnitStore();
      resetData();
    };
  }, []);
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h1 className='self-center text-2xl md:text-3xl'>
          Project Updater v3.0 - Part I
        </h1>
        <div
          className={cn(
            'mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]',
            ['Tower - Unit', 'Root Doc Tagging'].includes(formSteps) &&
              'md:max-w-[100%]'
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
                onClick={async () => {
                  if (!oldData || !oldEtlData) return;
                  const toPost: {
                    oldData: {
                      projectData:
                        | (OnboardingDataType & {
                            ETLTagData: FormProjectETLTagDataType[];
                          })
                        | null;

                      towerData: TowerDetailType[] | null;
                    };
                    newData: {
                      projectData: OnboardingDataType & {
                        ETLTagData: FormProjectETLTagDataType[];
                      };
                      towerData: TowerDetailType[];
                    };
                  } = {
                    oldData: {
                      projectData: {
                        ...oldData,
                        ETLTagData: oldEtlData,
                      },
                      towerData: oldTowerData,
                    },
                    newData: {
                      projectData: {
                        ...onboardingData,
                        ETLTagData: projectFormETLTagData,
                      },
                      towerData: towerFormData,
                    },
                  };
                  setFinalData(JSON.stringify(toPost, null, 2));
                  toast.promise(
                    axiosClient.put('/onboarding/update-project', toPost),
                    {
                      loading: 'Updating...',
                      success: () => {
                        return 'Successfully updated!';
                      },
                      error: (err) => {
                        console.log(err);
                        return 'Error while updating project';
                      },
                    }
                  );
                }}
              >
                Submit
              </button>
            )}
          </div>
          <pre className='max-h-40 overflow-y-scroll'>{final_data}</pre>
        </div>
      </div>
    </>
  );
}

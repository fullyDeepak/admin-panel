import LoadingCircle from '@/components/ui/LoadingCircle';
import { Dispatch, FormEventHandler, SetStateAction, useId } from 'react';
import Select, { SingleValue } from 'react-select';
import TowerFP from './TowerFP';
import ProgressBar from '@/components/ui/ProgressBar';
import { useImageFormStore } from './useImageFormStore';
import UnitFP from './UnitFP';

type FormProps = {
  projectOptions:
    | {
        value: number;
        label: string;
      }[]
    | undefined;
  submitForm: FormEventHandler<HTMLFormElement> | undefined;
  loadingProjectOptions: boolean;
  progress: number;
  setProjectFiles: Dispatch<SetStateAction<FileList | null>>;
  setResultData: (
    _:
      | {
          fileName: string;
          uploadStatus: 'Success' | 'Failure';
        }[]
      | null
  ) => void;
};

export default function Form({
  loadingProjectOptions,
  projectOptions,
  submitForm,
  progress,
  setProjectFiles,
  setResultData,
}: FormProps) {
  const {
    selectedProject,
    setSelectedProject,
    selectedImageTaggingType,
    setSelectedImageTaggingType,
    loadingTowerFloorData,
    towerFloorFormData,
    uploadingStatus,
    setUploadingStatus,
    setTowerFloorFormData,
  } = useImageFormStore();
  return (
    <form
      className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[60%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
      id='projectTowerImageTagging'
      onSubmit={submitForm}
    >
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'projectOptions'}
          isClearable
          instanceId={useId()}
          value={selectedProject}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setSelectedProject(e);
            setResultData(null);
          }}
          options={projectOptions}
          isLoading={loadingProjectOptions}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>Tagging Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          isClearable
          isSearchable={false}
          instanceId={useId()}
          value={selectedImageTaggingType}
          onChange={(
            e: SingleValue<{
              value:
                | 'brochure'
                | 'project_master_plan'
                | 'project_image'
                | 'tower-fp'
                | 'unit-fp';
              label: string;
            }>
          ) => {
            setSelectedImageTaggingType(e);
            setResultData(null);
          }}
          options={[
            { label: 'Brochure', value: 'brochure' },
            { label: 'Project Master Plan', value: 'project_master_plan' },
            { label: 'Project Images', value: 'project_image' },
            { label: 'Tower Floor Plan', value: 'tower-fp' },
            { label: 'Unit Floor Plan', value: 'unit-fp' },
          ]}
        />
      </label>
      {loadingTowerFloorData === 'loading' && (
        <span className='text-center'>
          <LoadingCircle circleColor='black' size='large' />
        </span>
      )}
      {loadingTowerFloorData === 'complete' &&
        selectedImageTaggingType?.value === 'unit-fp' &&
        towerFloorFormData &&
        towerFloorFormData?.length > 0 && (
          <UnitFP
            towerFloorData={towerFloorFormData}
            setTowerFloorData={setTowerFloorFormData}
          />
          //   <UnitFP  towerFloorData={towerFloorFormData}/>
        )}
      {loadingTowerFloorData === 'complete' &&
        towerFloorFormData &&
        towerFloorFormData.length === 0 &&
        selectedProject?.value &&
        selectedImageTaggingType?.value === 'unit-fp' && (
          <span className='text-center font-semibold text-error'>
            Units not available.
          </span>
        )}
      {loadingTowerFloorData === 'error' && (
        <span className='text-center font-semibold text-error'>
          Something went wrong
        </span>
      )}
      {loadingTowerFloorData === 'complete' &&
        selectedImageTaggingType?.value === 'tower-fp' &&
        towerFloorFormData &&
        towerFloorFormData?.length > 0 && (
          <TowerFP towerFloorData={towerFloorFormData} />
        )}
      {selectedImageTaggingType &&
        selectedImageTaggingType?.value !== 'unit-fp' &&
        selectedImageTaggingType?.value !== 'tower-fp' && (
          <label className='relative flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[3] text-base md:text-xl'>Select File:</span>
            <input
              type='file'
              className='file-input file-input-bordered ml-2 h-10 flex-[5]'
              multiple
              id='project-input-file'
              accept='image/*,.pdf'
              onChange={(e) => {
                setResultData(null);
                setUploadingStatus('idle');
                setProjectFiles(e.target.files);
              }}
            />
          </label>
        )}
      {selectedImageTaggingType && selectedImageTaggingType?.value && (
        <>
          <button
            className='btn-rezy btn mx-auto min-w-40 disabled:text-gray-600'
            disabled={uploadingStatus === 'running' ? true : false}
          >
            {uploadingStatus === 'idle' || uploadingStatus === 'complete' ? (
              'Submit'
            ) : (
              <LoadingCircle size='medium' circleColor='violet' />
            )}
          </button>
          {uploadingStatus === 'idle' ? (
            <></>
          ) : uploadingStatus === 'running' ||
            uploadingStatus === 'complete' ? (
            <ProgressBar progress={progress} />
          ) : (
            <></>
          )}
        </>
      )}
    </form>
  );
}

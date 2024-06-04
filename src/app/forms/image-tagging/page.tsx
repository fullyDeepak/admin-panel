'use client';

import Select, { SingleValue } from 'react-select';
import { FormEvent, useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import LoadingCircle from '@/components/ui/LoadingCircle';
import UnitFP from './UnitFP';
import TowerFP from './TowerFP';
import { useImageFormStore } from '@/store/useImageFormStore';
import ProgressBar from '@/components/ui/ProgressBar';
import TanstackReactTable from '@/components/tables/TanstackReactTable';

export type TowerFloorDataType = {
  towerId: number;
  towerName: string;
  towerType: string;
  floorsUnits: {
    floorId: number;
    units: string[];
  }[];
};

export default function ImageTaggingPage() {
  //   console.log('Whole page re-renders.....');
  const {
    fetchTowerFloorData,
    loadingTowerFloorData,
    towerFloorFormData,
    uploadingStatus,
    setUploadingStatus,
  } = useImageFormStore();

  const [selectedProject, setSelectedProject] = useState<SingleValue<{
    value: number;
    label: string;
  }> | null>(null);

  const [selectedImageTaggingType, setSelectedImageTaggingType] = useState<
    SingleValue<{
      label: string;
      value:
        | 'brochure'
        | 'project_master_plan'
        | 'project_image'
        | 'tower-fp'
        | 'unit-fp';
    } | null>
  >(null);

  const [projectFiles, setProjectFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultData, setResultData] = useState<
    { fileName: string; uploadStatus: 'Success' | 'Failure' }[] | null
  >(null);

  const resultColumn = [
    {
      header: 'S3 Location',
      accessorKey: 'fileName',
    },
    {
      header: 'Upload Status',
      accessorKey: 'uploadStatus',
    },
  ];

  // populate project dropdown
  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get<{
          data: { id: number; project_name: string }[];
        }>('/projects');
        const options = res.data.data.map((item) => ({
          value: item.id,
          label: `${item.id}:${item.project_name}`,
        }));
        return options;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  // populate tower floor dropdown
  useQuery({
    queryKey: [
      'getUMUnitNames',
      selectedProject?.value,
      selectedImageTaggingType,
    ],
    queryFn: async () => {
      if (
        (selectedImageTaggingType?.value === 'tower-fp' ||
          selectedImageTaggingType?.value === 'unit-fp') &&
        selectedProject?.value
      ) {
        fetchTowerFloorData(selectedProject.value);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      projectFiles &&
      selectedProject?.value &&
      projectFiles.length !== 0 &&
      selectedImageTaggingType &&
      selectedImageTaggingType?.value !== 'unit-fp' &&
      selectedImageTaggingType?.value !== 'tower-fp'
    ) {
      setResultData(null);
      setUploadingStatus('running');
      const doc_type = selectedImageTaggingType?.value;
      const project_id = selectedProject.value;
      const formData = new FormData();
      formData.append('doc_type', doc_type);
      formData.append('project_id', project_id.toString());
      for (let i = 0; i < projectFiles.length; i++) {
        formData.append('docs', projectFiles[i]);
      }
      //   await new Promise((resolve) => setTimeout(resolve, 10000));
      try {
        const response = await axiosClient.post<{
          status: string;
          data: {
            fileName: string;
            uploadStatus: 'Success' | 'Failure';
          }[];
        }>('/upload/project', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent: any) => {
            const percentage =
              (progressEvent.loaded * 100) / progressEvent.total;
            setProgress(+percentage.toFixed(0));
          },
        });
        setResultData(response.data?.data);
        setUploadingStatus('complete');
        setProjectFiles(null);
        (
          document.getElementById('project-input-file') as HTMLInputElement
        ).value = '';
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Project, Tagging type or files selection are missing.');
    }
  }

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Image Tagging
      </h1>
      <form
        className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[60%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerImageTagging'
        onSubmit={submitForm}
      >
        {/* <p>{Date.now()}</p> */}
        <label className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select Project:</span>
          <Select
            className='w-full flex-[5]'
            key={'projectOptions'}
            isClearable
            instanceId={useId()}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e)}
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
            instanceId={useId()}
            value={selectedImageTaggingType}
            onChange={(e) => setSelectedImageTaggingType(e)}
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
            <UnitFP towerFloorData={towerFloorFormData} />
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
              <span className='flex-[3] text-base md:text-xl'>
                Select File:
              </span>
              <input
                type='file'
                className='file-input file-input-bordered flex-[5]'
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
              {uploadingStatus === 'idle' || uploadingStatus === 'complete'
                ? 'Submit'
                : 'Uploading...'}
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
      {resultData && resultData?.length > 0 && (
        <div className='mx-auto my-10 max-w-[60%]'>
          <h3 className='text-center text-2xl font-semibold'>Upload Status</h3>
          <TanstackReactTable
            columns={resultColumn}
            data={resultData}
            showPagination={false}
            enableSearch={false}
          />
        </div>
      )}
    </div>
  );
}

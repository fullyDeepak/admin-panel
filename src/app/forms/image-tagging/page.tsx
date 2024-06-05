'use client';

import { FormEvent, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useImageFormStore } from '@/store/useImageFormStore';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import Form from './Form';

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
    setUploadingStatus,
    selectedProject,
    selectedImageTaggingType,
    resultData,
    setResultData,
  } = useImageFormStore();

  const [projectFiles, setProjectFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);

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
        }>('/forms/imgTag/project', formData, {
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
    } else if (
      selectedProject?.value &&
      selectedImageTaggingType &&
      selectedImageTaggingType?.value === 'tower-fp'
    ) {
      // const formData = new FormData(document.forms.ok)
      setResultData(null);
      setUploadingStatus('running');
      const form = document.getElementById(
        'projectTowerImageTagging'
      ) as HTMLFormElement;
      const formData = new FormData(form);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      formData.append('project_id', selectedProject.value.toString());
      const response = await axiosClient.post<{
        status: string;
        data: {
          fileName: string;
          uploadStatus: 'Success' | 'Failure';
        }[];
      }>('/forms/imgTag/tower', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          const percentage = (progressEvent.loaded * 100) / progressEvent.total;
          setProgress(+percentage.toFixed(0));
        },
      });
      setResultData(response.data?.data);
      setUploadingStatus('complete');
      form.reset();
    } else {
      alert('Project, Tagging type or files selection are missing.');
    }
  }

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Image Tagging
      </h1>
      <Form
        projectOptions={projectOptions}
        loadingProjectOptions={loadingProjectOptions}
        progress={progress}
        setProjectFiles={setProjectFiles}
        setResultData={setResultData}
        submitForm={submitForm}
      />
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

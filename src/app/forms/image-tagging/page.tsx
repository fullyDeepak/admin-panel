'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import Form from './Form';
import PreviewDocs from './PreviewDocs';
import { useImageFormStore } from './useImageFormStore';

export default function ImageTaggingPage() {
  //   console.log('Whole page re-renders.....');
  const {
    fetchTowerFloorData,
    setUploadingStatus,
    selectedProject,
    selectedImageTaggingType,
    availableProjectData,
    unitFPDataStore,
    setAvailableProjectData,
    resultData,
    setResultData,
  } = useImageFormStore();

  const [projectFiles, setProjectFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [rowDataProjectTower, setRowDataProjectTower] = useState<{
    project_id: number;
    doc_type: string;
    s3_path: string;
    preview_url: string;
    file_type: 'image' | 'pdf';
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal === true) {
      (
        document.getElementById('preview-modal') as HTMLDialogElement
      ).showModal();
    }
  }, [showModal]);

  const availableProjectDataColumns = [
    {
      header: 'Project Id',
      accessorKey: 'project_id',
    },
    {
      header: 'Tagging Type',
      accessorKey: 'doc_type',
    },
    {
      header: 'AWS S3 Path',
      accessorKey: 's3_path',
      cell: ({ row }: any) => (
        <p className='max-w-[300px] text-wrap'>{row.original.s3_path}</p>
      ),
    },
    {
      header: 'Delete',
      cell: ({ row }: any) => (
        <button
          className='btn btn-xs'
          type='button'
          onClick={() => {
            setRowDataProjectTower(row.original);
            setShowModal(true);
          }}
        >
          Preview
        </button>
      ),
    },
  ];
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
        selectedImageTaggingType?.value === 'unit-fp' &&
        selectedProject?.value
      ) {
        fetchTowerFloorData(selectedProject.value);
      } else if (
        (selectedImageTaggingType?.value === 'brochure' ||
          selectedImageTaggingType?.value === 'project_master_plan' ||
          selectedImageTaggingType?.value === 'project_image') &&
        selectedProject?.value
      ) {
        const response = await axiosClient.get<{
          data: {
            project_id: number;
            doc_type: string;
            s3_path: string;
            preview_url: string;
          }[];
          status: 'success';
        }>('/forms/imgTag/project', {
          params: { project_id: selectedProject.value },
        });
        const projectData = response.data.data.map((item) => {
          const newItem = {
            ...item,
            file_type: 'image' as 'image' | 'pdf',
          };
          if (item.s3_path.endsWith('pdf')) {
            newItem.file_type = 'pdf';
          }
          return newItem;
        });
        console.log({ projectData });
        setAvailableProjectData(projectData);
      } else if (
        selectedImageTaggingType?.value === 'tower-fp' &&
        selectedProject?.value
      ) {
        fetchTowerFloorData(selectedProject.value);
        const response = await axiosClient.get<{
          data: {
            project_id: number;
            tower_id: number;
            doc_type: string;
            s3_path: string;
            preview_url: string;
          }[];
          status: 'success';
        }>('/forms/imgTag/tower', {
          params: { project_id: selectedProject.value },
        });
        const projectData = response.data.data.map((item) => {
          const newItem = {
            ...item,
            file_type: 'image' as 'image' | 'pdf',
          };
          if (item.s3_path.endsWith('pdf')) {
            newItem.file_type = 'pdf';
          }
          return newItem;
        });
        setAvailableProjectData(projectData);
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
      setResultData(null);
      setUploadingStatus('running');
      const form = document.getElementById(
        'projectTowerImageTagging'
      ) as HTMLFormElement;
      const formData = new FormData(form);
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
    } else if (
      selectedProject?.value &&
      selectedImageTaggingType &&
      selectedImageTaggingType?.value === 'unit-fp'
    ) {
      setResultData(null);
      setUploadingStatus('running');
      const form = document.getElementById(
        'projectTowerImageTagging'
      ) as HTMLFormElement;
      const formData = new FormData(form);
      formData.append('project_id', selectedProject.value.toString());
      formData.append('tfuData', JSON.stringify(unitFPDataStore));

      try {
        const response = await axiosClient.post<{
          status: string;
          data: {
            fileName: string;
            uploadStatus: 'Success' | 'Failure';
          }[];
        }>('/forms/imgTag/unit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent: any) => {
            const percentage =
              (progressEvent.loaded * 100) / progressEvent.total;
            setProgress(+percentage.toFixed(0));
          },
        });
        setResultData(response.data?.data);
        setUploadingStatus('complete');
        form.reset();
      } catch (error) {
        setUploadingStatus('error');
      }
    }
  }

  return (
    <div className='mx-auto mb-60 mt-10 flex w-full flex-col'>
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
      {selectedImageTaggingType?.value !== 'tower-fp' &&
        selectedImageTaggingType?.value !== 'unit-fp' &&
        availableProjectData &&
        availableProjectData?.length > 0 && (
          <div className='mx-auto my-10 max-w-[60%]'>
            <h3 className='text-center text-2xl font-semibold'>
              Available Project Data
            </h3>
            <TanstackReactTable
              columns={availableProjectDataColumns}
              data={availableProjectData}
              showPagination={true}
              enableSearch={false}
            />
            {rowDataProjectTower && (
              <PreviewDocs
                previewDocsData={rowDataProjectTower}
                setShowModal={setShowModal}
              />
            )}
          </div>
        )}
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

import { useImageFormStore } from '@/store/useImageFormStore';
import axiosClient from '@/utils/AxiosClient';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

type PreviewDocType = {
  previewDocsData: {
    project_id: number;
    tower_id?: number;
    doc_type: string;
    s3_path: string;
    preview_url: string;
    file_type: 'image' | 'pdf';
  };
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export default function PreviewDocs({
  previewDocsData,
  setShowModal,
}: PreviewDocType) {
  const { setAvailableProjectData, availableProjectData } = useImageFormStore();
  const [loading, setLoading] = useState(false);

  async function deleteDoc() {
    setLoading(true);
    try {
      const data = {
        project_id: previewDocsData.project_id,
        tower_id: previewDocsData.tower_id,
        doc_type: previewDocsData.doc_type,
        s3_path: previewDocsData.s3_path,
      };
      if (previewDocsData.tower_id) {
        await axiosClient.delete('/forms/imgTag/tower', { data });
      } else {
        await axiosClient.delete('/forms/imgTag/project', { data });
      }
      setAvailableProjectData(
        availableProjectData?.filter((item) => item.s3_path !== data.s3_path)
      );
      (document.getElementById('preview-modal') as HTMLDialogElement).close();
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      setLoading(false);
    }
  }
  return (
    <>
      <dialog id={'preview-modal'} className='modal'>
        <div className='modal-box flex max-w-[100%] flex-col gap-2'>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2 !min-h-0'
            type='button'
            onClick={() => {
              (
                document.getElementById('preview-modal') as HTMLDialogElement
              ).close();
              setShowModal(false);
            }}
          >
            ✕
          </button>
          <div className='flex items-center justify-evenly'>
            <div className='flex flex-col gap-2'>
              <span className='text-xl font-semibold'>
                Project Id: {previewDocsData.project_id}
              </span>
              {previewDocsData.tower_id && (
                <span className='text-xl font-semibold'>
                  Tower Id: {previewDocsData.tower_id}
                </span>
              )}
              <span className='text-xl font-semibold'>
                Tagging Type: {previewDocsData.doc_type}
              </span>
              <span className=''>AWS S3 Path: {previewDocsData.s3_path}</span>
            </div>
            <button
              className={`btn-rezy ${loading ? '!text-gray-600' : '!text-white'} btn !rounded-full`}
              onClick={() => {
                const choise = confirm('Are you sure?');
                if (choise) {
                  deleteDoc();
                }
              }}
              type='button'
              disabled={loading}
            >
              {loading ? 'deleting...' : 'Delete'}
            </button>
          </div>
          {previewDocsData.file_type === 'pdf' && (
            <iframe
              src={previewDocsData.preview_url}
              style={{ width: '80%', height: '500px' }}
              className='mx-auto rounded-2xl'
            ></iframe>
          )}
          {previewDocsData.file_type === 'image' && (
            <div className='mx-auto p-2'>
              <Image
                src={previewDocsData.preview_url}
                alt={previewDocsData.s3_path}
                width={0}
                height={0}
                sizes='100vw'
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

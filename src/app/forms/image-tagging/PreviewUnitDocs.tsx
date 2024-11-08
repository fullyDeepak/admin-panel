import axiosClient from '@/utils/AxiosClient';
import Image from 'next/image';
import { useState } from 'react';
import { useImageFormStore } from './useImageFormStore';
import { produce } from 'immer';

type PreviewDocType = {
  previewDocsData: {
    tower_id: number;
    s3_path: string;
    preview_url: string;
    unitType: number | null;
    fName: string;
  };
  showModal: boolean;
  setShowModal: (_val: boolean) => void;
};

export default function PreviewUnitDocs({
  previewDocsData,
  setShowModal,
}: PreviewDocType) {
  const [loading, setLoading] = useState(false);
  const { towerFloorFormData, setTowerFloorFormData, selectedProject } =
    useImageFormStore();

  async function deleteDoc() {
    setLoading(true);
    try {
      const data = {
        project_id: selectedProject?.value,
        unit_type: previewDocsData.unitType,
        s3_path: previewDocsData.s3_path,
      };
      await axiosClient.delete('/forms/imgTag/unit', { data });
      const newTFUData = produce(towerFloorFormData, (draft) => {
        draft.forEach((tfuData) => {
          tfuData.floorsUnits.forEach((fuData) => {
            fuData.units.forEach((unitItem) => {
              if (previewDocsData.unitType?.toString() === unitItem.unitType) {
                unitItem.unitType = null;
                unitItem.preview_url = '';
                unitItem.s3_path = '';
              }
            });
          });
        });
      });
      setTowerFloorFormData(newTFUData);
      (
        document.getElementById('unit-preview-modal') as HTMLDialogElement
      ).close();
      setLoading(false);
      setShowModal(false);
    } catch (_error) {
      setLoading(false);
    }
  }

  return (
    <>
      <dialog id={'unit-preview-modal'} className='modal'>
        <div className='modal-box flex max-w-[100%] flex-col gap-2'>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2 !min-h-0'
            type='button'
            onClick={() => {
              (
                document.getElementById(
                  'unit-preview-modal'
                ) as HTMLDialogElement
              ).close();
              setShowModal(false);
            }}
          >
            ✕
          </button>
          <div className='flex items-center justify-evenly'>
            <div className='flex flex-col gap-2'>
              <span className='text-xl font-semibold'>
                Tower Id: {previewDocsData.tower_id}
              </span>
              <span className='text-xl font-semibold'>
                Full Unit Name:{' '}
                <span className='font-normal'>{previewDocsData.fName}</span>
              </span>
              <span className='text-xl font-semibold'>
                Unit Type: {previewDocsData.unitType}
              </span>
              <span className='text-xl font-semibold'>
                AWS S3 Path:{' '}
                <span className='font-normal'>{previewDocsData.s3_path}</span>
              </span>
            </div>
            <button
              className={`btn-rezy ${loading ? '!text-gray-600' : '!text-white'} btn !rounded-full`}
              type='button'
              disabled={loading}
              onClick={() => {
                const choise = confirm('Are you sure?');
                if (choise) {
                  deleteDoc();
                }
              }}
            >
              {loading ? 'deleting...' : 'Delete'}
            </button>
          </div>
          <div className='mx-auto p-2'>
            {previewDocsData.preview_url && (
              <Image
                src={previewDocsData.preview_url}
                alt={previewDocsData.s3_path}
                width={0}
                height={0}
                placeholder='blur'
                blurDataURL='data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScgLz4KICAgICAgPC9maWx0ZXI+CgogICAgICA8aW1hZ2UgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZScgZmlsdGVyPSd1cmwoI2IpJyB4PScwJyB5PScwJyBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyAKICAgICAgaHJlZj0nZGF0YTppbWFnZS9hdmlmO2Jhc2U2NCwvOWovMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUFMQUJBREFTSUFBaEVCQXhFQi84UUFGZ0FCQVFFQUFBQUFBQUFBQUFBQUFBQUFCZ01GLzhRQUpoQUFBUU1EQXdJSEFBQUFBQUFBQUFBQUFnRURCQUFGRVFZU0lTSXhFekl6UVdHQnNmL0VBQlVCQVFFQUFBQUFBQUFBQUFBQUFBQUFBQU1FLzhRQUdoRUFBZ0lEQUFBQUFBQUFBQUFBQUFBQUFRTUFBaEVTVWYvYUFBd0RBUUFDRVFNUkFEOEFscU9VellyVEJnVzlsMHJnWWtTdW42ZTdzTzNudlFwKzRQWjJTNUxiNWtYV1lwakhIdGo1L0tjTk1OUzdoR2VrRDRyamFFb2tTcXVPblAzeldmcWFGRkNJOCtNZHRIY2VkQjVvV2tCdUJLMFVBcnQyZi8vWicgLz4KICAgIDwvc3ZnPgogIA=='
                sizes='100vw'
                style={{ width: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

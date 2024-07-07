import { nanoid } from 'nanoid';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import PreviewDocs from './PreviewDocs';
import { useEffect, useState } from 'react';
import { TowerFloorDataType, useImageFormStore } from './useImageFormStore';

type TowerFPProps = {
  towerFloorData: TowerFloorDataType[];
};

export default function TowerFP({ towerFloorData }: TowerFPProps) {
  const [showModal, setShowModal] = useState(false);
  const [rowDataProjectTower, setRowDataProjectTower] = useState<{
    project_id: number;
    doc_type: string;
    s3_path: string;
    preview_url: string;
    file_type: 'image' | 'pdf';
  } | null>(null);
  const { availableProjectData } = useImageFormStore();

  useEffect(() => {
    if (showModal === true) {
      (
        document.getElementById('preview-modal') as HTMLDialogElement
      ).showModal();
    }
  }, [showModal]);

  const availableTowerDataColumns = [
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
  return (
    <>
      {towerFloorData?.map((tower) => (
        <div
          className='tower-card my-5 flex w-full flex-col gap-3 rounded-2xl p-10 pb-0 shadow-[0_0px_8px_rgb(0,60,255,0.5)]'
          key={nanoid()}
          id={nanoid()}
        >
          <p className='flex justify-evenly text-center font-semibold'>
            <span>Tower ID: {tower.towerId}</span>{' '}
            <span>Tower Name: {tower.towerName}</span>
            <span>Tower Type: {tower.towerType}</span>
          </p>
          <label className='relative flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[3] text-xl'>Select File:</span>
            <input
              type='file'
              multiple
              accept='image/*,.pdf'
              name={tower.towerId.toString()}
              className='file-input file-input-bordered h-10 flex-[5]'
            />
          </label>
          {availableProjectData &&
          availableProjectData?.length > 0 &&
          availableProjectData.filter((data) => data.tower_id === tower.towerId)
            .length > 0 ? (
            <div className='mx-auto my-10 w-full'>
              <h3 className='text-center text-2xl font-semibold'>
                Available Tower Data
              </h3>
              <TanstackReactTable
                columns={availableTowerDataColumns}
                data={availableProjectData.filter(
                  (data) => data.tower_id === tower.towerId
                )}
                showPagination={false}
                enableSearch={false}
              />
              {rowDataProjectTower && (
                <PreviewDocs
                  previewDocsData={rowDataProjectTower}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          ) : (
            <div className='mx-auto my-10 w-full'>
              <h3 className='text-center text-2xl font-semibold text-red-600'>
                No data available
              </h3>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

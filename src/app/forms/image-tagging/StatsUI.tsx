import { cn } from '@/lib/utils';
import { ImageStatsData } from '@/types/types';
import { range, startCase } from 'lodash';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PreviewDocs from './PreviewDocs';
import { useEffect, useState } from 'react';

type Props = {
  data: ImageStatsData | null;
  isLoading: boolean;
};

export default function StatsUI({ data, isLoading }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [previewDocsData, setPreviewDocsData] = useState<{
    project_id: number;
    tower_id?: number;
    s3_path: string;
    preview_url: string;
    file_type: 'image' | 'pdf';
    doc_type: string;
  } | null>(null);
  function getUnitBgColor(towerUnitItem: ImageStatsData['tower_unit_res'][0]) {
    const total_unit_count = towerUnitItem.total_unit_count;
    const tagged_unit_count = towerUnitItem.tagged_unit_count;
    const tower_docs = towerUnitItem.tower_docs;
    if (
      tagged_unit_count > 0 &&
      total_unit_count > 0 &&
      tagged_unit_count >= total_unit_count
    ) {
      return 'bg-green-300';
    } else if (
      tower_docs &&
      tower_docs?.length > 0 &&
      tagged_unit_count === 0
    ) {
      return 'bg-green-300';
    } else {
      return 'bg-red-300';
    }
  }
  useEffect(() => {
    if (showModal === true) {
      (
        document.getElementById('preview-modal') as HTMLDialogElement
      ).showModal();
    }
  }, [showModal]);
  return (
    <div className='flex w-full flex-wrap justify-between'>
      {previewDocsData && (
        <PreviewDocs
          setShowModal={setShowModal}
          previewDocsData={previewDocsData}
        />
      )}
      <div className='flex flex-col items-center'>
        <h2 className='my-4 text-xl'>Project Stats</h2>
        <div className='flex flex-col overflow-hidden rounded-2xl border-2 border-t-2 tabular-nums shadow-darkC'>
          <div className='flex gap-5 bg-base-200 py-2 font-semibold'>
            <div className='w-40 text-center'>Docs Type</div>
            <div className='w-40 text-center'>Docs Count</div>
          </div>
          {isLoading && (
            <>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Brochure
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Project Image
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Project Master Plan
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
            </>
          )}
          {!isLoading &&
            data?.project_res &&
            Object.entries(data.project_res.project_docs).map(
              ([docsType, docs_details]) => (
                <div
                  className={cn(
                    'flex items-center gap-5 border-b-2 last:border-b-0',
                    !isLoading && docs_details.length > 0
                      ? 'bg-green-300'
                      : 'bg-red-300',
                    isLoading && 'bg-transparent'
                  )}
                  key={docsType}
                >
                  <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                    {startCase(docsType)}
                  </div>
                  {!isLoading && (
                    <div className='relative w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                      {docs_details.length ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='btn btn-ghost btn-xs'>
                              {docs_details.length} docs
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {docs_details.map((docItem, index) => (
                              <DropdownMenuItem asChild key={docItem.s3_path}>
                                <button
                                  onClick={() => {
                                    setPreviewDocsData({
                                      file_type: docItem.file_type,
                                      preview_url: docItem.preview_url,
                                      project_id: data.project_res.project_id,
                                      s3_path: docItem.s3_path,
                                      doc_type: docsType,
                                    });
                                    setShowModal(true);
                                  }}
                                  className='w-full'
                                >
                                  Docs {index + 1}
                                </button>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  )}
                </div>
              )
            )}
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <h2 className='my-4 text-xl'>Tower and Unit Stats</h2>
        <div className='flex flex-col overflow-hidden rounded-2xl border-2 border-t-2 tabular-nums shadow-darkC'>
          <div className='flex gap-3 bg-base-200 px-5 py-2 font-semibold'>
            <div className='w-24 text-center'>Tower Id</div>
            <div className='w-36 text-center'>Tower Name</div>
            <div className='w-24 text-center'>Tower Plan</div>
            <div className='w-24 text-center'>Unit Plan</div>
          </div>
          {isLoading &&
            range(4).map((item) => (
              <div
                className='flex items-center gap-3 border-b-2 px-5 py-2 last:border-b-0'
                key={item}
              >
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
              </div>
            ))}
          {!isLoading &&
            data?.tower_unit_res.map((towerUnitItem) => (
              <div
                className='flex items-center gap-3 border-b-2 px-5 last:border-b-0'
                key={towerUnitItem.tower_id}
              >
                <div className='h-12 w-24 text-center leading-[48px]'>
                  {towerUnitItem.tower_id}
                </div>
                <div className='h-12 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  {towerUnitItem.tower_name}
                </div>
                <div
                  className={`h-12 w-24 text-center leading-[48px] ${towerUnitItem?.tower_docs && towerUnitItem.tower_docs.length > 0 ? 'bg-green-300' : 'bg-red-300'}`}
                >
                  {towerUnitItem.tower_docs?.length ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className='btn btn-ghost btn-xs'>
                          {towerUnitItem.tower_docs.length} docs
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {towerUnitItem.tower_docs.map((docItem, index) => (
                          <DropdownMenuItem asChild key={docItem.s3_path}>
                            <button
                              onClick={() => {
                                setPreviewDocsData({
                                  project_id: data.project_res.project_id,
                                  file_type: docItem.file_type,
                                  preview_url: docItem.preview_url,
                                  doc_type: docItem.doc_type,
                                  tower_id: towerUnitItem.tower_id,
                                  s3_path: docItem.s3_path,
                                });
                                setShowModal(true);
                              }}
                              className='w-full'
                            >
                              Docs {index + 1}
                            </button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    'N/A'
                  )}
                </div>
                <div
                  className={cn(
                    'h-12 w-24 text-center leading-[48px]',
                    getUnitBgColor(towerUnitItem)
                  )}
                >{`${towerUnitItem.tagged_unit_count}/${towerUnitItem.total_unit_count}`}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

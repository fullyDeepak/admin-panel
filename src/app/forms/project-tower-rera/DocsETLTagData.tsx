import ETLTagData from '@/components/forms/ETLTagData';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { useReraDocStore } from '@/store/useReraDocStore';
import React, { useState } from 'react';
import { useProjectStoreRera } from './useProjectStoreRera';
import RndPdfViewer from '@/components/ui/RndPdfViewer';

type DocsETLTagDataProps = {
  villageOptions:
    | {
        label: string;
        value: number;
      }[]
    | undefined;
  loadingVillages: boolean;
};

export default function DocsETLTagData({
  villageOptions,
}: DocsETLTagDataProps) {
  const {
    projectFormDataRera,
    projectFormETLTagData,
    updateProjectETLTagData,
    deleteProjectETLTagCard,
    addProjectETLTagCard,
  } = useProjectStoreRera();
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const { fetchReraDocs, reraDocs, loadingReraDocs, resetReraDocs } =
    useReraDocStore();

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>{' '}
      {projectFormDataRera.isRERAProject && (
        <>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Preview RERA Documents:</span>
            </span>
            <div className='dropdown flex-[5]'>
              {pdfPreviewDivs}
              {loadingReraDocs === 'idle' && (
                <button
                  className='btn-rezy-sm'
                  type='button'
                  disabled={Boolean(!projectFormDataRera.projectIds.length)}
                  onClick={() => {
                    resetReraDocs();
                    fetchReraDocs(projectFormDataRera.projectIds);
                  }}
                >
                  Fetch Docs
                </button>
              )}
              {loadingReraDocs === 'loading' && (
                <LoadingCircle circleColor='violet' size='medium' />
              )}
              {loadingReraDocs === 'complete' && (
                <>
                  <button
                    tabIndex={0}
                    role='button'
                    className='btn-rezy-sm m-1'
                    type='button'
                  >
                    {reraDocs.length} docs found
                  </button>
                  <ul
                    tabIndex={0}
                    className='menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow-c'
                  >
                    {reraDocs.map((doc, index) => (
                      <li key={index}>
                        <a
                          onClick={() => {
                            setPdfPreviewDivs(
                              pdfPreviewDivs.concat(
                                <RndPdfViewer
                                  title={`${doc.projectId} - ${doc.fileName}`}
                                  content={doc.content.data}
                                />
                              )
                            );
                          }}
                        >
                          {`${doc.projectId} - ${doc.fileName}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {loadingReraDocs === 'error' && (
                <div className='flex items-center gap-3'>
                  <p className='text-error'>Error in fetching docs</p>
                  <button
                    className='btn-rezy-sm'
                    type='button'
                    onClick={() => {
                      resetReraDocs();
                      fetchReraDocs(projectFormDataRera.projectIds);
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Suggested Survey:</span>
            </span>
            <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
              <span>{projectFormDataRera.surveySuggestion.join(', ')}</span>
            </span>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Suggested Plot:</span>
            </span>
            <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
              <span>{projectFormDataRera.plotSuggestion.join(', ')}</span>
            </span>
          </label>
        </>
      )}
      <ETLTagData
        villageOptions={villageOptions}
        formProjectETLTagData={projectFormETLTagData}
        updateProjectETLFormData={updateProjectETLTagData}
        deleteProjectETLCard={deleteProjectETLTagCard}
        addProjectETLCard={addProjectETLTagCard}
        showHeading={false}
      />
    </>
  );
}

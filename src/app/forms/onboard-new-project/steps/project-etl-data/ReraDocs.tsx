'use client';

import { useState } from 'react';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { useReraDocStore } from '@/store/useReraDocStore';
import LoadingCircle from '@/components/ui/LoadingCircle';
import RndPdfViewer from '@/components/ui/RndPdfViewer';

export default function ReraDocs() {
  const { onboardingData } = useOnboardingDataStore();
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const { fetchReraDocs, reraDocs, loadingReraDocs, resetReraDocs } =
    useReraDocStore();
  return (
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
            disabled={Boolean(!onboardingData.selectedReraProjects.length)}
            onClick={() => {
              resetReraDocs();
              fetchReraDocs(
                onboardingData.selectedReraProjects?.map((item) => +item.value)
              );
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
                fetchReraDocs(
                  onboardingData.selectedReraProjects?.map(
                    (item) => +item.value
                  )
                );
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import LoadingCircle from '@/components/ui/LoadingCircle';
import PDFViewer from '@/components/ui/PdfViewer';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import axiosClient from '@/utils/AxiosClient';
import React, { useState } from 'react';

interface Response {
  data: {
    projectId: number;
    fileName: string;
    content: { type: string; data: Uint8Array };
  }[];
}

type FetchDocsProps = {
  projectIds: number[];
  pdfPreviewDivs: React.JSX.Element[];
  setPdfPreviewDivs: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>;
};

export default function FetchDocs({
  projectIds,
  pdfPreviewDivs,
  setPdfPreviewDivs,
}: FetchDocsProps) {
  const [loadingReraDocsState, setLoadingReraDocsState] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const [reraDocs, setReraDocs] = useState<
    {
      projectId: number;
      fileName: string;
      content: { type: string; data: Uint8Array };
    }[]
  >([]);

  //   const { reraDocsList, setReraDocList } = useReraCorrectionStore();

  async function fetchReraDocs(projectIds: number[]) {
    try {
      setLoadingReraDocsState('loading');
      const response = await axiosClient.get<Response>(
        '/forms/rera/getReraDocs',
        {
          params: { projectIds: JSON.stringify(projectIds) },
        }
      );
      setReraDocs(response?.data?.data);
      //   setReraDocList(response?.data?.data);
      setLoadingReraDocsState('complete');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='dropdown flex-[5]'>
      {loadingReraDocsState === 'idle' && (
        <button
          className='btn-rezy-sm'
          type='button'
          onClick={() => {
            fetchReraDocs(projectIds);
          }}
        >
          Fetch Docs
        </button>
      )}
      {loadingReraDocsState === 'loading' && (
        <LoadingCircle circleColor='rose' size='medium' />
      )}
      {loadingReraDocsState === 'complete' && (
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
            className='menu dropdown-content z-[1]  rounded-box bg-base-100 p-2 shadow-c'
          >
            {reraDocs.map((doc, index) => (
              <li key={index}>
                <a
                  onClick={() => {
                    setPdfPreviewDivs(
                      pdfPreviewDivs.concat(
                        <PDFViewer
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
      {loadingReraDocsState === 'error' && (
        <div className='flex items-center gap-3'>
          <p className='text-error'>Error in fetching docs</p>
          <button
            className='btn-rezy-sm'
            type='button'
            onClick={() => {
              fetchReraDocs(projectIds);
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

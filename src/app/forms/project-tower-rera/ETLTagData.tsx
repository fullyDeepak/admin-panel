import { inputBoxClass } from '@/app/constants/tw-class';
import ChipInput from '@/components/ui/Chip';
import LoadingCircle from '@/components/ui/LoadingCircle';
import PDFViewer from '@/components/ui/PdfViewer';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import { useReraDocStore } from '@/store/useReraDocStore';
import React, { useState } from 'react';
import { BiInfoCircle } from 'react-icons/bi';

export default function ETLTagData() {
  const { projectFormDataRera, updateProjectFormDataRera } =
    useProjectStoreRera();
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const { fetchReraDocs, reraDocs, loadingReraDocs, resetReraDocs } =
    useReraDocStore();

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
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
            <LoadingCircle circleColor='rose' size='medium' />
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
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Suggested Survey:</span>
        </span>
        <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
          <span>{projectFormDataRera.surveySuggestion.join(', ')}</span>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Suggested Plot:</span>
        </span>
        <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
          <span>{projectFormDataRera.plotSuggestion.join(', ')}</span>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Doc IDs:</span>
          <span
            className='tooltip'
            data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
          >
            <BiInfoCircle size={20} />
          </span>
        </span>
        <input className={inputBoxClass} name='docIds' />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Root Docs:</span>
          <span
            className='tooltip'
            data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
          >
            <BiInfoCircle size={20} />
          </span>
        </span>
        <ChipInput
          chips={projectFormDataRera.rootDocs}
          updateFormData={updateProjectFormDataRera}
          updateKey='rootDocs'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            chips={projectFormDataRera.apartmentContains}
            updateFormData={updateProjectFormDataRera}
            updateKey='apartmentContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${projectFormDataRera.aptSurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={projectFormDataRera.aptSurveyPlotDetails}
                onChange={(e) =>
                  updateProjectFormDataRera({
                    aptSurveyPlotDetails: e.target.checked,
                  })
                }
              />
              <div className='swap-on'>AND</div>
              <div className='swap-off'>&nbsp;OR</div>
            </label>
            <p>Survey Plot Details</p>
          </div>
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            chips={projectFormDataRera.counterpartyContains}
            updateFormData={updateProjectFormDataRera}
            updateKey='counterpartyContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${projectFormDataRera.counterpartySurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={projectFormDataRera.counterpartySurveyPlotDetails}
                onChange={(e) =>
                  updateProjectFormDataRera({
                    counterpartySurveyPlotDetails: e.target.checked,
                  })
                }
              />
              <div className='swap-on'>AND</div>
              <div className='swap-off'>&nbsp;OR</div>
            </label>
            <p>Survey Plot Details</p>
          </div>
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey & Plots Equals:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormDataRera.surveyEqual}
            updateFormData={updateProjectFormDataRera}
            updateKey='surveyEqual'
            enableGeneration
            generationKey='-'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={projectFormDataRera.plotEqual}
            updateFormData={updateProjectFormDataRera}
            updateKey='plotEqual'
            enableGeneration
            generationKey=':'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey & Plot Contains:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormDataRera.surveyContains}
            updateFormData={updateProjectFormDataRera}
            updateKey='surveyContains'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={projectFormDataRera.plotContains}
            updateFormData={updateProjectFormDataRera}
            updateKey='plotContains'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>
          Locality Contains & WB Equal & Plot Equal:
        </span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormDataRera.plotEqual}
            updateFormData={updateProjectFormDataRera}
            updateKey='plotEqual'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={projectFormDataRera.plotEqual}
            updateFormData={updateProjectFormDataRera}
            updateKey='plotEqual'
            addTWClass='ml-0'
          />
          <ChipInput
            chips={projectFormDataRera.plotEqual}
            updateFormData={updateProjectFormDataRera}
            updateKey='plotEqual'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Door no. start with:</span>
        </span>
        <input className={inputBoxClass} name='doorNoStartWith' />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Apartment name doesn&apos;t contains:</span>
        </span>
        <input className={inputBoxClass} name='aptNameNotContains' />
      </label>
    </>
  );
}

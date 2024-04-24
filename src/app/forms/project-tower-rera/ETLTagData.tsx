import { inputBoxClass } from '@/app/constants/tw-class';
import ChipInput from '@/components/ui/Chip';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import { BiInfoCircle } from 'react-icons/bi';

export default function ETLTagData() {
  const { projectFormDataRera, updateProjectFormDataRera } =
    useProjectStoreRera();
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Preview Documents:</span>
        </span>
        <span className='flex flex-[5] gap-5'>
          <button className='btn-rezy-sm btn btn-info' type='button'>
            Certificate
          </button>
          <button className='btn-rezy-sm btn btn-info' type='button'>
            Details of Encumbrances
          </button>
        </span>
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
        <ChipInput
          chips={projectFormDataRera.apartmentContains}
          updateFormData={updateProjectFormDataRera}
          updateKey='apartmentContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <ChipInput
          chips={projectFormDataRera.counterpartyContains}
          updateFormData={updateProjectFormDataRera}
          updateKey='counterpartyContains'
        />
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
            addTWClass='ml-0'
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

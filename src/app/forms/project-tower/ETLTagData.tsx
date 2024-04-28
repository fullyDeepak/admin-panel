import ChipInput from '@/components/ui/Chip';
import { useProjectStore } from '@/store/useProjectStore';
import { ChangeEvent } from 'react';
import { BiInfoCircle } from 'react-icons/bi';

export default function ETLTagData() {
  const { projectFormData, updateProjectFormData } = useProjectStore();
  const docIdPattern: RegExp =
    /^(100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3})-(19[0-9][0-9]|2[0][0-9]{2})-([1-9]\d{1,5}|[1-9])$/gm;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProjectFormData({ [name]: value });
  };
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center'>
          <span>Doc ID:</span>
          <span
            className='tooltip'
            data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
          >
            <BiInfoCircle size={20} />
          </span>
        </span>
        <ChipInput
          chips={projectFormData.docId}
          updateFormData={updateProjectFormData}
          updateKey='docId'
          regexPattern={docIdPattern}
        />
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
          chips={projectFormData.rootDocs}
          updateFormData={updateProjectFormData}
          updateKey='rootDocs'
          regexPattern={docIdPattern}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            chips={projectFormData.apartmentContains}
            updateFormData={updateProjectFormData}
            updateKey='apartmentContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${projectFormData.aptSurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={projectFormData.aptSurveyPlotDetails}
                onChange={(e) =>
                  updateProjectFormData({
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
            chips={projectFormData.counterpartyContains}
            updateFormData={updateProjectFormData}
            updateKey='counterpartyContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${projectFormData.counterpartySurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={projectFormData.counterpartySurveyPlotDetails}
                onChange={(e) =>
                  updateProjectFormData({
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
        <span className='flex-[2] '>Survey & Plot Equals:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormData.surveyEquals}
            updateFormData={updateProjectFormData}
            updateKey='surveyEquals'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={projectFormData.plotEquals}
            updateFormData={updateProjectFormData}
            updateKey='plotEquals'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey & Plot Contains:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormData.surveyContains}
            updateFormData={updateProjectFormData}
            updateKey='surveyContains'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={projectFormData.plotContains}
            updateFormData={updateProjectFormData}
            updateKey='plotContains'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Locality contains, W-B, Plot:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={projectFormData.localityContains}
            updateFormData={updateProjectFormData}
            updateKey='localityContains'
            addTWClass='!ml-0'
            placeholder='Add chips'
          />
          <ChipInput
            chips={projectFormData.wardBlock}
            updateFormData={updateProjectFormData}
            updateKey='wardBlock'
            addTWClass='ml-0'
            placeholder='Add chips'
          />
          <ChipInput
            chips={projectFormData.localityPlot}
            updateFormData={updateProjectFormData}
            updateKey='localityPlot'
            addTWClass='ml-0'
            placeholder='Add chips'
          />
        </div>
      </div>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Door no. start with:</span>
        </span>
        <ChipInput
          chips={projectFormData.doorNoStartWith}
          updateFormData={updateProjectFormData}
          updateKey='doorNoStartWith'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Apartment name doesn&apos;t contains:</span>
        </span>
        <ChipInput
          chips={projectFormData.aptNameNotContains}
          updateFormData={updateProjectFormData}
          updateKey='aptNameNotContains'
        />
      </label>
    </>
  );
}

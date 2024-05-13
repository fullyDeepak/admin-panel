import { inputBoxClass } from '@/app/constants/tw-class';
import ChipInput from '@/components/ui/Chip';
import { FormETLTagDataType, FormProjectTaggingType } from '@/types/types';
import { BiInfoCircle } from 'react-icons/bi';

interface ETLTagDataType {
  formData: FormETLTagDataType;
  updateFormData: (newDetails: Partial<FormProjectTaggingType>) => void;
  showHeading?: boolean;
}

export default function ETLTagData({
  formData,
  updateFormData,
  showHeading = true,
}: ETLTagDataType) {
  const docIdPattern: RegExp =
    /^(100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3})-(19[0-9][0-9]|2[0][0-9]{2})-([1-9]\d{1,5}|[1-9])$/gm;

  return (
    <>
      {showHeading && (
        <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      )}
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Single Unit?:</span>
        </span>
        <div className='flex flex-[5] items-center gap-5'>
          <input
            className={`toggle ${formData.singleUnit ? 'toggle-success' : ''}`}
            type='checkbox'
            name='towerDoorNo'
            defaultChecked={formData.singleUnit}
            onChange={(e) => updateFormData({ singleUnit: e.target.checked })}
          />{' '}
          <span>{formData.singleUnit ? 'True' : 'False'}</span>
        </div>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Pattern:</span>
        </span>
        <div className='flex w-full flex-[5]'>
          <input
            className={`${inputBoxClass} !ml-0`}
            name='towerPattern'
            defaultValue={formData.towerPattern}
            onChange={(e) =>
              updateFormData({
                towerPattern: e.target.value,
              })
            }
            placeholder='Tower Pattern'
          />
          <input
            className={inputBoxClass}
            name='floorPattern'
            defaultValue={formData.floorPattern}
            onChange={(e) => updateFormData({ floorPattern: e.target.value })}
            placeholder='Floor Pattern'
          />
          <input
            className={inputBoxClass}
            name='unitPattern'
            defaultValue={formData.unitPattern}
            onChange={(e) => updateFormData({ unitPattern: e.target.value })}
            placeholder='Unit Pattern'
          />
        </div>
      </div>
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
          chips={formData.docId}
          updateFormData={updateFormData}
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
          chips={formData.rootDocs}
          updateFormData={updateFormData}
          updateKey='rootDocs'
          regexPattern={docIdPattern}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            chips={formData.apartmentContains}
            updateFormData={updateFormData}
            updateKey='apartmentContains'
            addTWClass='!ml-0'
            allowTrim={false}
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${formData.aptSurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={formData.aptSurveyPlotDetails}
                onChange={(e) =>
                  updateFormData({
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
            chips={formData.counterpartyContains}
            updateFormData={updateFormData}
            updateKey='counterpartyContains'
            addTWClass='!ml-0'
            allowTrim={false}
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${formData.counterpartySurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={formData.counterpartySurveyPlotDetails}
                onChange={(e) =>
                  updateFormData({
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
            chips={formData.surveyEquals}
            updateFormData={updateFormData}
            updateKey='surveyEquals'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={formData.plotEquals}
            updateFormData={updateFormData}
            updateKey='plotEquals'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey & Plot Contains:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={formData.surveyContains}
            updateFormData={updateFormData}
            updateKey='surveyContains'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={formData.plotContains}
            updateFormData={updateFormData}
            updateKey='plotContains'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Locality contains, W-B, Plot:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={formData.localityContains}
            updateFormData={updateFormData}
            updateKey='localityContains'
            addTWClass='!ml-0'
            placeholder='Add chips'
          />
          <ChipInput
            chips={formData.wardBlock}
            updateFormData={updateFormData}
            updateKey='wardBlock'
            addTWClass='ml-0'
            placeholder='Add chips'
            regexPattern={/^\d{1,2}-\d{1,2}$/gm}
          />
          <ChipInput
            chips={formData.localityPlot}
            updateFormData={updateFormData}
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
          chips={formData.doorNoStartWith}
          updateFormData={updateFormData}
          updateKey='doorNoStartWith'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Apartment name doesn&apos;t contains:</span>
        </span>
        <ChipInput
          chips={formData.aptNameNotContains}
          updateFormData={updateFormData}
          updateKey='aptNameNotContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center'>
          <span>Doc ID doesn&apos;t contains:</span>
          <span
            className='tooltip'
            data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
          >
            <BiInfoCircle size={20} />
          </span>
        </span>
        <ChipInput
          chips={formData.docIdNotContains}
          updateFormData={updateFormData}
          updateKey='docIdNotContains'
          regexPattern={docIdPattern}
        />
      </label>
    </>
  );
}

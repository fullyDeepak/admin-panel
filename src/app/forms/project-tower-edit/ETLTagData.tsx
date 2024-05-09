import { inputBoxClass } from '@/app/constants/tw-class';
import ChipInput from '@/components/ui/Chip';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import { ChangeEvent } from 'react';
import { BiInfoCircle } from 'react-icons/bi';

export default function ETLTagData() {
  const { editProjectFormData, updateEditProjectFormData } =
    useEditProjectStore();
  const docIdPattern: RegExp =
    /^(100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3})-(19[0-9][0-9]|2[0][0-9]{2})-([1-9]\d{1,5}|[1-9])$/gm;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEditProjectFormData({ [name]: value });
  };

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Single Unit?:</span>
        </span>
        <div className='flex flex-[5] items-center gap-5'>
          <input
            className={`toggle ${editProjectFormData.singleUnit ? 'toggle-success' : ''}`}
            type='checkbox'
            name='towerDoorNo'
            defaultChecked={editProjectFormData.singleUnit}
            onChange={(e) =>
              updateEditProjectFormData({ singleUnit: e.target.checked })
            }
          />{' '}
          <span>{editProjectFormData.singleUnit ? 'True' : 'False'}</span>
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
            defaultValue={editProjectFormData.towerPattern}
            onChange={(e) =>
              updateEditProjectFormData({
                towerPattern: e.target.value,
              })
            }
            placeholder='Tower Pattern'
          />
          <input
            className={inputBoxClass}
            name='floorPattern'
            defaultValue={editProjectFormData.floorPattern}
            onChange={(e) =>
              updateEditProjectFormData({ floorPattern: e.target.value })
            }
            placeholder='Floor Pattern'
          />
          <input
            className={inputBoxClass}
            name='unitPattern'
            defaultValue={editProjectFormData.unitPattern}
            onChange={(e) =>
              updateEditProjectFormData({ unitPattern: e.target.value })
            }
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
          chips={editProjectFormData.docId}
          updateFormData={updateEditProjectFormData}
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
          chips={editProjectFormData.rootDocs}
          updateFormData={updateEditProjectFormData}
          updateKey='rootDocs'
          regexPattern={docIdPattern}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            chips={editProjectFormData.apartmentContains}
            updateFormData={updateEditProjectFormData}
            updateKey='apartmentContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${editProjectFormData.aptSurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={editProjectFormData.aptSurveyPlotDetails}
                onChange={(e) =>
                  updateEditProjectFormData({
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
            chips={editProjectFormData.counterpartyContains}
            updateFormData={updateEditProjectFormData}
            updateKey='counterpartyContains'
            addTWClass='!ml-0'
          />
          <div className='flex items-center gap-2'>
            <label
              className={`swap rounded  p-1 ${editProjectFormData.counterpartySurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
            >
              <input
                type='checkbox'
                checked={editProjectFormData.counterpartySurveyPlotDetails}
                onChange={(e) =>
                  updateEditProjectFormData({
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
            chips={editProjectFormData.surveyEquals}
            updateFormData={updateEditProjectFormData}
            updateKey='surveyEquals'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={editProjectFormData.plotEquals}
            updateFormData={updateEditProjectFormData}
            updateKey='plotEquals'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey & Plot Contains:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={editProjectFormData.surveyContains}
            updateFormData={updateEditProjectFormData}
            updateKey='surveyContains'
            addTWClass='!ml-0'
          />
          <ChipInput
            chips={editProjectFormData.plotContains}
            updateFormData={updateEditProjectFormData}
            updateKey='plotContains'
            addTWClass='ml-0'
          />
        </div>
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Locality contains, W-B, Plot:</span>
        <div className='flex flex-[5] gap-2'>
          <ChipInput
            chips={editProjectFormData.localityContains}
            updateFormData={updateEditProjectFormData}
            updateKey='localityContains'
            addTWClass='!ml-0'
            placeholder='Add chips'
          />
          <ChipInput
            chips={editProjectFormData.wardBlock}
            updateFormData={updateEditProjectFormData}
            updateKey='wardBlock'
            addTWClass='ml-0'
            placeholder='Add chips'
            regexPattern={/^\d{1,2}-\d{1,2}$/gm}
          />
          <ChipInput
            chips={editProjectFormData.localityPlot}
            updateFormData={updateEditProjectFormData}
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
          chips={editProjectFormData.doorNoStartWith}
          updateFormData={updateEditProjectFormData}
          updateKey='doorNoStartWith'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Apartment name doesn&apos;t contains:</span>
        </span>
        <ChipInput
          chips={editProjectFormData.aptNameNotContains}
          updateFormData={updateEditProjectFormData}
          updateKey='aptNameNotContains'
        />
      </label>
    </>
  );
}

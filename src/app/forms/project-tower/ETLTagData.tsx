import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStore } from '@/store/useProjectStore';
import React from 'react';
import ChipInput from './Chip';

export default function ETLTagData() {
  const { projectFormData, updateProjectFormData } = useProjectStore();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProjectFormData({ [name]: value });
  };
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey Equals:</span>
        <ChipInput
          chips={projectFormData.surveyEqual}
          updateFormData={updateProjectFormData}
          updateKey='surveyEqual'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey Contains:</span>
        <ChipInput
          chips={projectFormData.surveyContains}
          updateFormData={updateProjectFormData}
          updateKey='surveyContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Plot Equals:</span>
        <ChipInput
          chips={projectFormData.plotEqual}
          updateFormData={updateProjectFormData}
          updateKey='plotEqual'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='apartmentContains'
          defaultValue={projectFormData.apartmentContains}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='counterpartyContains'
          defaultValue={projectFormData.counterpartyContains}
          onChange={handleChange}
        />
      </label>
    </>
  );
}

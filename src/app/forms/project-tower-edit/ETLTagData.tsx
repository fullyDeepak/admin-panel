import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStore } from '@/store/useProjectStore';
import React from 'react';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import ChipInput from '../project-tower/Chip';

export default function ETLTagData() {
  const { editProjectFormData, updateEditProjectFormData } =
    useEditProjectStore();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEditProjectFormData({ [name]: value });
  };
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: ETL Tag Data</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey Equals:</span>
        <ChipInput
          chips={editProjectFormData.surveyEqual}
          updateFormData={updateEditProjectFormData}
          updateKey='surveyEqual'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Survey Contains:</span>
        <ChipInput
          chips={editProjectFormData.surveyContains}
          updateFormData={updateEditProjectFormData}
          updateKey='surveyContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Plot Equals:</span>
        <ChipInput
          chips={editProjectFormData.plotEqual}
          updateFormData={updateEditProjectFormData}
          updateKey='plotEqual'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Apartment Contains:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='apartmentContains'
          defaultValue={editProjectFormData.apartmentContains}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='counterpartyContains'
          defaultValue={editProjectFormData.counterpartyContains}
          onChange={handleChange}
        />
      </label>
    </>
  );
}

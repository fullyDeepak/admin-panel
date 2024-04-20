import ChipInput from '@/components/ui/Chip';
import { useEditProjectStore } from '@/store/useEditProjectStore';

export default function ETLTagData() {
  const { editProjectFormData, updateEditProjectFormData } =
    useEditProjectStore();

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
        <ChipInput
          chips={editProjectFormData.apartmentContains}
          updateFormData={updateEditProjectFormData}
          updateKey='apartmentContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <ChipInput
          chips={editProjectFormData.counterpartyContains}
          updateFormData={updateEditProjectFormData}
          updateKey='counterpartyContains'
        />
      </label>
    </>
  );
}

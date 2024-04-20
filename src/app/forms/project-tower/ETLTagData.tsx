import ChipInput from '@/components/ui/Chip';
import { useProjectStore } from '@/store/useProjectStore';

export default function ETLTagData() {
  const { projectFormData, updateProjectFormData } = useProjectStore();
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
        <ChipInput
          chips={projectFormData.apartmentContains}
          updateFormData={updateProjectFormData}
          updateKey='apartmentContains'
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Counterparty Contains:</span>
        <ChipInput
          chips={projectFormData.counterpartyContains}
          updateFormData={updateProjectFormData}
          updateKey='counterpartyContains'
        />
      </label>
    </>
  );
}

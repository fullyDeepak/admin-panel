import { FormEvent, useId, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import ErrorTypeOne from './ErrorTypeOne';
import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';

export default function Form() {
  const { selectedTableData } = useUMCorrectionFormStore();
  const [errorType, setErrorType] = useState<{
    label: string;
    value: string;
  } | null>(null);
  async function submitForm(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const selectedData = selectedTableData?.map((item: any) => ({
      project_id: item.project_id,
      tower_id: item.tower_id,
      floor: item.floor,
      unit_number: item.unit_number,
    }));
    console.log({ selectedData });
  }

  return (
    <form
      className='z-10 mb-16 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[50%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
      id='UMCorrectionForm'
      onSubmit={submitForm}
    >
      <label className='flex flex-wrap items-start justify-between gap-5'>
        <span className='flex-[3] text-base md:text-xl'>
          Select Error Type:
        </span>
        <div className='w-full flex-[5]'>
          <Select
            className=''
            key={'projectOptions'}
            isClearable
            value={errorType}
            instanceId={useId()}
            onChange={(
              e: SingleValue<{
                value: string;
                label: string;
              }>
            ) => {
              setErrorType(e);
            }}
            options={[{ label: 'Error Type-1', value: 'err-type-1' }]}
          />
          {errorType?.value === 'err-type-1' && (
            <span className='m-0 p-0 text-xs'>
              Applied Filter: is_in_transactions = TRUE AND door_number_matched
              = TRUE AND verified IS NULL
            </span>
          )}
        </div>
      </label>
      <ErrorTypeOne />
    </form>
  );
}

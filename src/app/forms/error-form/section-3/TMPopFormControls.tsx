import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { TMSearchResponseType } from '../types';
import axiosClient from '@/utils/AxiosClient';

type Props = {
  formState: {
    docId: string;
    villageFlag: boolean;
    projectIdFlag: boolean;
    linkedDocFlag: boolean;
    counterPartyFlag: boolean;
    village: string;
    projectId: number;
    towerId: number;
    fullUnitName: string;
    counterParty: string;
    linkedDoc: string;
  };
  setFormState: Dispatch<SetStateAction<Props['formState']>>;
  setResults: Dispatch<SetStateAction<TMSearchResponseType[]>>;
};

export default function TMPopFormControls({
  formState,
  setFormState,
  setResults,
}: Props) {
  async function handleSearch() {
    setResults([]);
    const promise = axiosClient.get<{ data: TMSearchResponseType[] }>(
      '/error-correction/get-transactions/',
      {
        params: {
          doc_id: formState.docId,
          village: formState.village,
          project_id: +formState.projectId ? +formState.projectId : '',
          counter_party: formState.counterParty,
          linked_doc: formState.linkedDoc,
          village_flag: formState.villageFlag ? 'AND' : 'OR',
          project_id_flag: formState.projectIdFlag ? 'AND' : 'OR',
          counter_party_flag: formState.counterPartyFlag ? 'AND' : 'OR',
          linked_doc_flag: formState.linkedDocFlag ? 'AND' : 'OR',
        },
      }
    );
    toast.promise(
      promise,
      {
        loading: 'Searching HM...',
        success: ({ data }) => {
          setResults(
            data.data.map((item) => ({
              ...item,
              execution_date: item.execution_date?.substring(0, 10),
            }))
          );
          return `Found ${data.data.length} records.`;
        },
        error: (err) => {
          console.log(err);
          return 'Error while searching HM';
        },
      },
      { duration: 5000 }
    );
  }
  return (
    <div className='col-span-2 flex w-full justify-evenly'>
      <div className='flex max-w-md flex-col gap-2'>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Doc Id:</span>
          <input
            className={cn(inputBoxClass)}
            placeholder='Enter Doc Id'
            type='text'
            value={formState.docId}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                docId: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.villageFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  villageFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Village:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Village'
            type='text'
            value={formState.village}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                village: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.projectIdFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  projectIdFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Project Id:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Project Id'
            type='number'
            value={formState.projectId || ''}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                projectId: e.target.valueAsNumber,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.counterPartyFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  counterPartyFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Tower Id:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Tower Id'
            type='number'
            value={formState.towerId || ''}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                towerId: e.target.valueAsNumber,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.counterPartyFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  counterPartyFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Full Unit Name:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter full unit name'
            type='text'
            value={formState.fullUnitName || ''}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                fullUnitName: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.counterPartyFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  counterPartyFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Counter Party:</span>
          <input
            className={inputBoxClass}
            placeholder='Enter Counter Party'
            type='text'
            value={formState.counterParty}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                counterParty: e.target.value,
              }))
            }
          />
          <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
            <input
              type='checkbox'
              checked={formState.linkedDocFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  linkedDocFlag: e.target.checked,
                }));
              }}
            />
            <div className='swap-on'>AND</div>
            <div className='swap-off'>&nbsp;OR</div>
          </label>
        </div>
        <div className='flex items-center gap-5'>
          <span className='flex-[2]'>Linked Doc:</span>
          <input
            className={cn(inputBoxClass, 'ml-0 flex-[6]')}
            placeholder='Enter Linked Doc'
            type='text'
            value={formState.linkedDoc}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                linkedDoc: e.target.value,
              }))
            }
          />
        </div>
        <button
          className='btn btn-neutral btn-sm max-w-fit self-center'
          onClick={handleSearch}
        >
          Search TM
        </button>
      </div>
    </div>
  );
}

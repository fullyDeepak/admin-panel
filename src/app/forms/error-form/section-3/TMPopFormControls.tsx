import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { ErrorTableDataType, TMSearchResponseType } from '../types';
import axiosClient from '@/utils/AxiosClient';
import ChipInputV2 from '@/components/ui/ChipV2';

type Props = {
  formState: {
    docIds: string[];
    villageFlag: boolean;
    projectIdFlag: boolean;
    towerIdFlag: boolean;
    fullUnitNameFlag: boolean;
    linkedDocFlag: boolean;
    counterPartyFlag: boolean;
    village: string;
    projectId: number;
    towerId: number;
    fullUnitName: string;
    counterParty: string[];
    linkedDoc: string;
  };
  setFormState: Dispatch<SetStateAction<Props['formState']>>;
  setResults: Dispatch<SetStateAction<TMSearchResponseType[]>>;
  rowData: ErrorTableDataType;
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
          doc_ids: formState.docIds,
          village: formState.village,
          project_id: +formState.projectId ? +formState.projectId : '',
          tower_id: +formState.towerId ? +formState.towerId : '',
          full_unit_name: formState.fullUnitName,
          counter_party: encodeURIComponent(
            JSON.stringify(formState.counterParty)
          ),
          linked_doc: formState.linkedDoc,
          village_flag: formState.villageFlag ? 'AND' : 'OR',
          project_id_flag: formState.projectIdFlag ? 'AND' : 'OR',
          tower_id_flag: formState.towerIdFlag ? 'AND' : 'OR',
          full_unit_name_flag: formState.fullUnitNameFlag ? 'AND' : 'OR',
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
  console.log({ formState });
  return (
    <div className='flex w-full justify-evenly'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-5 text-sm'>
          <span className='mr-2 flex-[2] text-base'>Doc Ids:</span>
          <ChipInputV2
            chips={formState.docIds}
            onChange={(e) => setFormState({ ...formState, docIds: e })}
            placeholder='Enter Doc Ids'
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
              checked={formState.towerIdFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  towerIdFlag: e.target.checked,
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
              checked={formState.fullUnitNameFlag}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  fullUnitNameFlag: e.target.checked,
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
          <span className='flex-[2]'>Counter Parties:</span>
          <ChipInputV2
            chips={formState.counterParty}
            onChange={(e) => setFormState({ ...formState, counterParty: e })}
            placeholder='Enter Counter parties'
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

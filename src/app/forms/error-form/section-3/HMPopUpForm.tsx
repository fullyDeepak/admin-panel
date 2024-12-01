import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { HMSearchResponseType } from '../types';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import axiosClient from '@/utils/AxiosClient';
import toast from 'react-hot-toast';

export default function HMPopUpForm() {
  const [formState, setFormState] = useState({
    locality: '',
    doorNo: '',
    ownerName: '',
    ownerNameFlag: true,
    doorNoFlag: true,
  });
  const [results, setResults] = useState<HMSearchResponseType[]>([]);

  async function handleSearch() {
    setResults([]);
    const promise = axiosClient.get<{ data: HMSearchResponseType[] }>(
      '/error-correction/get-house-master-records',
      {
        params: {
          locality: formState.locality,
          owner_name: formState.ownerName,
          door_no_flag: formState.doorNoFlag ? 'AND' : 'OR',
          owner_name_flag: formState.ownerNameFlag ? 'AND' : 'OR',
          door_no: formState.doorNo,
        },
      }
    );
    toast.promise(
      promise,
      {
        loading: 'Searching HM...',
        success: ({ data }) => {
          setResults(data.data);
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

  const columns = [
    {
      header: 'PTIN',
      accessorKey: 'ptin',
    },
    {
      header: 'Source',
      accessorKey: 'source',
    },
    {
      header: 'Locality',
      accessorKey: 'locality',
    },
    {
      header: 'House No-1',
      accessorKey: 'house_no',
    },
    {
      header: 'House No-2',
      accessorKey: 'level_2_house_no',
    },
    {
      header: 'Current Owner',
      accessorKey: 'current_owner',
    },
    {
      header: 'Phone',
      accessorKey: 'phone_number',
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
    },
    {
      header: 'Updated Fields',
      accessorKey: 'updated_fields',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <h3 className='pb-5 text-center text-xl font-semibold'>
        Popup Form: HM Search + Fill
      </h3>
      <div className='grid grid-cols-3 gap-5'>
        <div className='col-span-2 flex w-full justify-evenly'>
          <div className='flex max-w-sm flex-col gap-2'>
            <div className='flex items-center gap-5'>
              <span className='flex-[2]'>Locality:</span>
              <input
                className={cn(inputBoxClass, 'ml-0 flex-[6]')}
                placeholder='Enter Locality'
                type='text'
                value={formState['locality']}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    locality: e.target.value,
                  }))
                }
              />
            </div>
            <div className='flex items-center gap-5'>
              <span className='flex-[2]'>Door No:</span>
              <input
                className={inputBoxClass}
                placeholder='Enter Door No'
                type='text'
                value={formState['doorNo']}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    doorNo: e.target.value,
                  }))
                }
              />
              <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
                <input
                  type='checkbox'
                  checked={formState['doorNoFlag']}
                  onChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      doorNoFlag: e.target.checked,
                    }));
                  }}
                />
                <div className='swap-on'>AND</div>
                <div className='swap-off'>&nbsp;OR</div>
              </label>
            </div>
            <div className='flex items-center gap-5'>
              <span className='flex-[2]'>Owner Name:</span>
              <input
                className={inputBoxClass}
                placeholder='Enter Owner Name'
                type='text'
                value={formState['ownerName']}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    ownerName: e.target.value,
                  }))
                }
              />
              <label className={cn('swap swap-flip rounded p-1 font-semibold')}>
                <input
                  type='checkbox'
                  checked={formState['ownerNameFlag']}
                  onChange={(e) => {
                    setFormState((prev) => ({
                      ...prev,
                      ownerNameFlag: e.target.checked,
                    }));
                  }}
                />
                <div className='swap-on'>AND</div>
                <div className='swap-off'>&nbsp;OR</div>
              </label>
            </div>
            <button
              className='btn btn-neutral btn-sm max-w-fit self-center'
              onClick={handleSearch}
            >
              Search HM
            </button>
          </div>
        </div>
        <div>
          <span>SQL Query:</span>
          <pre className='max-h-[500px] overflow-y-auto bg-gray-100 p-3 font-mono text-sm outline outline-1 outline-gray-300'>
            {`SELECT * 
FROM 
    public.house_master
WHERE 
    "source" IS NOT NULL
    ${formState.locality ? `AND locality ILIKE '${'%' + formState.locality + '%'}'` : ``}
    ${formState.doorNo ? (formState.doorNoFlag ? `AND house_no ILIKE '${'%' + formState.doorNo + '%'}'` : `OR house_no ILIKE '${'%' + formState.doorNo + '%'}'`) : ``}
    ${formState.ownerName ? (formState.ownerNameFlag ? `AND current_owner ILIKE '${'%' + formState.ownerName + '%'}'` : `OR current_owner ILIKE '${'%' + formState.ownerName + '%'}'`) : ``}
    LIMIT 200;`}
          </pre>
        </div>
      </div>
      <div className='mt-5 max-w-full overflow-x-auto rounded-lg border border-gray-200 shadow-md'>
        {results && results.length > 0 && (
          <TanstackReactTable
            columns={columns}
            data={results}
            showAllRows
            enableSearch={false}
            showPagination={false}
          />
        )}
      </div>
    </div>
  );
}

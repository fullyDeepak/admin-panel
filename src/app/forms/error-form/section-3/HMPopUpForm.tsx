import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { HMSearchResponseType } from '../types';
import axiosClient from '@/utils/AxiosClient';
import toast from 'react-hot-toast';
import { CalendarClock, CalendarSync } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import TanstackReactTableV2 from '@/components/tables/TanstackReactTableV2';
import { useErrorFormStore } from '../useErrorFormStore';
import ChipInputV2 from '@/components/ui/ChipV2';

type Props = {
  projectTower: string;
  fullUnitName: string;
  setOpenedRowData: (data: any) => void;
  setSelectedPopup: (data: any) => void;
  doorNo: string;
  currentOwner: string;
};

export default function HMPopUpForm({
  fullUnitName,
  projectTower,
  setOpenedRowData,
  setSelectedPopup,
  doorNo,
  currentOwner,
}: Props) {
  const [formState, setFormState] = useState({
    locality: '',
    doorNo: '',
    ownerName: [] as string[],
    ownerNameFlag: false,
    doorNoFlag: true,
  });
  const [results, setResults] = useState<HMSearchResponseType[]>([]);
  const { updateCurrentTableData, projectLocality } = useErrorFormStore(
    (state) => ({
      updateCurrentTableData: state.updateCurrentTableData,
      projectLocality: state.errorFormData.projectLocality,
    })
  );

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      locality: projectLocality,
      doorNo: doorNo,
      ownerName: [currentOwner],
    }));
  }, [projectLocality, doorNo, currentOwner]);
  async function handleSearch() {
    setResults([]);
    const promise = axiosClient.get<{ data: HMSearchResponseType[] }>(
      '/error-correction/get-house-master-records',
      {
        params: {
          locality: formState.locality,
          owner_name: encodeURIComponent(JSON.stringify(formState.ownerName)),
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
          setResults(
            data.data.map((item) => ({
              ...item,
              updated_at: item.updated_at?.substring(0, 10),
              updated_fields: item.updated_fields.split('|').join(', '),
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

  const columns: ColumnDef<HMSearchResponseType, any>[] = useMemo(
    () => [
      {
        header: 'Select',
        cell: ({ row }) => (
          <button
            className='btn btn-neutral btn-xs'
            onClick={() => {
              updateCurrentTableData(projectTower, fullUnitName, {
                ptin: row.original.ptin,
                locality: row.original.locality,
                door_no: row.original.house_no,
                current_owner: row.original.current_owner,
              });
              setSelectedPopup(null);
              setOpenedRowData(null);
              (
                document.getElementById(
                  'error-form-dialog'
                ) as HTMLDialogElement
              )?.close();
            }}
          >
            Select
          </button>
        ),
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
        cell: ({ getValue }) => <span className='text-xs'>{getValue()}</span>,
      },
      {
        header: 'Phone',
        accessorKey: 'phone_number',
      },
      {
        header: () => <CalendarClock />,
        accessorKey: 'updated_at',
        cell: ({ getValue }) => (
          <span className='whitespace-nowrap'>{getValue()}</span>
        ),
      },
      {
        header: () => <CalendarSync />,
        accessorKey: 'updated_fields',
      },
    ],
    []
  );

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
                className={cn(inputBoxClass, 'flex-[6]')}
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
              <span className='flex-[2]'>Door No:</span>
              <input
                className={cn(inputBoxClass, 'flex-[6]')}
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
            <div className='flex items-center gap-5'>
              <span className='flex-[2]'>Owner Names:</span>
              <ChipInputV2
                chips={formState.ownerName}
                onChange={(e) => setFormState({ ...formState, ownerName: e })}
                placeholder='Enter Owner Names'
              />
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
          <pre className='max-h-[500px] w-[350px] overflow-y-auto bg-gray-100 p-3 font-mono text-sm outline outline-1 outline-gray-300'>
            {`SELECT * 
FROM 
    public.house_master
WHERE 
    "source" IS NOT NULL
    ${formState.locality ? `AND locality ILIKE '${'%' + formState.locality + '%'}'` : ``}
    ${formState.doorNo ? (formState.doorNoFlag ? `AND house_no ILIKE '${'%' + formState.doorNo + '%'}'` : `OR house_no ILIKE '${'%' + formState.doorNo + '%'}'`) : ``}
    ${
      formState.ownerName.length > 0
        ? formState.ownerNameFlag
          ? formState.ownerName.map(
              (item) => `AND current_owner ILIKE ${'%' + item + '%'}`
            )
          : formState.ownerName.map(
              (item) => `OR current_owner ILIKE ${'%' + item + '%'}`
            )
        : ``
    }
    LIMIT 200;`}
          </pre>
        </div>
      </div>
      <span className='text-center text-xl font-semibold'>
        Results Count: {results.length}
      </span>
      <div className='mt-5'>
        {results && results.length > 0 && (
          <TanstackReactTableV2
            columns={columns}
            data={results}
            showAllRows
            enableSearch={false}
            showPagination={false}
            tableHeightVH={50}
            tableWidthVW={70}
          />
        )}
      </div>
    </div>
  );
}

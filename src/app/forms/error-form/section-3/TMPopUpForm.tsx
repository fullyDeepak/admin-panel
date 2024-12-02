import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import axiosClient from '@/utils/AxiosClient';
import { useEffect, useState } from 'react';
import { ErrorTableDataType, TMSearchResponseType } from '../types';
import toast from 'react-hot-toast';
import TanstackReactTableV2 from '@/components/tables/TanstackReactTableV2';
import { ColumnDef } from '@tanstack/react-table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { useErrorFormStore } from '../useErrorFormStore';

type Props = {
  docId: string;
  projectTower: string;
  fullUnitName: string;
  setOpenedRowData: (data: any) => void;
  setSelectedPopup: (data: any) => void;
};

export default function TMPopUpForm({
  fullUnitName,
  projectTower,
  setOpenedRowData,
  setSelectedPopup,
  docId,
}: Props) {
  const [formState, setFormState] = useState({
    docId: '',
    villageFlag: true,
    projectIdFlag: true,
    linkedDocFlag: true,
    counterPartyFlag: true,
    village: '',
    projectId: 0,
    counterParty: '',
    linkedDoc: '',
  });
  const [results, setResults] = useState<TMSearchResponseType[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<TMSearchResponseType[]>([]);
  const { updateCurrentTableData } = useErrorFormStore();
  useEffect(() => {
    setFormState({
      villageFlag: true,
      projectIdFlag: true,
      linkedDocFlag: true,
      counterPartyFlag: true,
      village: '',
      projectId: 0,
      counterParty: '',
      linkedDoc: '',
      docId: docId,
    });
  }, [docId]);

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

  const columns: ColumnDef<TMSearchResponseType, any>[] = [
    {
      id: 'select',
      header: 'Select',
      cell: ({ row }) => {
        return (
          <div className='px-1'>
            {
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            }
          </div>
        );
      },
    },
    {
      header: 'Doc Id Sch',
      accessorKey: 'doc_id_schedule',
    },
    {
      header: 'Village',
      accessorKey: 'village',
    },
    {
      header: 'Date',
      accessorKey: 'execution_date',
      cell: ({ getValue }) => (
        <span className='whitespace-nowrap'>{getValue()}</span>
      ),
    },
    {
      header: 'Deed Type',
      accessorKey: 'deed_type',
    },
    {
      header: 'P Id',
      accessorKey: 'project_id',
    },
    {
      header: 'T Id',
      accessorKey: 'tower_id',
    },
    {
      header: 'Floor',
      accessorKey: 'floor',
    },
    {
      header: 'Unit',
      accessorKey: 'unit_number',
    },
    {
      header: 'Full Unit',
      accessorKey: 'flat',
    },
    {
      header: 'Party Details',
      accessorKey: 'party_details',
    },
    {
      header: 'Description',
      accessorKey: 'transaction_description',
    },
  ];

  return (
    <div className='flex flex-col items-center'>
      <h3 className='pb-5 text-center text-xl font-semibold'>
        Popup Form: TM Search + Fill
      </h3>
      <div className='grid grid-cols-3 gap-5'>
        <div className='col-span-2 flex w-full justify-evenly'>
          <div className='flex max-w-md flex-col gap-2'>
            <div className='flex items-center gap-5'>
              <span className='flex-[2]'>Doc Id:</span>
              <input
                className={cn(inputBoxClass, 'ml-0 flex-[6]')}
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
              <span className='flex-[2]'>Linked Doc:</span>
              <input
                className={inputBoxClass}
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
            <button
              className='btn btn-neutral btn-sm max-w-fit self-center'
              onClick={handleSearch}
            >
              Search TM
            </button>
          </div>
        </div>
        <div>
          <span>SQL Query:</span>
          <pre className='max-h-[500px] overflow-y-auto bg-gray-100 p-3 font-mono text-sm outline outline-1 outline-gray-300'>
            {`SELECT 
    * 
FROM 
    transactions.records
WHERE 
    doc_id IS NOT NULL
    ${`AND doc_id = '${formState.docId}'`}
    ${formState.village ? (formState.villageFlag ? `AND village = '${formState.village}'` : `OR village = ${formState.village}`) : ``}
    ${formState.projectId ? (formState.projectIdFlag ? `AND project_id = '${formState.projectId}'` : `OR project_id = '${formState.projectId}'`) : ''}
    ${formState.counterParty ? (formState.counterPartyFlag ? `AND party_details ILIKE '${'%' + formState.counterParty + '%'}'` : `OR party_details ILIKE '${'%' + formState.counterParty + '%'}'`) : ``}
    ${formState.linkedDoc ? (formState.linkedDocFlag ? `AND linked_docs ILIKE '${'%' + formState.linkedDoc + '%'}'` : `OR linked_doc ILIKE '${'%' + formState.linkedDoc + '%'}'`) : ``}
    LIMIT 200;`}
          </pre>
        </div>
      </div>
      <div className='mt-5 flex flex-col'>
        <button
          className='btn btn-accent btn-sm max-w-fit self-end'
          disabled={selectedRows.length === 0}
          onClick={() => {
            const newTMData: Partial<ErrorTableDataType> = {
              record_date: selectedRows[0].execution_date,
              doc_id_schedule: selectedRows[0].doc_id_schedule,
              deed_type: selectedRows[0].deed_type,
              tm_count: selectedRows.length.toString(),
              subRows: selectedRows.splice(1).map((item) => ({
                project_tower: '',
                full_unit_name: '',
                error_type: '',
                ptin: '',
                locality: '',
                door_no: '',
                current_owner: '',
                latest_tm_owner: '',
                generated_door_no: '',
                tm_count: '',
                cp1_names: '',
                cp2_names: '',
                record_date: item.execution_date,
                doc_id_schedule: item.doc_id_schedule,
                deed_type: item.deed_type,
                subRows: [],
              })),
            };
            updateCurrentTableData(projectTower, fullUnitName, newTMData);
            setOpenedRowData(null);
            setSelectedPopup(null);
            (
              document.getElementById('error-form-dialog') as HTMLDialogElement
            )?.close();
          }}
        >
          Replace TM Data
        </button>
        {results && results.length > 0 && (
          <TanstackReactTableV2
            columns={columns}
            data={results}
            showAllRows
            enableSearch={false}
            showPagination={false}
            tableHeightVH={50}
            tableWidthVW={85}
            isMultiSelection
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setSelectedRows={setSelectedRows}
          />
        )}
      </div>
    </div>
  );
}

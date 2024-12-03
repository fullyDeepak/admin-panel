import { useEffect, useState } from 'react';
import { ErrorTableDataType, TMSearchResponseType } from '../types';
import TanstackReactTableV2 from '@/components/tables/TanstackReactTableV2';
import { ColumnDef } from '@tanstack/react-table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { useErrorFormStore } from '../useErrorFormStore';
import TMPopFormControls from './TMPopFormControls';

type Props = {
  docId: string;
  projectTower: string;
  fullUnitName: string;
  setOpenedRowData: (data: any) => void;
  setSelectedPopup: (data: any) => void;
  currentOwner: string;
};

export default function TMPopUpFormContainer({
  fullUnitName,
  projectTower,
  setOpenedRowData,
  setSelectedPopup,
  docId,
  currentOwner,
}: Props) {
  const [formState, setFormState] = useState({
    docId: '',
    villageFlag: false,
    projectIdFlag: false,
    linkedDocFlag: false,
    counterPartyFlag: false,
    village: '',
    projectId: 0,
    towerId: 0,
    fullUnitName: '',
    counterParty: '',
    linkedDoc: '',
  });
  const [results, setResults] = useState<TMSearchResponseType[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<TMSearchResponseType[]>([]);
  const { updateCurrentTableData, projectETLVillage, projectId } =
    useErrorFormStore((state) => ({
      updateCurrentTableData: state.updateCurrentTableData,
      projectETLVillage: state.errorFormData.projectETLVillage,
      projectId: state.errorFormData.selectedProject?.value,
    }));
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      village: projectETLVillage,
      docId: docId.split('-').splice(0, 3).join('-'),
      projectId: projectId || 0,
      counterParty: currentOwner,
    }));
  }, [docId, projectETLVillage, projectId, currentOwner]);

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
        <TMPopFormControls
          formState={formState}
          setFormState={setFormState}
          setResults={setResults}
        />
        <div>
          <span>SQL Query:</span>
          <pre className='max-h-[500px] w-[300px] overflow-y-auto bg-gray-100 p-3 font-mono text-sm outline outline-1 outline-gray-300'>
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

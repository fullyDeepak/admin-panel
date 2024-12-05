import { useEffect, useState } from 'react';
import { ErrorTableDataType, TMSearchResponseType } from '../types';
import TanstackReactTableV2 from '@/components/tables/TanstackReactTableV2';
import { ColumnDef } from '@tanstack/react-table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { useErrorFormStore } from '../useErrorFormStore';
import TMPopFormControls from './TMPopFormControls';
import { Trash2 } from 'lucide-react';
import { appendTMRecord, deleteTMRecord } from '../section-2/utils';

type Props = {
  openedRowData: ErrorTableDataType;
  setOpenedRowData: (data: any) => void;
  setSelectedPopup: (data: any) => void;
};

export default function TMPopUpFormContainer({
  openedRowData,
  setOpenedRowData,
}: Props) {
  const [formState, setFormState] = useState({
    docIds: [] as string[],
    villageFlag: true,
    projectIdFlag: false,
    towerIdFlag: false,
    fullUnitNameFlag: false,
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
  const [attachedDocIdSch, setAttachedDocIdSch] = useState<string[]>([]);
  const { updateCurrentTableData, projectETLVillage, project } =
    useErrorFormStore((state) => ({
      updateCurrentTableData: state.updateCurrentTableData,
      projectETLVillage: state.errorFormData.projectETLVillage,
      project: state.errorFormData.selectedProject,
    }));
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      village: projectETLVillage,
      docIds: [],
      projectId: 0,
      towerId: 0,
      fullUnitName: '',
      counterParty: openedRowData.current_owner,
    }));
    setAttachedDocIdSch(
      openedRowData.doc_id_schedule
        ? [
            openedRowData.doc_id_schedule,
            ...openedRowData.subRows.map((item) => item.doc_id_schedule),
          ]
        : []
    );
  }, [projectETLVillage, project?.value, openedRowData]);

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
      header: 'Linked Docs',
      accessorKey: 'linked_docs',
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
      <div className='grid grid-cols-[0.5fr,10px,1fr,10px,300px] gap-10'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <span className='divider'>Attached Doc ID Sch.:</span>
            {attachedDocIdSch.length > 0 ? (
              <div className='flex flex-col gap-3 rounded-md border border-gray-300 p-2'>
                {attachedDocIdSch.map((doc, i) => (
                  <span key={doc + i} className='flex justify-between'>
                    {doc}
                    <Trash2
                      className='cursor-pointer text-red-500'
                      onClick={() => {
                        const newData = deleteTMRecord(openedRowData, doc);
                        updateCurrentTableData(
                          openedRowData.project_tower,
                          openedRowData.full_unit_name,
                          newData
                        );
                        setAttachedDocIdSch((prev) =>
                          prev.filter((item) => item !== doc)
                        );
                        setOpenedRowData(newData);
                      }}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <span className='text-center font-semibold text-error'>N/A</span>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <div className='divider'>Selected Row Data</div>
            <div>
              Project:{' '}
              <span className='font-semibold text-violet-700'>
                {project?.value + ': ' + project?.label}
              </span>
            </div>
            <div>
              Tower:{' '}
              <span className='font-semibold text-violet-700'>
                {openedRowData.project_tower.split('-')[1] +
                  ': ' +
                  openedRowData.tower_name}
              </span>
            </div>
            <div>
              Full Unit Name:{' '}
              <span className='font-semibold text-violet-700'>
                {openedRowData.full_unit_name}
              </span>
            </div>
            <div>
              ETL Village:{' '}
              <span className='font-semibold text-violet-700'>
                {projectETLVillage}
              </span>
            </div>
            <div>
              HM Current Owner:{' '}
              <span className='font-semibold text-violet-700'>
                {openedRowData.current_owner}
              </span>
            </div>
          </div>
        </div>
        <div className='divider divider-start divider-horizontal'></div>
        <TMPopFormControls
          formState={formState}
          setFormState={setFormState}
          setResults={setResults}
          rowData={openedRowData}
        />
        <div className='divider divider-start divider-horizontal'></div>
        <div>
          <span>SQL Query:</span>
          <pre className='max-h-[500px] overflow-y-auto bg-gray-100 p-3 font-mono text-sm outline outline-1 outline-gray-300'>
            {`SELECT 
    * 
FROM 
    transactions.records
WHERE 
    doc_id IS NOT NULL
    ${`AND doc_id in ('${formState.docIds.join("','")}')`}
    ${formState.village ? (formState.villageFlag ? `AND village = '${formState.village}'` : `OR village = ${formState.village}`) : ``}
    ${formState.projectId ? (formState.projectIdFlag ? `AND project_id = '${formState.projectId}'` : `OR project_id = '${formState.projectId}'`) : ''}
    ${formState.towerId ? (formState.towerIdFlag ? `AND tower_id = '${formState.towerId}'` : `OR tower_id = '${formState.towerId}'`) : ''}
    ${formState.fullUnitName ? (formState.fullUnitNameFlag ? `AND flat = '${formState.fullUnitName}'` : `OR flat = '${formState.fullUnitName}'`) : ''}
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
            let rowData: ErrorTableDataType;
            selectedRows.forEach((item) => {
              rowData = appendTMRecord(
                rowData || openedRowData,
                item.doc_id_schedule
              );
              rowData = {
                ...rowData,
                tm_count: (rowData.subRows.length + 1).toString(),
              };
              updateCurrentTableData(
                openedRowData.project_tower,
                openedRowData.full_unit_name,
                rowData
              );
              setOpenedRowData(rowData);
            });
          }}
        >
          Append Doc Id Sch.
        </button>
        <span className='text-center text-xl font-semibold'>
          Results Count: {results.length}
        </span>
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

import { useState } from 'react';
import FetchDocs from './FetchDocs';
import AdvTable from './AdvTable';
import 'rc-select/assets/index.css';
import { MasterDevelopers } from '@/components/dropdowns/MasterDevelopers';
import { useCorrectionStore } from './useCorrectionStore';
import CellEditor from './CellEditor';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ReraDMLVTableData } from '@/types/types';
import { formatISO } from 'date-fns';
import { DeveloperGroup } from '@/components/dropdowns/DevelopersGroup';
import { dateRangeFilterFn, postReraCleanData } from './utils';

export default function ReraTableSection() {
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const {
    correctionData,
    updateCurrentTableData,
    selectedTableRows,
    setSelectedTableRows,
    updateSelectedTableRows,
    tableRowSelection,
    setTableRowSelection,
  } = useCorrectionStore();
  const columnHelper = createColumnHelper<ReraDMLVTableData>();
  const reraTableColumns: ColumnDef<ReraDMLVTableData, any>[] = [
    columnHelper.accessor('id', {
      header: 'Submit',
      cell: ({ row }: any) => (
        <label>
          <button
            className='btn btn-accent btn-sm'
            type='button'
            onClick={() => {
              const data = selectedTableRows.find(
                (ele) => ele.id == row.original.id
              );
              if (!data) return;
              postReraCleanData([data]);
              setTableRowSelection({});
            }}
            disabled={!row?.getIsSelected()}
          >
            Submit
          </button>
        </label>
      ),
    }),
    {
      header: 'Approval Date',
      accessorKey: 'approval_date',
      filterFn: dateRangeFilterFn,
      meta: {
        filterVariant: 'date',
      },
      cell: ({ row }: any) =>
        formatISO(new Date(row.original.approval_date), {
          representation: 'date',
        }),
    },
    {
      header: 'Project ID',
      accessorKey: 'id',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Project Name',
      accessorKey: 'project_name',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Developer',
      accessorKey: 'dev_name',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Developer M ID',
      cell: ({ row }: any) => (
        <MasterDevelopers
          isDisabled={!row.getIsSelected()}
          SetValue={
            row.original.developer_master_id
              ? 'DEVELOPER:' + row.original.developer_master_id
              : null
          }
          onChange={(e) => {
            updateCurrentTableData(row.original.id, {
              // @ts-expect-error third party
              developer_master_id: e?.value?.split(':')[1],
            });
            updateSelectedTableRows(row.original.id, {
              // @ts-expect-error third party
              developer_master_id: e?.value?.split(':')[1],
            });
          }}
          className='w-96'
        />
      ),
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Developer G ID',
      cell: ({ row }: any) => (
        <DeveloperGroup
          isDisabled={!row.getIsSelected()}
          SetValue={
            row.original.dev_group_id ? 'G:' + row.original.dev_group_id : null
          }
          onChange={(e) => {
            updateCurrentTableData(row.original.id, {
              // @ts-expect-error third party
              dev_group_id: e?.value?.split(':')[1],
            });
            updateSelectedTableRows(row.original.id, {
              // @ts-expect-error third party
              dev_group_id: e?.value?.split(':')[1],
            });
          }}
          className='w-96'
        />
      ),
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Project Type',
      accessorKey: 'project_type',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Project SubType',
      accessorKey: 'project_subtype_calculated',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Towers',
      accessorKey: 'tower_count',
      meta: {
        filterVariant: 'range',
      },
    },
    {
      header: 'Units',
      accessorKey: 'unit_count',
      meta: {
        filterVariant: 'range',
      },
    },
    {
      header: 'Mandal',
      accessorKey: 'mandal',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Mandal ID',
      accessorKey: 'mandal_id',
      meta: {
        filterVariant: 'text',
      },
      cell: ({ row }: any) => (
        <CellEditor
          onComplete={(value) => {
            console.log(value);
            updateCurrentTableData(row.original.id, {
              mandal_id: value,
            });
            updateSelectedTableRows(row.original.id, {
              mandal_id: value,
            });
          }}
          value={row.original.mandal_id || ''}
        />
      ),
    },
    {
      header: 'Clean Mandal',
      accessorKey: 'clean_mandal_name',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Locality',
      accessorKey: 'locality',
      meta: {
        filterVariant: 'text',
      },
      cell: ({ row }: any) => (
        <CellEditor
          onComplete={(value) => {
            console.log(value);
            updateCurrentTableData(row.original.id, {
              locality: value,
            });
            updateSelectedTableRows(row.original.id, {
              locality: value,
            });
          }}
          value={row.original.locality || ''}
        />
      ),
    },
    {
      header: 'Village',
      accessorKey: 'village',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'Village ID',
      accessorKey: 'village_id',
      meta: {
        filterVariant: 'text',
      },
      cell: ({ row }: any) => (
        <CellEditor
          onComplete={(value) => {
            updateCurrentTableData(row.original.id, {
              village_id: value,
            });
            updateSelectedTableRows(row.original.id, {
              village_id: value,
            });
          }}
          value={row.original.village_id || ''}
        />
      ),
    },
    {
      header: 'Clean Village',
      accessorKey: 'clean_village_name',
      meta: {
        filterVariant: 'text',
      },
    },
    {
      header: 'RERA Docs',
      cell: ({ row }: any) =>
        row.getIsSelected() ? (
          <FetchDocs
            projectIds={[row.original?.id]}
            pdfPreviewDivs={pdfPreviewDivs}
            setPdfPreviewDivs={setPdfPreviewDivs}
          />
        ) : (
          <button className='btn btn-sm' disabled>
            Fetch Docs
          </button>
        ),
    },
  ];

  return (
    <div className='my-5 flex w-full gap-5'>
      {correctionData.reraTableData &&
        correctionData.reraTableData?.length > 0 && (
          <div className='flex w-full flex-col justify-center'>
            <h3 className='mt-5 text-center text-2xl font-semibold underline'>
              RERA Data
            </h3>
            <div className='max-w-full'>
              {pdfPreviewDivs}
              <AdvTable
                columns={reraTableColumns}
                data={correctionData.reraTableData}
                rowSelection={tableRowSelection}
                setRowSelection={setTableRowSelection}
                setSelectedRows={setSelectedTableRows}
                isMultiSelection={true}
                dateRangeFilterFn={dateRangeFilterFn}
              />
            </div>
            <button
              className='btn-rezy mx-auto my-10'
              onClick={() => {
                postReraCleanData(selectedTableRows);
                setTableRowSelection({});
              }}
            >
              Submit
            </button>
          </div>
        )}
    </div>
  );
}

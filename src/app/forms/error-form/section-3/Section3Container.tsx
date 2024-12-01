'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ErrorTableDataType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import Table from './Table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { cn } from '@/lib/utils';

export default function Section3Container() {
  const {
    errorTableData,
    tableRowSelection,
    setTableRowSelection,
    setSelectedTableRows,
  } = useErrorFormStore();
  const columns: ColumnDef<ErrorTableDataType, any>[] = [
    {
      header: 'Project + Tower',
      accessorKey: 'project_tower',
    },
    {
      header: 'Full Unit Name',
      accessorKey: 'full_unit_name',
    },
    {
      header: 'Error Type',
      accessorKey: 'error_type',
    },
    {
      id: 'select',
      header: 'Select',
      cell: ({ row }) => {
        if (row.original.project_tower.length === 0) {
          return null;
        }
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
      header: 'Change HM',
      cell: ({ row }) => {
        if (row.original.project_tower.length === 0) {
          return null;
        }
        return (
          <button
            className='btn btn-neutral btn-xs'
            type='button'
            onClick={() => {
              (
                document.getElementById(
                  'error-form-dailog'
                ) as HTMLDialogElement
              )?.showModal();
            }}
          >
            Open Pop Up
          </button>
        );
      },
    },
    {
      header: 'PTIN',
      accessorKey: 'ptin',
    },
    {
      header: 'Locality',
      accessorKey: 'locality',
    },
    {
      header: 'Door No',
      accessorKey: 'door_no',
    },
    {
      header: 'Current Owner',
      accessorKey: 'current_owner',
    },
    {
      header: 'Latest TM Owner',
      accessorKey: 'latest_tm_owner',
    },
    {
      header: 'Generated Door No',
      accessorKey: 'generated_door_no',
    },
    {
      header: 'Edit TM Records',
      cell: ({ row }) => {
        if (row.original.project_tower.length === 0) {
          return null;
        }
        return (
          <button
            className='btn btn-neutral btn-xs'
            type='button'
            onClick={() => {
              (
                document.getElementById(
                  'error-form-dailog'
                ) as HTMLDialogElement
              )?.showModal();
            }}
          >
            Open Pop Up
          </button>
        );
      },
    },
    {
      header: 'TM Count',
      accessorKey: 'tm_count',
      cell: ({ getValue }) => (
        <span
          className={cn(
            getValue() && 'badge badge-accent !p-3 text-xl tabular-nums'
          )}
        >
          {getValue()}
        </span>
      ),
    },
    {
      header: 'Record Date',
      accessorKey: 'record_date',
    },
    {
      header: 'Doc Id Sch',
      accessorKey: 'doc_id_schedule',
    },
    {
      header: 'Deed Type',
      accessorKey: 'deed_type',
    },
    {
      header: 'CP1',
      accessorKey: 'cp1_names',
    },
    {
      header: 'CP2',
      accessorKey: 'cp2_names',
    },
  ];
  return (
    <div className='mx-auto my-10 max-w-[95%]'>
      <dialog id='error-form-dailog' className='modal'>
        <div className='modal-box h-96'>
          <form method='dialog'>
            <button className='btn-circle btn-ghost btn-sm absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='text-lg font-bold'>NO data available</h3>
        </div>
      </dialog>
      {errorTableData?.length > 0 ? (
        <>
          <h3 className='my-4 text-center text-3xl font-semibold'>
            Section: 3 (UM Data)
          </h3>
          <Table
            data={errorTableData}
            columns={columns}
            showPagination={true}
            enableSearch={true}
            rowSelection={tableRowSelection}
            setRowSelection={setTableRowSelection}
            setSelectedRows={setSelectedTableRows}
            isMultiSelection={true}
          />
        </>
      ) : null}
    </div>
  );
}

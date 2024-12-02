'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ErrorTableDataType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import Table from './Table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import HMPopUpForm from './HMPopUpForm';
import TMPopUpForm from './TMPopUpForm';
import DismissibleToast from '@/components/ui/DismissibleToast';

export default function Section3Container() {
  const {
    errorTableData,
    tableRowSelection,
    setTableRowSelection,
    setSelectedTableRows,
  } = useErrorFormStore();
  const [selectedPopup, setSelectedPopup] = useState<'hm' | 'tm' | null>(null);
  const [openedRowData, setOpenedRowData] = useState<ErrorTableDataType | null>(
    null
  );
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
              setSelectedPopup('hm');
              setOpenedRowData(row.original);
              (
                document.getElementById(
                  'error-form-dialog'
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
              setSelectedPopup('tm');
              setOpenedRowData(row.original);
              (
                document.getElementById(
                  'error-form-dialog'
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
    <div className='mx-auto my-5 max-w-[95%]'>
      <dialog id='error-form-dialog' className='modal'>
        <div className='modal-box relative h-[95vh] max-h-full max-w-screen-2xl resize'>
          <form method='dialog'>
            <button
              className='btn-circle btn-ghost btn-sm absolute right-2 top-2'
              onClick={() => {
                setOpenedRowData(null);
                setSelectedPopup(null);
              }}
            >
              ✕
            </button>
          </form>
          <DismissibleToast />
          {selectedPopup === 'hm' && openedRowData ? (
            <HMPopUpForm
              fullUnitName={openedRowData.full_unit_name}
              projectTower={openedRowData.project_tower}
              setOpenedRowData={setOpenedRowData}
              setSelectedPopup={setSelectedPopup}
            />
          ) : null}
          {selectedPopup === 'tm' && openedRowData ? (
            <TMPopUpForm
              docId={openedRowData.doc_id_schedule}
              fullUnitName={openedRowData.full_unit_name}
              projectTower={openedRowData.project_tower}
              setOpenedRowData={setOpenedRowData}
              setSelectedPopup={setSelectedPopup}
            />
          ) : null}
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

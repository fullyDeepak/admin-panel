'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ErrorTableDataType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import Table from './Table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import HMPopUpForm from './HMPopUpForm';
import DismissibleToast from '@/components/ui/DismissibleToast';
import TMPopUpFormContainer from './TMPopUpFormContainer';
import { SquareArrowOutUpRight } from 'lucide-react';

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
      header: 'P + T',
      accessorKey: 'project_tower',
    },
    {
      header: 'Unit',
      accessorKey: 'full_unit_name',
    },
    {
      header: 'Error',
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
      header: 'HM',
      cell: ({ row }) => {
        if (row.original.project_tower.length === 0) {
          return null;
        }
        return (
          <button
            className='flex size-10 items-center justify-center rounded-md bg-neutral text-white'
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
            <SquareArrowOutUpRight size={20} />
          </button>
        );
      },
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
      header: 'CP2',
      accessorKey: 'cp2_names',
    },
    {
      header: 'Latest TM Owner',
      accessorKey: 'latest_tm_owner',
      cell: ({ getValue }) => (
        <p className='w-full'>
          {(getValue() as string).split('|').toReversed().join(' ⇒ ')}
        </p>
      ),
    },
    {
      header: 'Gen. Door No',
      accessorKey: 'generated_door_no',
    },
    {
      header: 'TM',
      cell: ({ row }) => {
        if (row.original.project_tower.length === 0) {
          return null;
        }
        return (
          <button
            className='flex size-10 items-center justify-center rounded-md bg-neutral text-white'
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
            <SquareArrowOutUpRight size={20} />
          </button>
        );
      },
    },
    {
      header: 'TM #',
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
              doorNo={openedRowData.door_no}
              currentOwner={openedRowData.current_owner}
            />
          ) : null}
          {selectedPopup === 'tm' && openedRowData ? (
            <TMPopUpFormContainer
              openedRowData={openedRowData}
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

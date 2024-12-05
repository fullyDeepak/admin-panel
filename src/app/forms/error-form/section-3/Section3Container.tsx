'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ErrorTableDataType } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import Table from './Table';
import { IndeterminateCheckbox } from '../../rera-correction/AdvTable';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import HMPopUpForm from './HMPopUpForm';
import TMPopUpFormContainer from './TMPopUpFormContainer';
import { SquareArrowOutUpRight, Trash2, X } from 'lucide-react';
import { deleteTMRecord } from '../section-2/utils';
import { Rnd } from 'react-rnd';

export default function Section3Container() {
  const {
    errorTableData,
    tableRowSelection,
    setTableRowSelection,
    setSelectedTableRows,
    updateCurrentTableData,
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
      id: 'cp2_dups',
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
          return (
            <button
              className='flex size-10 items-center justify-center rounded-md bg-error text-white'
              type='button'
              onClick={() => {
                const parentRow = row.getParentRow()?.original;
                if (!parentRow) return null;
                const data = deleteTMRecord(
                  row.getParentRow()!.original,
                  row.original.doc_id_schedule
                );
                updateCurrentTableData(
                  parentRow.project_tower,
                  parentRow.full_unit_name,
                  data
                );
              }}
            >
              <Trash2 size={20} />
            </button>
          );
        }
        return (
          <div className='flex flex-col gap-2'>
            <button
              className='flex size-10 items-center justify-center rounded-md bg-neutral text-white'
              type='button'
              onClick={() => {
                setSelectedPopup('tm');
                setOpenedRowData(row.original);
              }}
            >
              <SquareArrowOutUpRight size={20} />
            </button>
            <button
              className='flex size-10 items-center justify-center rounded-md bg-error text-white'
              type='button'
              onClick={() => {
                const data = deleteTMRecord(
                  row.original,
                  row.original.doc_id_schedule
                );
                updateCurrentTableData(
                  row.original.project_tower,
                  row.original.full_unit_name,
                  data
                );
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
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
      id: 'cp2_og',
    },
  ];
  return (
    <div className='mx-auto my-5 max-w-[95%]'>
      {selectedPopup && openedRowData ? (
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 1200,
            height: 600,
          }}
          className='relative z-30 !cursor-default rounded-xl bg-base-300 pt-10 shadow-c'
          cancel='.cancel'
        >
          <span
            className='cancel absolute right-0 top-0 flex h-10 w-10 cursor-default items-center justify-between rounded-tr-xl text-center hover:bg-red-500 hover:text-white'
            title='Close'
            onClick={() => {
              setOpenedRowData(null);
              setSelectedPopup(null);
            }}
          >
            <X size={30} className='pl-2' />
          </span>
          <span className='absolute top-2 mx-auto pl-4 font-semibold'>
            {selectedPopup.toUpperCase()} Pop Up Window
          </span>
          <div className='cancel h-full w-full overflow-auto overscroll-contain bg-base-100 pt-2'>
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
        </Rnd>
      ) : null}
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

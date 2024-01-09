'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  TableOptions,
  Table,
} from '@tanstack/react-table';
import { useState } from 'react';
import { GoArrowDown, GoArrowUp, GoArrowSwitch } from 'react-icons/go';

interface TableProps {
  data: object[];
  columns: ColumnDef<object, any>[];
  showPagination?: boolean;
  enableSearch?: boolean;
}

export default function TanstackReactTable({
  data,
  columns,
  showPagination = true,
  enableSearch = true,
}: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });
  return (
    <div className='mx-auto my-5 flex max-w-[80%] flex-col'>
      {enableSearch && (
        <div className='relative max-w-xs self-end'>
          <input
            type='text'
            className='block w-full rounded-md border-0 py-1.5 ps-9 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6'
            placeholder='Search for items'
            onChange={(e) => setFiltering(e.target.value)}
          />
          <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3'>
            <svg
              className='h-4 w-4 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              width={24}
              height={24}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx={11} cy={11} r={8} />
              <path d='m21 21-4.3-4.3' />
            </svg>
          </div>
        </div>
      )}
      <table className='table'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className=''
                >
                  <span className='flex cursor-pointer select-none items-center gap-1 text-base text-black/70'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {
                      {
                        asc: <GoArrowUp />,
                        desc: <GoArrowDown />,
                        false: (
                          <GoArrowSwitch
                            style={{ transform: 'rotate(90deg)' }}
                          />
                        ),
                      }[(header.column.getIsSorted() as string) ?? null]
                    }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && (
        <div className='flex w-full items-center justify-between'>
          <p className=''>{`Showing ${
            table.getState().pagination.pageIndex + 1
          } to ${table.getState().pagination.pageSize} of ${
            table.getFilteredRowModel().rows.length
          } Entries`}</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <div className='join self-end'>
            <button
              onClick={() => table.setPageIndex(0)}
              className='btn btn-outline join-item max-h-10 min-h-0 border-rose-600 hover:border-rose-600 hover:bg-rose-600'
            >
              First Page
            </button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className='btn btn-outline join-item max-h-10 min-h-0 border-rose-600 hover:border-rose-600 hover:bg-rose-600'
            >
              Prev Page
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className='btn btn-outline join-item max-h-10 min-h-0 border-rose-600 hover:border-rose-600 hover:bg-rose-600'
            >
              Next Page
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              className='btn btn-outline join-item max-h-10 min-h-0 border-rose-600 hover:border-rose-600 hover:bg-rose-600'
            >
              Last Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

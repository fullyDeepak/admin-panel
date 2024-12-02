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
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { GoArrowDown, GoArrowUp, GoArrowSwitch } from 'react-icons/go';
import {
  MdOutlineFirstPage,
  MdOutlineLastPage,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  showPagination?: boolean;
  enableSearch?: boolean;
  showAllRows?: boolean;
  tableHeightVH?: number;
  tableWidthVW?: number;
}

export default function TanstackReactTableV2<T>({
  data,
  columns,
  showPagination = true,
  enableSearch = true,
  showAllRows = false,
  tableHeightVH = 80,
  tableWidthVW = 80,
}: TableProps<T>) {
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

  useEffect(() => {
    if (showAllRows) {
      table.setPageSize(Number(table.getRowCount()));
    }
  }, [showAllRows]);
  return (
    <div className='mx-auto flex flex-col'>
      {enableSearch && (
        <div className='relative max-w-xs self-end'>
          <input
            type='text'
            className='block w-full rounded-md border-0 py-1.5 ps-9 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
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
      <div className='mx-auto flex flex-col'>
        <div className='my-5 max-h-screen rounded-lg border border-gray-200 shadow-md'>
          <table
            className='relative !block w-full border-collapse overflow-scroll bg-white text-sm text-gray-700'
            style={{ height: `${tableHeightVH}vh`, width: `${tableWidthVW}vw` }}
          >
            <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='px-3 py-4 font-semibold text-gray-900'
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
                <tr
                  key={row.id}
                  className={`cursor-pointer border-b ${row.getIsSelected() ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-4 py-3'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPagination && (
        <div className='mt-3 flex w-full items-center justify-between'>
          <p className=''>{`Total ${
            table.getFilteredRowModel().rows.length
          } Entries`}</p>
          {/* <div>{table.getRowModel().rows.length} Rows</div> */}
          <select
            value={table.getState().pagination.pageSize}
            className='select select-sm hidden border-2 border-violet-400 outline-none focus:border-violet-400 focus:outline-none md:inline-block'
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
          <div className='join self-end text-sm'>
            <button
              onClick={() => table.setPageIndex(0)}
              className='btn btn-outline join-item max-h-8 min-h-0 border-violet-600 px-2 hover:border-violet-600 hover:bg-violet-600'
            >
              <MdOutlineFirstPage size={20} />
            </button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className='btn btn-outline join-item max-h-8 min-h-0 gap-0 border-violet-600 px-2 hover:border-violet-600 hover:bg-violet-600'
            >
              <MdOutlineNavigateBefore size={20} />
              Prev
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className='btn btn-outline join-item max-h-8 min-h-0 gap-0 border-violet-600 px-2 hover:border-violet-600 hover:bg-violet-600'
            >
              Next
              <MdOutlineNavigateNext size={20} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              className='btn btn-outline join-item max-h-8 min-h-0 border-violet-600 px-2 hover:border-violet-600 hover:bg-violet-600'
            >
              <MdOutlineLastPage size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

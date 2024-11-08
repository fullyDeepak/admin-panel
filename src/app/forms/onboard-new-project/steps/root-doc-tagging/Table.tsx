import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { GoArrowDown, GoArrowSwitch, GoArrowUp, GoTrash } from 'react-icons/go';
import {
  MdOutlineFirstPage,
  MdOutlineLastPage,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  showPagination?: boolean;
  // setSelectedRows: (_data: TData[]) => void;
  // a set state function to update the source data
  // updateSourceData?: (data: TData[]) => void;
}

export default function TanstackReactTable<TData>({
  data,
  columns,
  showPagination = true,
  // setSelectedRows,
  // updateSourceData,
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const newColumn: ColumnDef<TData, any>[] = [...columns];

  const table = useReactTable({
    data,
    columns: newColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });
  return (
    <div className='flex h-[98vh] flex-col justify-between'>
      <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-md'>
        <table className='relative h-20 w-full border-collapse bg-white text-sm text-gray-700'>
          <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <div
                        className='flex cursor-pointer select-none items-center gap-1'
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className='items-center gap-1 text-base text-black/70'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.id !== 'select' && (
                          <span className=''>
                            {
                              {
                                asc: <GoArrowUp size={16} />,
                                desc: <GoArrowDown size={16} />,
                                false: (
                                  <GoArrowSwitch
                                    style={{ transform: 'rotate(90deg)' }}
                                    size={16}
                                  />
                                ),
                              }[(header.column.getIsSorted() as string) ?? null]
                            }
                          </span>
                        )}
                      </div>
                      {header.column.getCanFilter() &&
                        header.column.columnDef.meta &&
                        (
                          header.column.columnDef.meta as {
                            filterVariant: string;
                          }
                        ).filterVariant !== 'checkbox' && (
                          <Filter column={header.column} />
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className=''>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`max-w-7xl cursor-pointer border-b ${row.getIsSelected() ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='max-w-7xl px-4 py-3'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  // @ts-expect-error third party
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === 'range' ? (
    <div>
      <div className='flex flex-col justify-center'>
        {/* See faceted column filters example for min max values functionality */}
        <input
          type='number'
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className='block w-[50px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
        />
        <input
          type='number'
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className='block w-[50px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
        />
      </div>
      <div className='h-1' />
    </div>
  ) : filterVariant === 'boolean' ? (
    <div className='flex w-full justify-evenly'>
      <input
        className='checkbox-info checkbox block rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
        onChange={(e) => column.setFilterValue(e.target.checked)}
        placeholder={`Search...`}
        type='checkbox'
        checked={(columnFilterValue ?? false) as boolean}
      />
      <button onClick={() => column.setFilterValue(null)}>
        <GoTrash height={20} width={20} strokeWidth={1.3} />
      </button>
    </div>
  ) : (
    <input
      className='block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      type='text'
      value={(columnFilterValue ?? '') as string}
    />
  );
}

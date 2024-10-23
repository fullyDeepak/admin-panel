import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
  Column,
  FilterFn,
} from '@tanstack/react-table';
import { HTMLProps, useEffect, useRef, useState } from 'react';
import { GoArrowDown, GoArrowUp, GoArrowSwitch } from 'react-icons/go';
import {
  MdOutlineFirstPage,
  MdOutlineLastPage,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateType } from 'react-tailwindcss-datepicker';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  showPagination?: boolean;
  setSelectedRows: (_data: TData[]) => void;
  rowSelection: { [id: string]: boolean };
  setRowSelection: OnChangeFn<RowSelectionState>;
  isMultiSelection?: boolean;
  dateRangeFilterFn: FilterFn<any>;
}

function IndeterminateCheckbox({
  indeterminate,
  isRadio = false,
  ...rest
}: {
  indeterminate?: boolean;
  isRadio?: boolean;
} & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <>
      {isRadio ? (
        <input
          type='radio'
          ref={ref}
          className='radio cursor-pointer'
          {...rest}
        />
      ) : (
        <input
          type='checkbox'
          ref={ref}
          className='checkbox cursor-pointer'
          {...rest}
        />
      )}
    </>
  );
}

export default function AdvTable<TData>({
  data,
  columns,
  showPagination = true,
  setSelectedRows,
  rowSelection,
  setRowSelection,
  isMultiSelection = true,
  dateRangeFilterFn,
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState('');
  //   const [rowSelection, setRowSelection] = useState({});
  const newColumn: ColumnDef<TData, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <>
          {isMultiSelection ? (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ) : (
            <>Choose</>
          )}
        </>
      ),
      cell: ({ row }) => (
        <>
          <div className='px-1'>
            {isMultiSelection ? (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            ) : (
              <IndeterminateCheckbox
                isRadio={true}
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            )}
          </div>
        </>
      ),
    },
    ...columns,
  ];

  const table = useReactTable({
    data,
    columns: newColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: isMultiSelection,
    filterFns: {
      dateRange: dateRangeFilterFn,
    },
    state: {
      sorting: sorting,
      globalFilter: filtering,
      rowSelection: rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });
  table.getSelectedRowModel;

  useEffect(() => {
    const ogData = table
      .getSelectedRowModel()
      ?.rows?.map((item) => item.original);
    setSelectedRows(ogData);
  }, [rowSelection]);
  return (
    <div className='mx-auto flex flex-col'>
      <div className='my-5 max-h-screen overflow-x-auto rounded-lg border border-gray-200 shadow-md'>
        <table className='relative !block h-[70vh] w-full border-collapse overflow-y-scroll bg-white text-sm text-gray-700'>
          <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-3 py-4 font-semibold text-gray-900'
                  >
                    <div className='flex cursor-pointer select-none flex-col items-center gap-1'>
                      {header.column.getCanFilter() &&
                        header.column.columnDef.meta &&
                        (
                          header.column.columnDef.meta as {
                            filterVariant: string;
                          }
                        ).filterVariant !== 'checkbox' && (
                          <Filter column={header.column} />
                        )}
                      <div
                        className='flex items-center gap-2'
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className='items-center gap-1 text-base text-black/70'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.id !== 'select' && (
                          <span className='w-5'>
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
                className={`cursor-pointer border-b ${row.getIsSelected() ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-4 py-3'>
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
  // @ts-expect-error
  const { filterVariant } = column.columnDef.meta ?? {};

  if (filterVariant === 'range') {
    return (
      <div className='flex justify-center gap-x-1'>
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
    );
  }
  if (filterVariant === 'text') {
    return (
      <input
        className='block w-full rounded-md border-0 py-1.5 pl-2 !font-medium text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        type='text'
        value={(columnFilterValue ?? '') as string}
      />
    );
  }
  if (filterVariant === 'date') {
    const columnFilterValue = column.getFilterValue() as {
      startDate: DateType;
      endDate: DateType;
    } | null;

    const startDate = columnFilterValue?.startDate
      ? new Date(columnFilterValue.startDate)
      : undefined;
    const endDate = columnFilterValue?.endDate
      ? new Date(columnFilterValue.endDate)
      : undefined;

    return (
      <Datepicker
        onChange={(value) => {
          console.log(value);
          column.setFilterValue({
            startDate: value?.startDate
              ? new Date(value.startDate).toISOString()
              : null,
            endDate: value?.endDate
              ? new Date(value.endDate).toISOString()
              : null,
          });
        }}
        placeholder='Select Date Range'
        value={{
          startDate: startDate || null,
          endDate: endDate || null,
        }}
        showShortcuts
        primaryColor='violet'
        containerClassName={'flex relative w-44'}
        popupClassName={
          'transition-all scale-90 ease-out duration-300 absolute z-10 text-sm lg:text-xs 2xl:text-sm translate-y-4 opacity-0 hidden mt-0 -ml-12'
        }
        inputClassName='text-[10px] tabular-nums block w-full rounded-md border-0 py-1.5 pl-2 !font-medium text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
        popoverDirection='down'
      />
    );
  }
}

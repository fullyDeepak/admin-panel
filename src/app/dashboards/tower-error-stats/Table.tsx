'use client';

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { GoArrowDown, GoArrowSwitch, GoArrowUp } from 'react-icons/go';
import {
  MdOutlineFirstPage,
  MdOutlineLastPage,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md';

type Stat = {
  project_id: number;
  project_name: string;
  updated_value: string;
  'Total Generated Units': string;
  'Matched Units': string;
  'No Match': string;
  'Unit Count Manual': string;
  'ERROR 1: NAME MISMATCH': string;
  'ERROR 2: NAME MATCH BUT NO HM': string;
  'ERROR 3: IN TM NO HM NAME MISMATCH': string;
  'ERROR 4: NO TM': string;
};

interface TableProps {
  data: Stat[];
  columns: ColumnDef<Stat, any>[];
  showPagination?: boolean;
  enableSearch?: boolean;
}
// export function TowerErrorStatsTable(
//   props: Omit<TableProps, 'data' | 'columns'> & { project_id: number }
// ) {
//   const [stats, setStats] = useState<
//     (Omit<Stat, 'project_id' | 'project_name'> & {
//       tower_name: string;
//       tower_id: number | string;
//     })[]
//   >([]);
//   const {
//     isLoading: loadingStats,
//     error,
//     isError,
//   } = useQuery({
//     queryKey: ['TowerErrorStatsData', props.project_id],
//     queryFn: async () => {
//       const statsData = await axiosClient<{
//         data: (Stat & { tower_name: string; tower_id: number })[];
//       }>(`/dashboard/tower-error-stats?project_id=${props.project_id}`);
//       console.log(statsData.data);
//       const newStats = statsData.data.data
//         .map(
//           (item) =>
//             Object.fromEntries(
//               Object.entries(item).filter(
//                 ([key]) => key !== 'project_name' && key !== 'project_id'
//               )
//             ) as Omit<Stat, 'project_id' | 'project_name'> & {
//               tower_name: string;
//               tower_id: number;
//             }
//         )
//         .map((item) => ({
//           ...item,
//           tower_id: 'Tower : ' + item.tower_id,
//         }));
//       setStats(newStats);
//       return statsData.data;
//     },
//     refetchOnWindowFocus: false,
//   });

//   const table = useReactTable({
//     data: stats.filter((item) => !!item),
//     columns: stats[0]
//       ? Object.keys(stats[0]).map((item) => ({
//           header: item.toUpperCase(),
//           accessorKey: item,
//         }))
//       : [],
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   return (
//     <>
//       {loadingStats ? (
//         <tr className='my-10'>
//           <td className='text-center text-2xl font-semibold'>Loading...</td>
//         </tr>
//       ) : isError ? (
//         <tr key={'Error'} className='my-10'>
//           <td className='text-center text-2xl font-semibold'>
//             Error: {error.message}
//           </td>
//         </tr>
//       ) : stats && stats.length > 0 ? (
//         <></>
//       ) : (
//         <tr key={'NoDataTower'} className='my-10'>
//           <td className='text-center text-2xl font-semibold'>
//             No data available
//           </td>
//         </tr>
//       )}
//     </>
//   );
// }
export default function TanstackReactTable({
  data,
  columns,
  showPagination = true,
  enableSearch = true,
}: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState('');
  const [expanded, setExpanded] = useState<ExpandedState>({});

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
      expanded: expanded,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
  });
  const [expandedProject, setExpandedProject] = useState<number>(-1);
  const [towerStats, setTowerStats] = useState<
    (Omit<Stat, 'project_id' | 'project_name'> & {
      tower_name: string;
      tower_id: number | string;
    })[]
  >([]);
  const { isLoading: _LoadingTowerStats } = useQuery({
    queryKey: ['TowerErrorStatsData', expandedProject],
    queryFn: async () => {
      const statsData = await axiosClient<{
        data: (Stat & { tower_name: string; tower_id: number })[];
      }>(`/dashboard/tower-error-stats?project_id=${expandedProject}`);
      console.log(statsData.data);
      const newStats = statsData.data.data
        .map(
          (item) =>
            Object.fromEntries(
              Object.entries(item).filter(
                ([key]) => key !== 'project_name' && key !== 'project_id'
              )
            ) as Omit<Stat, 'project_id' | 'project_name'> & {
              tower_name: string;
              tower_id: number;
            }
        )
        .map((item) => ({
          ...item,
          tower_id: 'Tower : ' + item.tower_id,
        }));
      setTowerStats(newStats);
      return statsData.data;
    },
    refetchOnWindowFocus: false,
  });
  const towerTable = useReactTable({
    data: towerStats.filter((item) => !!item),
    columns: towerStats[0]
      ? Object.keys(towerStats[0]).map((item) => ({
          header: item.toUpperCase(),
          accessorKey: item,
        }))
      : [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
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
      <div className='custom-scrollbar m-5 overflow-x-auto'>
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
              <>
                <tr key={row.id} className='hover:bg-gray-100'>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {row.getCanExpand() &&
                        cell.column.columnDef.header === 'PROJECT_ID' && (
                          <span className='w-24 py-4 pr-2 text-center'>
                            <button
                              onClick={() => {
                                row.toggleExpanded();
                                setExpandedProject(row.original.project_id);
                              }}
                              className='btn btn-outline btn-sm'
                            >
                              {row.getIsExpanded() ? '👇' : '👉'}
                            </button>
                          </span>
                        )}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() &&
                  towerTable.getRowModel().rows.map((row) => (
                    <tr key={row.id} className='hover:bg-gray-100'>
                      {row
                        .getVisibleCells()
                        .filter((cell) => cell.column.id !== 'project_name')
                        .map((cell) => (
                          <td
                            key={row.id + cell.id}
                            colSpan={cell.column.id === 'project_id' ? 2 : 1}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
              </>
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

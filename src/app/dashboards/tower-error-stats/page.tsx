'use client';

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ErrorStatsTable from './Table';
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
export default function TowerErrorStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const {
    isLoading: loadingStats,
    error,
    isError,
  } = useQuery({
    queryKey: ['TowerErrorStatsData'],
    queryFn: async () => {
      const statsData = await axiosClient('/dashboard/project-error-stats');
      console.log(statsData.data);
      setStats(statsData.data.data);
      return statsData.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {loadingStats ? (
        <div className='my-10'>
          <p className='text-center text-2xl font-semibold'>Loading...</p>
        </div>
      ) : isError ? (
        <div className='my-10'>
          <p className='text-center text-2xl font-semibold'>
            Error: {error.message}
          </p>
        </div>
      ) : stats && stats.length > 0 ? (
        <div className='custom-scrollbar m-5 overflow-x-auto'>
          <ErrorStatsTable
            columns={Object.keys(stats[0]).map((item) => ({
              header: item.toUpperCase(),
              accessorKey: item,
            }))}
            data={stats.filter((item) => !!item)}
            showPagination={true}
            enableSearch={true}
          />
        </div>
      ) : (
        <div className='my-10'>
          <p className='text-center text-2xl font-semibold'>
            No data available
          </p>
        </div>
      )}
    </>
  );
}

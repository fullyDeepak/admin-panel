'use client';

import TanstackReactTable from '@/components/tables/TanstackReactTable';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function TowerErrorStatsPage() {
  const [stats, setStats] = useState<object[]>([]);
  const { isLoading: loadingStats } = useQuery({
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
      ) : stats && stats.length > 0 ? (
        <div className='m-3 mb-1'>
          <TanstackReactTable
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

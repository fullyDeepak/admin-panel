'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { DashboardResponseType } from './types';
import TanstackReactTableV2 from '@/components/tables/TanstackReactTableV2';
import { ColumnDef } from '@tanstack/react-table';
import LoadingCircle from '@/components/ui/LoadingCircle';

export default function Page() {
  const { data, isLoading } = useFetchData<DashboardResponseType[]>(
    '/dashboard/village-dashboard'
  );
  const columns: ColumnDef<DashboardResponseType, any>[] = [
    {
      header: 'Village ID',
      accessorKey: 'village_id',
    },
    {
      header: 'Village Name',
      accessorKey: 'village_name',
    },
    {
      header: 'Mandal Name',
      accessorKey: 'mandal_name',
    },
    {
      header: 'District Name',
      accessorKey: 'district_name',
    },
    {
      header: 'Replacement Status',
      accessorKey: 'replacement_status',
    },
    {
      header: 'Onboarding Status',
      accessorKey: 'onboarding_status',
    },
    {
      header: 'Replacement Count',
      accessorKey: 'replacement_count',
    },
    {
      header: 'Temp. Projects',
      accessorKey: 'temp_projects',
    },
    {
      header: 'Projects',
      accessorKey: 'projects',
    },
    {
      header: 'RERA Untagged',
      accessorKey: 'rera_untagged',
    },
    {
      header: 'SROs',
      accessorKey: 'sros',
      cell: ({ getValue }) => {
        return (
          <span>
            {(
              getValue() as {
                id: number;
                code: number;
                name: string;
              }[]
            )
              .map((item) => `${item.code}:${item.name}`)
              .join(', ')}
          </span>
        );
      },
    },
    {
      header: 'Developers',
      accessorKey: 'developers',
    },
    {
      header: 'Developer Groups',
      accessorKey: 'developer_groups',
    },
    {
      header: 'JVs',
      accessorKey: 'jvs',
    },
  ];

  return (
    <div>
      <h2 className='py-5 text-center text-2xl font-semibold'>
        Village Dashboard
      </h2>
      <div className='mx-auto mb-20 w-[80%]'>
        {data && !isLoading && (
          <TanstackReactTableV2
            data={data}
            columns={columns}
            tableWidthVW={80}
          />
        )}
        {isLoading && (
          <div className='flex h-[50dvh] flex-col items-center justify-center gap-5'>
            <LoadingCircle size='large' />
          </div>
        )}
      </div>
    </div>
  );
}

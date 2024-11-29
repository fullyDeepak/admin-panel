'use client';

import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { useErrorFormStore } from '../useErrorFormStore';

// project_tower: string;
// full_unit_name: string;
// error_type: string;
// ptin: string;
// locality: string;
// door_no: string;
// current_owner: string;
// latest_tm_owner: string;
// generated_door_no: string;

export default function Section3Container() {
  const { errorTableData } = useErrorFormStore();
  const columns = [
    {
      header: 'Project + Tower',
      accessorKey: 'project_tower',
    },
    {
      header: 'Full Unit Name',
      accessorKey: 'full_unit_name',
    },
    {
      header: 'Error Type',
      accessorKey: 'error_type',
    },
    {
      header: 'PTIN',
      accessorKey: 'ptin',
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
      header: 'Latest TM Owner',
      accessorKey: 'latest_tm_owner',
    },
    {
      header: 'Generated Door No',
      accessorKey: 'generated_door_no',
    },
  ];
  return (
    <div className='mx-auto my-10 max-w-[95%]'>
      {errorTableData?.length > 0 ? (
        <>
          <h3 className='my-4 text-center text-3xl font-semibold'>
            Section: 3 (UM Data)
          </h3>
          <TanstackReactTable
            data={errorTableData}
            columns={columns}
            showPagination={true}
            enableSearch={true}
          />
        </>
      ) : null}
    </div>
  );
}

'use client';

import axiosClient from '@/utils/AxiosClient';
import Form from './Form';
import { useQuery } from '@tanstack/react-query';
import { useUMCorrectionFormStore } from '@/store/useUMCorrectionStore';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { useEffect } from 'react';

export default function UMCorrectionPage() {
  const {
    selectedProject,
    selectedFloor,
    selectedTower,
    setSelectedProject,
    setSelectedTower,
    setSelectedFloor,
    tableData,
    fetchUMManualData,
    setTableData,
  } = useUMCorrectionFormStore();
  // populate project dropdown
  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get<{
          data: { project_id: number; name: string; count: number }[];
        }>('/unitmaster/projects');
        const options = res.data.data.map((item) => ({
          value: item.project_id,
          label: `${item.project_id}:${item.name}-(${item.count})`,
        }));
        return options;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    fetchUMManualData();
  }, [selectedProject?.value]);

  const tableColumn = [
    {
      header: 'Project Id',
      accessorKey: 'project_id',
    },
    {
      header: 'Tower Id',
      accessorKey: 'tower_id',
    },
    {
      header: 'Floor',
      accessorKey: 'floor',
    },
    {
      header: 'Unit Number',
      accessorKey: 'unit_number',
    },
    {
      header: 'Doc Id List',
      accessorKey: 'doc_id_list',
      cell: ({ row }: any) => (
        <p className='min-w-[300px]'>{row.original.doc_id_list}</p>
      ),
    },
    {
      header: 'Latest Owner',
      accessorKey: 'latest_owner',
      cell: ({ row }: any) => (
        <p className='font-semibold text-violet-600'>
          {row.original.latest_owner}
        </p>
      ),
    },
    {
      header: 'Owner List',
      accessorKey: 'owner_list',
    },
    {
      header: 'PTIN',
      accessorKey: 'ptin',
    },
    {
      header: 'Current Owner HM',
      accessorKey: 'current_owner_hm',
      cell: ({ row }: any) => (
        <p className='font-semibold text-violet-600'>
          {row.original.current_owner_hm}
        </p>
      ),
    },
    {
      header: 'Transaction Types',
      accessorKey: 'transaction_types',
    },
    {
      header: 'Master Door Number',
      accessorKey: 'master_door_number',
    },
  ];
  return (
    <div className='mx-auto mb-60 mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Unit Master Correction Form
      </h1>
      <Form
        projectOptions={projectOptions}
        loadingProjectOptions={loadingProjectOptions}
      />
      {tableData && tableData.length > 0 && (
        <div className='mx-auto my-10 max-w-[60%]'>
          <h3 className='my-5 text-center text-3xl font-semibold underline underline-offset-8'>{`UM Manual Table Data(${tableData.length})`}</h3>
          <TanstackReactTable columns={tableColumn} data={tableData} />
        </div>
      )}
    </div>
  );
}

'use client';

import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { useErrorFormStore } from '../useErrorFormStore';

export default function Section3Container() {
  const { filteredRecordsByProjectResp } = useErrorFormStore();
  const columns = [
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
      accessorKey: 'floor_number',
    },
    {
      header: 'Unit',
      accessorKey: 'unit_number',
    },
    {
      header: 'Full Unit Name',
      accessorKey: 'full_unit_name',
    },
    {
      header: 'Unit Type Id',
      accessorKey: 'unit_type_id',
    },
    {
      header: 'Generated Door No',
      accessorKey: 'generated_door_no',
    },
    {
      header: 'Door No',
      accessorKey: 'door_no',
    },
    {
      header: 'PTIN',
      accessorKey: 'ptin',
    },
    {
      header: 'Master Door Number',
      accessorKey: 'master_house_number',
    },
    {
      header: 'Door Number Type',
      accessorKey: 'door_number_type',
    },
    {
      header: 'First UM HM Match Date',
      accessorKey: 'first_um_hm_match_date',
    },
    {
      header: 'TM Matched',
      accessorKey: 'tm_matched',
    },
    {
      header: 'Doc Id Schedule List',
      accessorKey: 'doc_id_schedule_list',
    },
    {
      header: 'Last Ownership Change Doc',
      accessorKey: 'last_ownership_change_doc',
    },
    {
      header: 'Latest Owner TM',
      accessorKey: 'latest_owner_tm',
    },
    {
      header: 'Name Matched',
      accessorKey: 'name_matched',
    },
    {
      header: 'TM HM Matched',
      accessorKey: 'tm_hm_match_type',
    },
    {
      header: 'TM HM Match Confirmed',
      accessorKey: 'tm_hm_match_confidence',
    },
    {
      header: 'Name In HM',
      accessorKey: 'name_in_hm',
    },
    {
      header: 'Error Type Inferred',
      accessorKey: 'error_type_inferred',
    },
  ];
  return (
    <div className='mx-auto my-10 max-w-[95%]'>
      {filteredRecordsByProjectResp?.length > 0 ? (
        <>
          <h3 className='my-4 text-center text-3xl font-semibold'>
            Section: 3 (UM Data)
          </h3>
          <TanstackReactTable
            data={filteredRecordsByProjectResp}
            columns={columns}
            showPagination={true}
            enableSearch={true}
          />
        </>
      ) : null}
    </div>
  );
}

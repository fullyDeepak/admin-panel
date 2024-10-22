import { useMemo, useState } from 'react';
import FetchDocs from './FetchDocs';
import AdvTable from './AdvTable';
import 'rc-select/assets/index.css';
import { MasterDevelopers } from '@/components/dropdowns/MasterDevelopers';
import { useCorrectionStore } from './useCorrectionStore';

export default function ReraTableSection() {
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const reraTableColumns = useMemo(
    () => [
      {
        header: 'Submit',
        cell: ({ row }: any) => (
          <label>
            <button
              className='btn btn-accent btn-sm'
              type='button'
              onClick={() => {
                console.log(row);
                console.log({ isSelected: row.getIsSelected() });
              }}
              disabled={!row?.getIsSelected()}
            >
              Submit
            </button>
          </label>
        ),
      },
      {
        header: 'Approval Date',
        accessorKey: 'approval_date',
      },
      {
        header: 'Project ID',
        accessorKey: 'id',
      },
      {
        header: 'Project Name',
        accessorKey: 'project_name',
      },
      {
        header: 'Developer',
        accessorKey: 'dev_name',
      },
      {
        header: 'Agreement Type',
        accessorKey: 'agreement_type',
      },
      {
        header: 'Developer M ID',
        cell: ({ row }: any) => (
          <MasterDevelopers
            isDisabled={!row.getIsSelected()}
            SetValue={'DEVELOPER:' + row.original.developer_master_id}
            onChange={(e) => console.log(e)}
          />
        ),
      },
      {
        header: 'Developer G ID',
        cell: ({ row }: any) => (
          <MasterDevelopers
            isDisabled={true}
            SetValue={''}
            onChange={(e) => console.log(e)}
          />
        ),
      },
      {
        header: 'Project Type',
        accessorKey: 'project_type',
      },
      {
        header: 'Project SubType',
        accessorKey: 'project_subtype_calculated',
      },
      {
        header: 'Towers',
        accessorKey: 'tower_count',
      },
      {
        header: 'Units',
        accessorKey: 'unit_count',
      },
      {
        header: 'District ID',
        accessorKey: 'district_id',
      },
      {
        header: 'Clean District',
        accessorKey: 'clean_district_name',
      },
      {
        header: 'Mandal',
        accessorKey: 'mandal',
      },
      {
        header: 'Mandal ID',
        accessorKey: 'mandal_id',
      },
      {
        header: 'Clean Mandal',
        accessorKey: 'clean_mandal_name',
      },
      {
        header: 'Locality',
        accessorKey: 'locality',
      },
      {
        header: 'Village',
        accessorKey: 'village',
      },
      {
        header: 'Village ID',
        accessorKey: 'village_id',
      },
      {
        header: 'Clean Village',
        accessorKey: 'clean_village_name',
      },
      {
        header: 'RERA Docs',
        cell: ({ row }: any) => (
          <FetchDocs
            projectIds={[row.original?.id]}
            pdfPreviewDivs={pdfPreviewDivs}
            setPdfPreviewDivs={setPdfPreviewDivs}
          />
        ),
      },
    ],
    []
  );
  const { correctionData } = useCorrectionStore();
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<unknown[]>([]);
  return (
    <div className='my-5 flex w-full gap-5'>
      <div className='flex-1 rounded-lg border-2 p-2'>
        <h3 className='mt-5 text-center text-2xl font-semibold underline'>
          RERA Data
        </h3>

        {correctionData.reraTableData &&
          correctionData.reraTableData?.length > 0 && (
            <div className='max-w-[88vw]'>
              {pdfPreviewDivs}
              <AdvTable
                columns={reraTableColumns}
                data={correctionData.reraTableData}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                setSelectedRows={setSelectedRows}
                isMultiSelection={true}
              />
            </div>
          )}
      </div>
    </div>
  );
}

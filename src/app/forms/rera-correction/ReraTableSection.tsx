import { useMemo, useState } from 'react';
import FetchDocs from './FetchDocs';
import Table from './Table';
import { useCorrectionStoreState } from './useCorrectionStore';

export default function ReraTableSection() {
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const reraTableColumns = useMemo(
    () => [
      {
        header: 'Project ID',
        accessorKey: 'id',
      },
      {
        header: 'Project Name',
        accessorKey: 'project_name',
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
        header: 'Clean Survey',
        accessorKey: 'clean_survey_number',
      },
      {
        header: 'Clean Plot',
        accessorKey: 'clean_plot_number',
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
  const { reraTableData } = useCorrectionStoreState();
  return (
    <div className='my-5 flex w-full gap-5'>
      <div className='flex-1 rounded-lg border-2 p-2'>
        <h3 className='mt-5 text-center text-2xl font-semibold underline'>
          RERA Data
        </h3>

        {reraTableData && reraTableData?.length > 0 && (
          <div className='max-w-[88vw]'>
            {pdfPreviewDivs}
            <Table columns={reraTableColumns} data={reraTableData} />
          </div>
        )}
      </div>
    </div>
  );
}

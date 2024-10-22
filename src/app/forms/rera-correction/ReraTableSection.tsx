import { useMemo, useState } from 'react';
import FetchDocs from './FetchDocs';
import Table from './Table';
import { useCorrectionStoreState } from './useCorrectionStore';

export default function ReraTableSection() {
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const reraTableColumns = useMemo(
    () => [
      {
        header: 'Select',
        cell: ({ row }: any) => (
          <label>
            <input type='checkbox' className='checkbox' />
          </label>
        ),
      },
      {
        header: 'Submit',
        cell: ({ row }: any) => (
          <label>
            <button className='btn btn-accent btn-sm'>Submit</button>
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
          <select name='' id=''>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
          </select>
        ),
      },
      {
        header: 'Developer G ID',
        cell: ({ row }: any) => (
          <select name='' id=''>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
          </select>
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

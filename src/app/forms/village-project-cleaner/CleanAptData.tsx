import { AccessorKeyColumnDef } from '@tanstack/react-table';
import TanstackReactTable from './Table';
import { RawAptDataRow } from './table-columns';
import { SetStateAction, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';

type Props = {
  cleanedRows: (RawAptDataRow & {
    clean_apt_name: string;
    selected_project_id: string;
  })[];
  cleanedRowsColumns: AccessorKeyColumnDef<
    RawAptDataRow & {
      clean_apt_name: string;
      selected_project_id: string;
    },
    string
  >[];
  setCleanedRows: (
    _value: SetStateAction<
      (RawAptDataRow & {
        clean_apt_name: string;
        selected_project_id: string;
      })[]
    >
  ) => void;
  updateData: () => Promise<boolean>;
};

export default function CleanAptData({
  cleanedRows,
  cleanedRowsColumns,
  setCleanedRows,
  updateData,
}: Props) {
  const { selectedDMV, submitMapData } = useVillageProjectCleanerStore();
  const queryClient = useQueryClient();
  const [selectedCleanedRows, setSelectedCleanedRows] = useState<
    (RawAptDataRow & { clean_apt_name: string; selected_project_id: string })[]
  >([]);
  const [cleanRowSelection, setCleanRowSelection] = useState({});
  return (
    <>
      {selectedDMV.village?.value && (
        <div
          id='cleaned-apartment-data'
          className='mt-5 flex flex-col gap-5 px-4'
        >
          <h2 className='text-center text-2xl font-semibold'>
            Cleaned Apartment Data
          </h2>
          <div className='max-h-[50vh] overflow-y-auto'>
            <TanstackReactTable
              data={cleanedRows}
              columns={cleanedRowsColumns}
              rowSelection={cleanRowSelection}
              setRowSelection={setCleanRowSelection}
              setSelectedRows={setSelectedCleanedRows}
              isMultiSelection={true}
            />
          </div>
          <div className='flex justify-around gap-4'>
            <button
              className='btn btn-error'
              onClick={() => {
                setCleanedRows((prev) => {
                  return prev.filter(
                    (item) =>
                      !selectedCleanedRows.some(
                        (ele) =>
                          ele.raw_apt_name === item.raw_apt_name &&
                          ele.clean_survey === item.clean_survey &&
                          ele.plot_count === item.plot_count &&
                          ele.occurrence_count === item.occurrence_count
                      )
                  );
                });
                setCleanRowSelection({});
              }}
            >
              Unmap
            </button>
            <button
              className='btn btn-primary'
              onClick={async () => {
                if (await updateData()) {
                  submitMapData();
                  setCleanedRows([]);
                  await queryClient.refetchQueries({
                    queryKey: ['raw-apt-dict', selectedDMV.village],
                  });
                  await queryClient.refetchQueries({
                    queryKey: ['clean-apt-candidates', selectedDMV.village],
                  });
                  alert('Done');
                } else {
                  alert('Error');
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

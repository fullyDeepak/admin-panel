'use client';
import Form from './Form';
import {
  UMManualDataType,
  useUMCorrectionFormStore,
} from '@/store/useUMCorrectionStore';
import TanstackReactTable from './Table';
import axiosClient from '@/utils/AxiosClient';
import LoadingCircle from '@/components/ui/LoadingCircle';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function UMCorrectionPage() {
  const {
    tableData,
    setSelectedTableData,
    matchedData,
    unMatchedData,
    loadingErrOneTableData,
    fetchUMManualData,
    selectedProject,
    selectedTableData,
    matchedStaleData,
    setMatchedStaleData,
    setMatchedData,
    setUnMatchedData,
    setTableData,
  } = useUMCorrectionFormStore();
  const [rowSelection, setRowSelection] = useState({});
  const queryClient = useQueryClient();

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
    {
      header: 'Transaction HM Match Type',
      accessorKey: 'transaction_hm_match_type',
    },
  ];

  // submit form here
  async function submitForm() {
    if (
      matchedData.length === 0 &&
      unMatchedData.length === 0 &&
      matchedStaleData.length === 0 &&
      selectedProject?.value != null
    ) {
      return null;
    }
    const data = {
      matchedData: matchedData.map((item) => ({
        project_id: item.project_id,
        tower_id: item.tower_id,
        floor: item.floor,
        unit_number: item.unit_number,
      })),
      unMatchedData: unMatchedData.map((item) => ({
        project_id: item.project_id,
        tower_id: item.tower_id,
        floor: item.floor,
        unit_number: item.unit_number,
      })),
      matchedStaleData: matchedStaleData.map((item) => ({
        project_id: item.project_id,
        tower_id: item.tower_id,
        floor: item.floor,
        unit_number: item.unit_number,
      })),
    };
    const responsePromise = axiosClient.put<{
      data: {
        matched: string;
        unmatched: string;
        matchStale: string;
      };
    }>('/unitmaster/errorTypeOne', data);
    await toast.promise(
      responsePromise,
      {
        loading: 'Updating database...',
        success: (data) =>
          `Matched: ${data.data.data.matched} Match Stale: ${data.data.data.matchStale} Unmatched: ${data.data.data.unmatched}`,
        error: 'Something went wrong',
      },
      {
        success: {
          duration: 10000,
        },
      }
    );
    await queryClient.refetchQueries({ queryKey: ['projects'], type: 'all' });
    fetchUMManualData();
    setMatchedData([]);
    setMatchedStaleData([]);
    setUnMatchedData([]);
  }

  function handleDataMarking(markType: 'Matched' | 'Unmatched' | 'Stale') {
    if (markType === 'Matched') {
      const matchedDataTemp: Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (
            sTData &&
            sTData.project_id === tData.project_id &&
            sTData.tower_id === tData.tower_id &&
            sTData.floor === tData.floor &&
            sTData.unit_number === tData.unit_number
          ) {
            match = true;
            matchedDataTemp.push(tData);
          }
        });
        if (match === false) {
          newTableDataTemp.push(tData);
        }
      });
      // remove marked data from table
      setTableData(newTableDataTemp);
      //reset selectedTableData variable
      setSelectedTableData([]);
      setMatchedData([...matchedData, ...matchedDataTemp]);
    } else if (markType === 'Unmatched') {
      const unMatchedDataTemp: Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (
            sTData &&
            sTData.project_id === tData.project_id &&
            sTData.tower_id === tData.tower_id &&
            sTData.floor === tData.floor &&
            sTData.unit_number === tData.unit_number
          ) {
            match = true;
            unMatchedDataTemp.push(sTData);
          }
        });
        if (match === false) {
          newTableDataTemp.push(tData);
        }
      });
      // remove marked data from table
      setTableData(newTableDataTemp);
      //reset selectedTableData variable
      setSelectedTableData([]);
      setUnMatchedData([...unMatchedData, ...unMatchedDataTemp]);
    } else if (markType === 'Stale') {
      const matchedStaleDataTemp: Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (
            sTData &&
            sTData.project_id === tData.project_id &&
            sTData.tower_id === tData.tower_id &&
            sTData.floor === tData.floor &&
            sTData.unit_number === tData.unit_number
          ) {
            match = true;
            matchedStaleDataTemp.push(sTData);
          }
        });
        if (match === false) {
          newTableDataTemp.push(tData);
        }
      });
      // remove marked data from table
      setTableData(newTableDataTemp);
      //reset selectedTableData variable
      setSelectedTableData([]);
      setMatchedStaleData([...matchedStaleData, ...matchedStaleDataTemp]);
    }
  }
  return (
    <div className='mx-auto mb-60 mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Unit Master Correction Form
      </h1>
      <Form />
      {tableData &&
        tableData.length > 0 &&
        loadingErrOneTableData === 'complete' && (
          <div className='mx-auto my-10 max-w-[80%]'>
            <h3 className='my-5 text-center text-3xl font-semibold underline underline-offset-8'>{`UM Manual Table Data(${tableData.length})`}</h3>
            <TanstackReactTable
              columns={tableColumn}
              data={tableData}
              setSelectedRows={setSelectedTableData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
        )}

      {loadingErrOneTableData === 'loading' && (
        <span className='text-center'>
          <LoadingCircle circleColor='black' size='large' />
        </span>
      )}

      {(matchedData.length > 0 ||
        unMatchedData.length > 0 ||
        (tableData && tableData?.length > 0)) &&
        loadingErrOneTableData === 'complete' && (
          <>
            {' '}
            <div className='mt-20 flex items-center justify-center gap-5'>
              <button
                className='btn btn-success text-white'
                type='button'
                onClick={() => {
                  handleDataMarking('Matched');
                  setRowSelection({});
                }}
              >
                Mark as matched
              </button>
              <button
                className='btn btn-info text-white'
                type='button'
                onClick={() => {
                  handleDataMarking('Stale');
                  setRowSelection({});
                }}
              >
                Mark as matched stale
              </button>
              <button
                className='btn btn-error text-white'
                type='button'
                onClick={() => {
                  handleDataMarking('Unmatched');
                  setRowSelection({});
                }}
              >
                Mark as unmatched
              </button>
            </div>
            <button
              className='btn mx-auto my-16 w-40 border-none bg-violet-600 text-white hover:bg-violet-700'
              onClick={submitForm}
              type='button'
            >
              Submit
            </button>
          </>
        )}
      {(matchedData.length > 0 ||
        unMatchedData.length > 0 ||
        matchedStaleData.length > 0) && (
        <div className='mx-auto flex w-2/3 flex-col gap-5 md:flex-row'>
          <span className='my-10 flex-1'>
            <h3 className='text-center font-semibold'>Matched Data</h3>
            <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
              {JSON.stringify(
                matchedData.map((item) => ({
                  project_id: item.project_id,
                  tower_id: item.tower_id,
                  floor: item.floor,
                  unit_number: item.unit_number,
                })),
                null,
                2
              )}
            </pre>
          </span>
          <span className='my-10 flex-1'>
            <h3 className='text-center font-semibold'>Matched Stale Data</h3>
            <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
              {JSON.stringify(
                matchedStaleData.map((item) => ({
                  project_id: item.project_id,
                  tower_id: item.tower_id,
                  floor: item.floor,
                  unit_number: item.unit_number,
                })),
                null,
                2
              )}
            </pre>
          </span>
          <span className='my-10 flex-1'>
            <h3 className='text-center font-semibold'>Unmatched Data</h3>
            <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
              {JSON.stringify(
                unMatchedData.map((item) => ({
                  project_id: item.project_id,
                  tower_id: item.tower_id,
                  floor: item.floor,
                  unit_number: item.unit_number,
                })),
                null,
                2
              )}
            </pre>
          </span>
        </div>
      )}
    </div>
  );
}

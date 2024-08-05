'use client';
import Form from './Form';
import {
  UMManualDataType,
  useUMCorrectionFormStore,
} from './useUMCorrectionStore';
import TanstackReactTable from './Table';
import axiosClient from '@/utils/AxiosClient';
import LoadingCircle from '@/components/ui/LoadingCircle';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SimpleTable from '@/components/tables/SimpleTable';

export default function UMCorrectionPage() {
  const {
    tableData,
    setSelectedTableData,
    matchedData,
    unMatchedData,
    errorType,
    loadingErrData,
    setErrTwoMatchedData,
    setErrTwoSelectedUnit,
    setLoadingErrData,
    errTwoMatchedData,
    selectedErrTwoData,
    setSelectedErrTwoData,
    errTwoLeftData,
    errTwoRightData,
    fetchUMMErrData,
    selectedTower,
    selectedErrTwoFloor,
    errTwoSelectedUnit,
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

  const tableColumnErrOne = [
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
  const tableColumnErrTwoLeft = [
    'Generated Door Number',
    'Latest Owner',
    'Doc Id List',
    'Transaction Types',
    'Owner List',
  ];
  const tableColumnErrTwoRight = [
    {
      header: 'Master Door Number',
      accessorKey: 'master_door_number',
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
      header: 'mobile_number',
      accessorKey: 'mobile_number',
    },

    {
      header: 'Transaction HM Match Type',
      accessorKey: 'transaction_hm_match_type',
    },
  ];

  // submit form here
  async function submitForm(errType: 'err-1' | 'err-2') {
    if (errType === 'err-1') {
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
          id: item.id,
          project_id: item.project_id,
          tower_id: item.tower_id,
          floor: item.floor,
          unit_number: item.unit_number,
        })),
        unMatchedData: unMatchedData.map((item) => ({
          id: item.id,
          project_id: item.project_id,
          tower_id: item.tower_id,
          floor: item.floor,
          unit_number: item.unit_number,
        })),
        matchedStaleData: matchedStaleData.map((item) => ({
          id: item.id,
          project_id: item.project_id,
          tower_id: item.tower_id,
          floor: item.floor,
          unit_number: item.unit_number,
        })),
      };
      const responsePromise = axiosClient.put<{
        data: {
          matched: string;
          deleted: string;
        };
      }>('/unitmaster/errOne', data);
      await toast.promise(
        responsePromise,
        {
          loading: 'Updating database...',
          success: (data) =>
            `Updated: ${data.data.data.matched} Deleted: ${data.data.data.deleted}`,
          error: 'Something went wrong',
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      await queryClient.refetchQueries({ queryKey: ['projects'], type: 'all' });
      fetchUMMErrData();
      setMatchedData([]);
      setMatchedStaleData([]);
      setUnMatchedData([]);
    } else if (errType === 'err-2') {
      const project_id = selectedProject?.value;
      const tower_id = selectedTower?.value;
      const floor = selectedErrTwoFloor?.value;
      const unit_number = errTwoSelectedUnit?.value;
      if (
        errTwoMatchedData?.matchedData?.length === 0 &&
        errTwoMatchedData?.unmatchedData?.length === 0 &&
        (project_id != null ||
          tower_id != null ||
          floor != null ||
          unit_number != null)
      ) {
        return null;
      }
      const data = {
        project_id,
        tower_id,
        floor,
        unit_number,
        matchedData: errTwoMatchedData.matchedData?.map((item) => item.id),
        unMatchedData: errTwoMatchedData.unmatchedData?.map((item) => item.id),
        matchType: errTwoMatchedData.matchType,
      };

      const responsePromise = axiosClient.put<{
        data: {
          matched: string;
          deleted: string;
        };
      }>('/unitmaster/errTwo', data);
      await toast.promise(
        responsePromise,
        {
          loading: 'Updating database...',
          success: (data) =>
            `Matched: ${data.data.data.matched} Deleted: ${data.data.data.deleted}`,
          error: 'Something went wrong',
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      fetchUMMErrData();
      setMatchedData([]);
      setMatchedStaleData([]);
      setUnMatchedData([]);
      setErrTwoMatchedData({
        matchedData: null,
        unmatchedData: null,
        matchType: null,
      });
      setErrTwoSelectedUnit(null);
      setLoadingErrData('idle');
    }
  }

  function handleErrOneDataMarking(
    markType: 'Matched' | 'Unmatched' | 'Stale'
  ) {
    if (markType === 'Matched') {
      const matchedDataTemp: Pick<
        UMManualDataType,
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (sTData && sTData.id === tData.id) {
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
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (sTData && sTData.id === tData.id) {
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
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[] = [];
      const newTableDataTemp: UMManualDataType[] = [];
      tableData?.map((tData) => {
        let match = false;
        selectedTableData?.map((sTData) => {
          if (sTData && sTData.id === tData.id) {
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

  function handleErrTwoDataMarking(
    markType: 'Matched' | 'Unmatched' | 'Stale'
  ) {
    let unmatchedData: {
      id: number;
      master_door_number: string;
      ptin: string;
      current_owner_hm: string;
      mobile_number: string;
      transaction_hm_match_type: string;
    }[] = [];

    if (setSelectedErrTwoData && setSelectedErrTwoData.length === 1) {
      unmatchedData = errTwoRightData?.filter(
        (item) => item.ptin !== selectedErrTwoData[0]?.ptin
      );
    }
    setErrTwoMatchedData({
      matchedData: selectedErrTwoData,
      unmatchedData: unmatchedData,
      matchType: markType,
    });
  }

  return (
    <div className='mx-auto mb-60 mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Unit Master Correction Form
      </h1>
      <Form />
      {errorType?.value === 'err-type-1' &&
        tableData &&
        tableData.length > 0 &&
        loadingErrData === 'complete' && (
          <div className='mx-auto my-10 max-w-[80%]'>
            <h3 className='my-5 text-center text-3xl font-semibold underline underline-offset-8'>{`UM Manual Error-1 Table Data(${tableData.length})`}</h3>
            <TanstackReactTable
              columns={tableColumnErrOne}
              data={tableData}
              setSelectedRows={setSelectedTableData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
        )}
      {errorType?.value === 'err-type-2' && loadingErrData === 'complete' && (
        <div className='mx-auto my-10 max-w-[80%]'>
          <h3 className='my-5 text-center text-3xl font-semibold underline underline-offset-8'>{`UM Manual Error-2 Table Data`}</h3>
          {(errTwoLeftData.length !== 0 || errTwoRightData.length !== 0) && (
            <div className='flex w-full max-w-full flex-col'>
              <div className='sticky top-0 z-10 mx-auto flex-1'>
                <SimpleTable
                  columns={tableColumnErrTwoLeft}
                  tableData={errTwoLeftData.map((item) => [
                    item.generated_door_number,
                    item.latest_owner,
                    item.doc_id_list,
                    item.transaction_types,
                    item.owner_list,
                  ])}
                />
              </div>
              <div className='flex-1 overflow-x-auto'>
                <TanstackReactTable
                  columns={tableColumnErrTwoRight}
                  data={errTwoRightData}
                  setSelectedRows={setSelectedErrTwoData}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  isMultiSelection={false}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {loadingErrData === 'loading' && (
        <span className='text-center'>
          <LoadingCircle circleColor='black' size='large' />
        </span>
      )}
      {/* Err-1 controls here */}
      {loadingErrData === 'complete' &&
        errorType?.value === 'err-type-1' &&
        (matchedData.length > 0 ||
          unMatchedData.length > 0 ||
          matchedStaleData.length > 0 ||
          (tableData && tableData?.length > 0)) && (
          <>
            <div className='mt-20 flex items-center justify-center gap-5'>
              <button
                className='btn btn-success text-white'
                type='button'
                onClick={() => {
                  handleErrOneDataMarking('Matched');
                  setRowSelection({});
                }}
              >
                Mark as matched
              </button>
              <button
                className='btn btn-info text-white'
                type='button'
                onClick={() => {
                  handleErrOneDataMarking('Stale');
                  setRowSelection({});
                }}
              >
                Mark as matched stale
              </button>
              <button
                className='btn btn-error text-white'
                type='button'
                onClick={() => {
                  handleErrOneDataMarking('Unmatched');
                  setRowSelection({});
                }}
              >
                Mark as unmatched
              </button>
            </div>
            <button
              className='btn mx-auto my-16 w-40 border-none bg-violet-600 text-white hover:bg-violet-700'
              onClick={() => submitForm('err-1')}
              type='button'
            >
              Submit
            </button>
          </>
        )}

      {/* Err-2 controls here */}
      {errorType?.value === 'err-type-2' && loadingErrData === 'complete' && (
        <>
          <div className='mt-20 flex items-center justify-center gap-5'>
            <button
              className='btn btn-success text-white'
              type='button'
              onClick={() => {
                handleErrTwoDataMarking('Matched');
              }}
            >
              Mark as matched
            </button>
            <button
              className='btn btn-info text-white'
              type='button'
              onClick={() => {
                handleErrTwoDataMarking('Stale');
              }}
            >
              Mark as matched stale
            </button>
            <button
              className='btn btn-error text-white'
              type='button'
              onClick={() => {
                handleErrTwoDataMarking('Unmatched');
              }}
            >
              Marks as unmatched
            </button>
          </div>
          <button
            className='btn mx-auto my-16 w-40 border-none bg-violet-600 text-white hover:bg-violet-700'
            onClick={() => submitForm('err-2')}
            type='button'
          >
            Submit
          </button>
        </>
      )}
      {/* Error-1 preview */}
      {errorType?.value === 'err-type-1' &&
        (matchedData.length > 0 ||
          unMatchedData.length > 0 ||
          matchedStaleData.length > 0) && (
          <div className='mx-auto flex w-2/3 flex-col gap-5 md:flex-row'>
            <span className='my-10 flex-1'>
              <h3 className='text-center font-semibold'>
                Matched Data - {matchedData.length}
              </h3>
              <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
                {JSON.stringify(
                  matchedData.map((item) => ({
                    id: item.id,
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
              <h3 className='text-center font-semibold'>
                Matched Stale Data - {matchedStaleData.length}
              </h3>
              <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
                {JSON.stringify(
                  matchedStaleData.map((item) => ({
                    id: item.id,
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
              <h3 className='text-center font-semibold'>
                Unmatched Data - {unMatchedData.length}
              </h3>
              <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
                {JSON.stringify(
                  unMatchedData.map((item) => ({
                    id: item.id,
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
      {/* Error-2 preview */}
      {errorType?.value === 'err-type-2' &&
        ((errTwoMatchedData.matchedData &&
          errTwoMatchedData.matchedData.length > 0) ||
          (errTwoMatchedData.unmatchedData &&
            errTwoMatchedData.unmatchedData.length > 0)) && (
          <div className='mx-auto flex w-2/3 flex-col gap-5 md:flex-row'>
            <span className='my-10 flex-1'>
              <h3 className='text-center font-semibold'>
                Selected Data({errTwoMatchedData.matchType})
              </h3>
              <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
                {JSON.stringify(
                  errTwoMatchedData.matchedData?.map((item) => ({
                    ...item,
                  })),
                  null,
                  2
                )}
              </pre>
            </span>
            <span className='my-10 flex-1'>
              <h3 className='text-center font-semibold'>
                Unselected Data(Will be deleted) -{' '}
                {errTwoMatchedData.unmatchedData?.length}
              </h3>
              <pre className='mx-auto max-h-[500px] overflow-y-auto text-wrap border bg-gray-100 font-mono text-sm'>
                {JSON.stringify(
                  errTwoMatchedData.unmatchedData?.map((item) => ({
                    ...item,
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

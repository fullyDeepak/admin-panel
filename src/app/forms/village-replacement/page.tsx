'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import CSVReader from 'react-csv-reader';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import Sheet from '@/components/tables/Sheet';
import toast, { Toaster } from 'react-hot-toast';
import TanstackReactTable from '@/components/tables/TanstackReactTable';

interface DeleteVillageParams {
  village_id: string;
  raw_village_name: string;
}

interface RawVillageData {
  rawVillages: DeleteVillageParams[];
  cols: {
    header: string;
    accessorKey: string;
    cell?: any;
    enableSorting?: boolean;
  }[];
}

export default function page() {
  const [rawCsvData, setRawCSVData] = useState<string[][]>();
  const [cleanCsvData, setCleanCSVData] = useState<string[]>();
  const [cleanCsvFlag, setCleanCSVFlag] = useState<boolean>(false);
  const [previewCSV, setPreviewCSV] = useState<boolean>(false);
  const [validCSV, setValidCSV] = useState<boolean>(false);
  const [isRawVillageDataAvailable, setIsRawVillageDataAvailable] = useState<
    'Not Loaded' | 'Not Available' | 'Available'
  >('Not Loaded');
  const [selectedState, setSelectedState] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedMandal, setSelectedMandal] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: number;
  } | null>();

  let loadingToastId: string;
  const queryClient = useQueryClient();

  // populate state dropdown
  const {
    isPending: loadingStates,
    error: stateError,
    status: stateCallStatus,
    data: stateOptions,
  } = useQuery({
    queryKey: ['state'],
    queryFn: () => fetchDropdownOption('states'),
    staleTime: Infinity,
  });

  //   set Telangana on first load
  useEffect(() => {
    if ((stateOptions ?? []).length > 0) {
      setSelectedState(stateOptions![27]);
    }
  }, [stateOptions]);

  // populate district dropdown
  const {
    isPending: loadingDistricts,
    error: distError,
    status: districtCallStatus,
    data: districtOptions,
  } = useQuery({
    queryKey: ['district', selectedState],
    queryFn: () => {
      if (selectedState !== undefined && selectedState !== null) {
        console.log('fetching districts', selectedState);
        return fetchDropdownOption('districts', 'state', selectedState?.value);
      }
      return [];
    },
    staleTime: Infinity,
  });

  // populate mandal dropdown
  const {
    isPending: loadingMandals,
    error: mandalError,
    status: mandalCallStatus,
    data: mandalOptions,
  } = useQuery({
    queryKey: ['mandal', selectedDistrict],
    queryFn: () => {
      if (selectedDistrict !== undefined && selectedDistrict !== null) {
        console.log('fetching mandals', selectedDistrict);
        return fetchDropdownOption(
          'mandals',
          'district',
          selectedDistrict?.value
        );
      }
      return [];
    },
    staleTime: Infinity,
  });

  // populate village dropdown
  const {
    isPending: loadingVillages,
    error: villageError,
    status: villageCallStatus,
    data: villageOptions,
  } = useQuery({
    queryKey: ['village', selectedMandal],
    queryFn: () => {
      if (selectedMandal !== undefined && selectedMandal !== null) {
        console.log('fetching villages', selectedMandal);
        return fetchDropdownOption('villages', 'mandal', selectedMandal?.value);
      }
      return [];
    },
    staleTime: Infinity,
  });
  //   UseMutationResult<
  //     unknown,
  //     Error,
  //     { village_id: string; raw_village_name: string }
  //   >

  async function deleteVillage(params: DeleteVillageParams) {
    toast.loading(
      `Deleting village ${params.raw_village_name} from database.`,
      {
        id: loadingToastId,
      }
    );
    try {
      const response = await axiosClient.delete(
        '/forms/raw_villagereplacements',
        {
          params: {
            village_id: params.village_id,
            raw_village_name: params.raw_village_name,
          },
        }
      );
      if (response.status === 200) {
        toast.dismiss(loadingToastId);
        toast.success(`Deleted "${params.raw_village_name}" from database.`, {
          id: loadingToastId,
          duration: 3000,
        });
        const prevRawVillages = queryClient.getQueryData<RawVillageData>([
          'rawVillage',
          selectedVillage,
        ]);
        const updatedRawVillages = prevRawVillages!.rawVillages.filter(
          (village) => village !== params
        );
        queryClient.setQueryData<RawVillageData>(
          ['rawVillage', selectedVillage],
          {
            ...prevRawVillages!,
            rawVillages: updatedRawVillages,
          }
        );
      } else if (response.status === 204) {
        console.log('not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { mutate } = useMutation({ mutationFn: deleteVillage });

  async function fetchRawVillages() {
    setIsRawVillageDataAvailable('Not Loaded');
    try {
      if (selectedVillage !== undefined && selectedVillage !== null) {
        console.log('fetching raw villages', selectedVillage);
        const response = await axiosClient.get(
          '/forms/raw_villagereplacements',
          {
            params: { village_id: selectedVillage.value },
          }
        );
        if (response.status === 204) {
          setIsRawVillageDataAvailable('Not Available');
        } else if (response.status === 200) {
          const rawVillages = response.data.data;
          const cols: {
            header: string;
            accessorKey: string;
            cell?: any;
            enableSorting?: boolean;
          }[] = Object.keys(rawVillages[0]).map((item) => ({
            header: item.toUpperCase(),
            accessorKey: item,
          }));
          cols.push({
            header: 'Action',
            accessorKey: 'action',
            enableSorting: false,
            cell: (tableProps: any) => (
              <button
                type='button'
                className='btn btn-error btn-sm rounded-full text-white'
                onClick={() => mutate(tableProps?.row.original)}
              >
                Delete
              </button>
            ),
          });
          setIsRawVillageDataAvailable('Available');
          return { rawVillages, cols };
        }
      }
    } catch (error) {
      setIsRawVillageDataAvailable('Not Available');
    }
    return { rawVillages: [], cols: [] };
  }

  const {
    isPending: loadingRawVillages,
    error: rawVillageError,
    status: rawVillageStatus,
    data: rawVillageData,
    refetch: refetchRawVillage,
  } = useQuery({
    queryKey: ['rawVillage', selectedVillage],
    queryFn: async () => fetchRawVillages(),
    staleTime: Infinity,
  });

  useEffect(() => {
    console.log(villageOptions);
  }, [villageOptions]);

  useEffect(() => {
    setSelectedVillage(null);
    setIsRawVillageDataAvailable('Not Loaded');
  }, [selectedMandal]);

  useEffect(() => {
    if (rawCsvData && rawCsvData[0].length === 1) {
      setCleanCSVData(rawCsvData.flat());
      setCleanCSVFlag(true);
    } else {
      setCleanCSVFlag(false);
    }
  }, [rawCsvData]);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadingToastId = toast.loading('Saving...');
    try {
      const data = {
        raw_villages: cleanCsvData,
        village_id: selectedVillage?.value,
      };
      const res = axiosClient.post('/forms/replace-villages', data);
      toast.success(`${(await res).data.data} village added to database.`, {
        id: loadingToastId,
        duration: 5000,
      });
      return res;
    } catch (error: any) {
      toast.error(`${error?.response?.data?.error}`, {
        id: loadingToastId,
        duration: 8000,
      });
    } finally {
      setCleanCSVData(undefined);
      setCleanCSVFlag(false);
      setRawCSVData(undefined);
      setPreviewCSV(false);
      refetchRawVillage();
    }
  };

  useEffect(() => {
    if (rawCsvData && cleanCsvFlag) {
      setValidCSV(true);
    } else if (rawCsvData && !cleanCsvFlag) {
      setValidCSV(false);
    }
  }, [rawCsvData, cleanCsvFlag]);

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: Village Replacement</h1>
      <Toaster />
      <form
        className='mt-5 flex max-w-[80%] flex-col gap-3 self-center rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        onSubmit={submitForm}
      >
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>State:</span>
          <Select
            className='w-full flex-[5]'
            key={'state'}
            options={stateOptions}
            isLoading={loadingStates}
            value={selectedState}
            controlShouldRenderValue
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedState(e);
              setSelectedDistrict(null);
            }}
            isDisabled={loadingStates}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>District:</span>
          <Select
            className='w-full flex-[5]'
            key={'district'}
            options={districtOptions || undefined}
            isLoading={loadingDistricts}
            value={selectedDistrict}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedDistrict(e);
              setSelectedMandal(null);
            }}
            isDisabled={Boolean(!selectedState)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Mandal:</span>
          <Select
            className='w-full flex-[5]'
            key={'mandal'}
            options={mandalOptions || undefined}
            isLoading={loadingMandals}
            value={selectedMandal}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedMandal(e);
              setSelectedVillage(null);
            }}
            isDisabled={Boolean(!selectedDistrict)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Village:</span>
          <Select
            className='w-full flex-[5]'
            key={'village'}
            options={villageOptions || undefined}
            isLoading={loadingVillages}
            value={selectedMandal ? selectedVillage : null}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => setSelectedVillage(e)}
            isDisabled={Boolean(!selectedMandal)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Raw Village:</span>
          <CSVReader
            onFileLoaded={(data, fileInfo, originalFile) => {
              // in csv files last rows in empty
              setRawCSVData(data.slice(0, -1));
              setPreviewCSV(true);
            }}
            cssInputClass='file-input file-input-bordered w-full'
            cssClass='flex-[5]'
          />
        </label>
        {!previewCSV && (
          <p className='self-center'>
            Note: Please upload{' '}
            <span className='kbd kbd-sm text-black'>.csv</span> file with one
            column and without header.
          </p>
        )}
        {previewCSV && (
          <div className='flex flex-col justify-center'>
            <p
              className={`self-center ${
                validCSV ? 'badge-success text-white' : 'badge-error'
              } badge badge-lg`}
            >
              {validCSV ? 'Valid' : 'Invalid'} CSV
            </p>
            <p>
              {' '}
              ⚠️ double check the first row of the preview csv before
              submitting. a header might still be present.
            </p>
          </div>
        )}
        {previewCSV && rawCsvData && validCSV && cleanCsvData && (
          <>
            <Suspense
              fallback={
                <div className='mt-5 flex justify-center'>
                  <span className='loading loading-spinner loading-lg text-center'></span>
                </div>
              }
            >
              <div className='flex items-center justify-between gap-5 overflow-x-auto'>
                <Sheet
                  data={rawCsvData}
                  height='30vh'
                  showHeaders={false}
                  deleteOption={true}
                  setSheetData={setRawCSVData}
                />
              </div>
            </Suspense>
            <div></div>
            <button
              className={`btn mt-5 text-white ${
                !!cleanCsvFlag && selectedVillage?.value
                  ? 'btn-success'
                  : 'btn-disabled'
              }`}
              type='submit'
            >
              Submit
            </button>
          </>
        )}
      </form>
      <div>
        {isRawVillageDataAvailable === 'Not Loaded' && (
          <div className='mx-auto mt-5 text-center text-lg'>
            Select village to preview available data
          </div>
        )}
        {isRawVillageDataAvailable === 'Not Available' && (
          <div className='mx-auto mt-5 text-center text-lg'>
            No data available for selected village: {selectedVillage?.label}
          </div>
        )}
        {isRawVillageDataAvailable === 'Available' && (
          <div>
            {rawVillageData !== undefined && (
              <TanstackReactTable
                data={rawVillageData.rawVillages}
                columns={rawVillageData.cols}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

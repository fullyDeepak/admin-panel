'use client';

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { SingleValue } from 'react-select';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { inputBoxClass } from '../../constants/tw-class';
import TanstackReactTable from './Table';

type rawAptDataRow = {
  district_name: string;
  district_id: string;
  mandal_name: string;
  mandal_id: string;
  village_name: string;
  village_id: string;
  raw_apt_name: string;
  clean_survey: string;
  plot_count: string;
  occurrence_count: string;
};

const columnHelper = createColumnHelper<rawAptDataRow>();
const cleaningColumnHelper = createColumnHelper<
  rawAptDataRow & { clean_apt_name: string }
>();

const rawAptSelectionColumns = [
  columnHelper.accessor('raw_apt_name', {
    header: 'Raw Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('raw_apt_name')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
    filterFn: 'includesString',
  }),
  columnHelper.accessor('clean_survey', {
    header: 'Clean Survey',
    cell: ({ row }) => (
      <p className='break max-w-7xl text-pretty break-all'>
        {row.getValue('clean_survey')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
    filterFn: 'includesString',
  }),
  columnHelper.accessor('plot_count', {
    header: 'Plot Count',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('plot_count')}
      </p>
    ),
    meta: {
      filterVariant: 'range',
    },
    filterFn: 'inNumberRange',
  }),
  columnHelper.accessor('occurrence_count', {
    header: 'Occurrence Count',
    cell: ({ row }: any) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.original.occurrence_count.toString()}
      </p>
    ),
    meta: {
      filterVariant: 'range',
    },
    filterFn: 'inNumberRange',
  }),
];

const cleanedRowsColumns = [
  cleaningColumnHelper.accessor('raw_apt_name', {
    header: 'Raw Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('raw_apt_name')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('plot_count', {
    header: 'Plot Count',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('plot_count')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('occurrence_count', {
    cell: ({ row }: any) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.original.occurrence_count.toString()}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('clean_apt_name', {
    header: 'Clean Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('clean_apt_name')}
      </p>
    ),
  }),
];

export default function Page() {
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
  const [districtOptions, setDistrictOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [mandalOptions, setMandalOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [villageOptions, setVillageOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [dmvData, setDmvData] = useState<
    | {
        district_id: number;
        district_name: string;
        mandals: {
          mandal_id: number;
          mandal_name: string;
          villages: { village_id: number; village_name: string }[];
        }[];
      }[]
    | null
  >(null);
  const [selectedRows, setSelectedRows] = useState<rawAptDataRow[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [cleanAptName, setCleanAptName] = useState<string | null>(null);
  const [cleanedRows, setCleanedRows] = useState<
    (rawAptDataRow & { clean_apt_name: string })[]
  >([]);
  const [selectedCleanedRows, setSelectedCleanedRows] = useState<
    (rawAptDataRow & { clean_apt_name: string })[]
  >([]);
  const [cleanRowSelection, setCleanRowSelection] = useState({});
  const [rawAptNames, setRawAptNames] = useState<rawAptDataRow[]>([]);
  const { isLoading } = useQuery({
    queryKey: ['village-project-cleaner'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          state_name: string;
          state_id: number;
          districts: {
            district_id: number;
            district_name: string;
            mandals: {
              mandal_id: number;
              mandal_name: string;
              villages: { village_id: number; village_name: string }[];
            }[];
          }[];
        }[];
      }>('/forms/getOnboardedSDMV');
      console.log(res.data.data);
      const telanganaData = res.data.data.find(
        (item) => item.state_id === 36
      )?.districts;
      if (!telanganaData) return null;
      setDmvData(telanganaData);
      const districtOpts = telanganaData.map((item) => ({
        label: `${item.district_id}:${item.district_name}`,
        value: item.district_id,
      }));
      setDistrictOptions(districtOpts);
      return res.data.data;
    },
    staleTime: Infinity,
  });
  const {
    data: rawAptDictData,
    isLoading: loadingRawAptDictData,
    refetch: refetchRawAptDictData,
  } = useQuery({
    queryKey: ['raw-apt-dict', selectedVillage],
    queryFn: async () => {
      if (!selectedVillage) return null;
      const res = await axiosClient.get<{
        data: {
          district_name: string;
          district_id: string;
          mandal_name: string;
          mandal_id: string;
          village_name: string;
          village_id: string;
          raw_apt_name: string;
          clean_survey: string;
          plot_count: string;
          occurrence_count: string;
        }[];
      }>('/forms/raw-apt-candidates?village_id=' + selectedVillage?.value);
      setRawAptNames(res.data.data);
      return res.data.data;
    },
  });
  const { data: cleanAptCandidates, isLoading: loadingCleanAptCandidates } =
    useQuery({
      queryKey: ['clean-apt-candidates', selectedVillage],
      queryFn: async () => {
        if (!selectedVillage) return null;
        const res = await axiosClient.get<{ data: string[] }>(
          '/forms/clean-project-name-candidates?village_id=' +
            selectedVillage?.value
        );
        return res.data.data.map((item) => ({
          label: item,
          value: item,
        }));
      },
    });
  //effects
  useEffect(() => {
    if (selectedDistrict) {
      const mandalOpts = dmvData
        ?.find((item) => item.district_id === selectedDistrict.value)
        ?.mandals.map((item) => ({
          label: `${item.mandal_id}:${item.mandal_name}`,
          value: item.mandal_id,
        }));
      setMandalOptions(mandalOpts || []);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict && selectedMandal) {
      const villageOpts = dmvData
        ?.find((item) => item.district_id === selectedDistrict.value)
        ?.mandals.find((item) => item.mandal_id === selectedMandal.value)
        ?.villages.map((item) => ({
          label: `${item.village_id}:${item.village_name}`,
          value: item.village_id,
        }));
      setVillageOptions(villageOpts || []);
    }
  }, [selectedMandal]);

  useEffect(() => {
    if (selectedDistrict && selectedMandal && selectedVillage) {
      console.log(selectedDistrict, selectedMandal, selectedVillage);
    }
  }, [selectedVillage]);
  const updateData = async (
    rows: (rawAptDataRow & { clean_apt_name: string })[]
  ) => {
    try {
      await axiosClient.post('/forms/update-rawapt-clean', rows);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const filteredRows = rawAptDictData?.filter((ele) => {
      return !cleanedRows.some(
        (item) =>
          item.raw_apt_name === ele.raw_apt_name &&
          item.clean_survey === ele.clean_survey &&
          item.plot_count === ele.plot_count &&
          item.occurrence_count === ele.occurrence_count
      );
    });
    if (filteredRows) {
      setRawAptNames(filteredRows);
    }
  }, [cleanedRows]);
  return (
    <>
      {isLoading ? (
        <div className='flex h-[50dvh] flex-col items-center justify-center'>
          <LuLoader size={40} className='animate-spin' />
          <div className='text-5xl font-bold'>Loading DMVs...</div>
        </div>
      ) : (
        <div className='mb-8 mt-10 flex flex-col justify-center'>
          <h1 className='mb-4 text-center text-3xl font-semibold underline'>
            Village Project Cleaner
          </h1>
          <div className='z-10 mt-5 flex w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
            <label className='flex items-center justify-between gap-5'>
              <span className='flex-[2] text-base md:text-xl'>District:</span>
              <Select
                className='w-full flex-[5]'
                key={'district'}
                options={districtOptions || []}
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
              />
            </label>
            <label className='flex items-center justify-between gap-5'>
              <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
              <Select
                className='w-full flex-[5]'
                key={'mandal'}
                options={mandalOptions || []}
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
            <label className='flex items-center justify-between gap-5'>
              <span className='flex-[2] text-base md:text-xl'>Village:</span>
              <Select
                className='w-full flex-[5]'
                key={'village'}
                options={villageOptions || []}
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
          </div>
          <div className='mt-10 flex flex-col'>
            {cleanAptName && (
              <h2
                id='heading-label'
                className='text-center text-2xl font-semibold'
              >
                Raw Apt Dict (Select Raw Apartment Name for &apos;
                {cleanAptName}&apos;)
              </h2>
            )}
            <div className='flex items-center gap-5 px-4'>
              {loadingRawAptDictData ? (
                <div className='flex h-[50dvh] flex-col items-center justify-center'>
                  <LuLoader size={40} className='animate-spin' />
                  <div className='text-5xl font-bold'>
                    Loading Raw Apt Dict...
                  </div>
                </div>
              ) : (
                rawAptDictData &&
                rawAptDictData?.length > 0 && (
                  <div className='w-[70%]'>
                    <TanstackReactTable
                      data={rawAptNames}
                      columns={rawAptSelectionColumns}
                      setSelectedRows={setSelectedRows}
                      rowSelection={rowSelection}
                      setRowSelection={setRowSelection}
                      isMultiSelection={true}
                    />
                  </div>
                )
              )}
              {selectedVillage?.value && (
                <div className='flex flex-col items-center'>
                  <div className='z-10 mt-5 flex w-full max-w-full flex-col items-center justify-center gap-3 self-center rounded p-0 align-middle shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                    <Select
                      key={'clean-apt'}
                      className='w-full max-w-[600px]'
                      options={cleanAptCandidates || []}
                      isLoading={loadingCleanAptCandidates}
                      onChange={(
                        e: SingleValue<{
                          label: string;
                          value: string;
                        }>
                      ) => {
                        setCleanAptName(e?.value.split(':')[1].trim() || null);
                        document
                          .getElementById('heading-label')
                          ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                      }}
                    />
                    <input
                      type='text'
                      className={inputBoxClass + ' !ml-0'}
                      placeholder='Enter Clean Apartment Name'
                      value={cleanAptName || ''}
                      onChange={(e) => setCleanAptName(e.target.value)}
                    />
                  </div>
                  <button
                    className='btn btn-neutral mx-auto my-5 w-40'
                    onClick={() => {
                      if (!cleanAptName) return;
                      setCleanedRows((prev) => {
                        return [
                          ...prev,
                          ...selectedRows.map((item) => ({
                            ...item,
                            clean_apt_name: cleanAptName,
                          })),
                        ];
                      });
                      setRowSelection({});
                      document
                        .getElementById('cleaned-apartment-data')
                        ?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                    }}
                  >
                    Attach
                  </button>
                </div>
              )}
            </div>
          </div>
          {selectedVillage?.value && (
            <div
              id='cleaned-apartment-data'
              className='mt-5 flex flex-col gap-5 px-4'
            >
              <h2 className='text-center text-2xl font-semibold'>
                Cleaned Apartment Data
              </h2>
              <div className=''>
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
                    if (await updateData(cleanedRows)) {
                      setCleanedRows([]);
                      await refetchRawAptDictData();
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
        </div>
      )}
    </>
  );
}

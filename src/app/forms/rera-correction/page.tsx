'use client';

import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import toast, { Toaster } from 'react-hot-toast';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { isEqual, uniqWith } from 'lodash';

type tableData = {
  id: string;
  project_name: string;
  district: string;
  district_id: number;
  mandal: string;
  mandal_id: number;
  locality: string;
  village: string;
  village_id: number;
};

type SroResponse = {
  district_id: number;
  district_name: string;
  mandal_id: number;
  mandal_name: string;
  village_id: number;
  village_name: string;
};

export default function page() {
  const inputBoxClass =
    'w-full rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';
  const sroTableColumns = [
    {
      header: 'District ID',
      accessorKey: 'district_id',
    },
    {
      header: 'District Name',
      accessorKey: 'district_name',
    },
    {
      header: 'Mandal ID',
      accessorKey: 'mandal_id',
    },
    {
      header: 'Mandal Name',
      accessorKey: 'mandal_name',
    },
    {
      header: 'Village ID',
      accessorKey: 'village_id',
    },
    {
      header: 'Village Name',
      accessorKey: 'village_name',
    },
  ];

  const reraTableColumns = [
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
      header: 'District Name',
      accessorKey: 'district',
    },
    {
      header: 'Mandal ID',
      accessorKey: 'mandal_id',
    },
    {
      header: 'Mandal Name',
      accessorKey: 'mandal',
    },
    {
      header: 'Locality',
      accessorKey: 'locality',
    },
    {
      header: 'Village ID',
      accessorKey: 'village_id',
    },
    {
      header: 'Village Name',
      accessorKey: 'village',
    },
  ];
  const [selectedSroDistrict, setSelectedSroDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedSroMandal, setSelectedSroMandal] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedReraMandal, setSelectedReraMandal] = useState<{
    label: string;
    value: string;
  } | null>();
  const [selectedReraVillage, setSelectedReraVillage] = useState<{
    label: string;
    value: string;
  } | null>();
  const [selectedReraLocality, setSelectedReraLocality] = useState<{
    label: string;
    value: string;
  } | null>();
  const [reraTableData, setReraTableData] = useState<tableData[] | null>();
  const [sroTableData, setSroTableData] = useState<SroResponse[] | null>();

  // populate sro and rera district dropdown
  const { isPending: loadingDistricts, data: districtOptions } = useQuery({
    queryKey: ['sro-districts', selectedSroMandal],
    queryFn: async () => {
      const options = await fetchDropdownOption('districts', 'state', 36);
      return options.map((item) => ({
        label: `${item.value}:${item.label}`,
        value: item.value,
      }));
    },
  });

  // populate sro mandal dropdown on sro district selection
  const {
    isPending: loadingSroMandals,
    data: sroMandalOptions,
    refetch: refetchSroMandalOption,
  } = useQuery({
    queryKey: ['sro-mandals', selectedSroDistrict],
    queryFn: async () => {
      if (selectedSroDistrict !== undefined && selectedSroDistrict !== null) {
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: { district_id: selectedSroDistrict.value },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: -1 }];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.mandal_name}`,
            value: item.mandal_id,
          });
        });
        console.log({ mandals: uniqWith(options, isEqual) });
        setSroTableData(data);
        return uniqWith(options, isEqual);
      }
    },
  });

  // populated sro village dropdown on sro mandal selection
  useQuery({
    queryKey: ['sro-villages', selectedSroMandal?.value],
    queryFn: async () => {
      if (selectedSroMandal !== undefined && selectedSroMandal !== null) {
        if (selectedSroMandal.value === -1) {
          refetchSroMandalOption();
          return true;
        }
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: {
              district_id: selectedSroDistrict?.value,
              mandal_id: selectedSroMandal.value,
            },
          }
        );
        const data = response.data?.data;
        const options = data.map((item) => ({
          label: `${item.mandal_id}:${item.mandal_name}`,
          value: item.mandal_id,
        }));
        console.log({ mandals: uniqWith(options, isEqual) });
        setSroTableData(data);
        return uniqWith(options, isEqual);
      }
    },
  });

  // populate rera mandal dropdown on rera district selection
  const {
    isPending: loadingReraMandals,
    data: reraMandalOptions,
    refetch: refetchReraMandalOptions,
  } = useQuery({
    queryKey: ['rera-mandals', selectedSroDistrict],
    queryFn: async () => {
      if (selectedSroDistrict !== undefined && selectedSroDistrict !== null) {
        const response = await axiosClient.get<{ data: tableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: { district_id: selectedSroDistrict.value },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.mandal}`,
            value: item.mandal,
          });
        });
        console.log({ mandals: uniqWith(options, isEqual) });
        setReraTableData(data);
        return uniqWith(options, isEqual);
      }
    },
  });

  //  populate rera locality dropdown on rera mandal selection
  const {
    isPending: loadingReraLocality,
    data: reraLocalityOptions,
    refetch: refetchReraLocalityOptions,
  } = useQuery({
    queryKey: ['rera-locality', selectedReraMandal],
    queryFn: async () => {
      if (selectedReraMandal !== undefined && selectedReraMandal !== null) {
        if (selectedReraMandal?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        const response = await axiosClient.get<{ data: tableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedSroDistrict?.value,
              mandal: selectedReraMandal.value,
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        data.map((item) => {
          options.push({
            label: item.locality,
            value: item.locality,
          });
        });
        setReraTableData(data);
        return uniqWith(options, isEqual);
      }
    },
  });

  //  populate rera village dropdown on rera locality selection
  const {
    isPending: loadingReraVillages,
    data: reraVillageOptions,
    refetch: refetchReraVillageOptions,
  } = useQuery({
    queryKey: ['rera-villages', selectedReraLocality],
    queryFn: async () => {
      if (selectedReraMandal !== undefined && selectedReraMandal !== null) {
        if (selectedReraLocality?.value === '-1') {
          refetchReraLocalityOptions();
          return null;
        }
        const response = await axiosClient.get<{ data: tableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedSroDistrict?.value,
              mandal: selectedReraMandal?.value,
              locality: selectedReraLocality?.value,
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        data.map((item) => {
          options.push({
            label: `${item.village_id}:${item.village}`,
            value: item.village,
          });
        });
        console.log({ mandals: uniqWith(options, isEqual) });
        setReraTableData(data);
        return uniqWith(options, isEqual);
      }
    },
  });
  useEffect(() => {
    setSelectedReraLocality(null);
  }, [selectedReraMandal?.value]);

  useEffect(() => {
    setSelectedReraVillage(null);
  }, [selectedReraLocality?.value]);
  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: RERA Correction</h1>
      <Toaster />
      <div className='flex justify-start gap-5'>
        <form className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>SRO DMVs</h3>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={districtOptions || undefined}
              isLoading={loadingDistricts}
              value={selectedSroDistrict}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedSroDistrict(e);
                setSelectedReraMandal(null);
                setSelectedSroMandal(null);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={sroMandalOptions || undefined}
              isLoading={loadingSroMandals}
              value={selectedSroMandal}
              onChange={(e) => {
                setSelectedSroMandal(e);
                // setSelectedSroVillage(null);
              }}
              isDisabled={Boolean(!selectedSroDistrict)}
            />
          </label>
        </form>
        <form className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>RERA DMLVs</h3>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={districtOptions || undefined}
              isLoading={loadingDistricts}
              value={selectedSroDistrict}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedSroDistrict(e);
                setSelectedReraMandal(null);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={reraMandalOptions || undefined}
              isLoading={loadingReraMandals}
              value={selectedReraMandal}
              onChange={(e) => {
                setSelectedReraMandal(e);
                setSelectedReraVillage(null);
              }}
              isDisabled={Boolean(!selectedSroDistrict)}
            />
          </label>
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Assign Mandal ID:</span>
            <div className='flex flex-[5] gap-4'>
              <span className={inputBoxClass}>
                {selectedReraMandal?.value ? selectedReraMandal?.value : '🚫'}
              </span>
              <input
                className={inputBoxClass}
                name='mandal_id'
                placeholder='Enter ID here'
              />
              <button
                className='btn-rezy max-h-10'
                disabled={
                  !selectedReraMandal?.value ||
                  selectedReraMandal?.value === '-1'
                }
              >
                Save
              </button>
            </div>
          </div>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Locality:</span>
            <Select
              className='w-full flex-[5]'
              key={'locality'}
              options={reraLocalityOptions || undefined}
              isLoading={loadingReraLocality}
              value={selectedReraMandal ? selectedReraLocality : null}
              onChange={(e) => setSelectedReraLocality(e)}
              isDisabled={Boolean(!selectedReraMandal)}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Village:</span>
            <Select
              className='w-full flex-[5]'
              key={'village'}
              options={reraVillageOptions || undefined}
              isLoading={loadingReraVillages}
              value={selectedReraLocality ? selectedReraVillage : null}
              onChange={(e) => setSelectedReraVillage(e)}
              isDisabled={Boolean(!selectedReraLocality)}
            />
          </label>
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Assign Village ID:</span>
            <div className='flex flex-[5] gap-4'>
              <span className={inputBoxClass}>
                {selectedReraVillage?.value ? selectedReraVillage?.value : '🚫'}
              </span>
              <input
                className={inputBoxClass}
                name='village_id'
                placeholder='Enter ID here'
              />
              <button
                className='btn-rezy max-h-10'
                disabled={
                  !selectedReraVillage?.value ||
                  selectedReraVillage?.value === '-1'
                }
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className='flex w-full'>
        <div className='w-1/2 flex-1'>
          {sroTableData && sroTableData?.length > 0 && (
            <>
              <h3 className='pt-8 text-center text-2xl font-semibold underline'>
                SRO Data
              </h3>
              <div className='overflow-x-auto pb-20'>
                <TanstackReactTable
                  columns={sroTableColumns}
                  data={sroTableData}
                />
              </div>
            </>
          )}
        </div>
        <div className='w-1/2 flex-1'>
          {reraTableData && reraTableData?.length > 0 && (
            <>
              <h3 className='pt-8 text-center text-2xl font-semibold underline'>
                RERA Data
              </h3>
              <div className='overflow-x-auto pb-20'>
                <TanstackReactTable
                  columns={reraTableColumns}
                  data={reraTableData}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

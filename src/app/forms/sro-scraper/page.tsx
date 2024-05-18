'use client';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import type { ColumnDef } from '@tanstack/react-table';
import toast, { Toaster } from 'react-hot-toast';
type SRO = {
  sro_id: number;
  crawler_last_post_date: Date | null;
  scrape_enabled: boolean;
}[];

export default function SroScraperPage() {
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [selectedSro, setSelectedSro] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedSroTableData, setSelectedSroTableData] = useState<{
    data: object[];
    cols: ColumnDef<object, any>[];
  } | null>(null);

  let ToastId: string | undefined;

  //   populated dropdown
  const {
    isPending: loadingSros,
    error: SrosError,
    status: SrosStatus,
    data: sroOptions,
  } = useQuery({
    queryKey: ['sroList'],
    queryFn: async (): Promise<{ label: string; value: number }[]> => {
      let sros;
      const res = await axiosClient.get('/forms/sros');
      if (res.status === 200) {
        sros = res.data.data.map(
          (item: { id: number; name: string; code: number }) => ({
            label: item.name + ': ' + item.code,
            value: item.id,
          })
        );
      }
      return sros;
    },
    staleTime: Infinity,
  });

  async function checkSroStatus(sro_id: number) {
    toast.loading(`Checking SRO detail...`, {
      id: ToastId,
    });
    setSelectedSroTableData(null);
    const res = await axiosClient.get('/forms/sro', {
      params: { sro_id: sro_id },
    });
    if (res.status == 200) {
      toast.dismiss(ToastId);
      toast.success(`SRO detail fetched.`, {
        id: ToastId,
        duration: 5000,
      });
      const details: SRO = res?.data?.data;
      const cols = Object.keys(details[0]).map((item) => ({
        header: item.toUpperCase(),
        accessorKey: item,
      }));
      setSelectedSroTableData({ data: details, cols: cols });
      setSwitchValue(details[0].scrape_enabled);
    } else if (res.status == 204) {
      toast.dismiss(ToastId);
      toast.error(`Selected SRO is not available in database.`, {
        id: ToastId,
        duration: 5000,
      });
    }
  }

  useEffect(() => {
    if (selectedSro?.value) {
      checkSroStatus(selectedSro?.value);
    }
  }, [selectedSro]);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    toast.dismiss(ToastId);
    e.preventDefault();
    const data = {
      sro_id: selectedSro?.value,
      enabled: switchValue,
    };
    const res = await axiosClient.post('/forms/sro', data);
    if (res.status === 201) {
      toast.success('Inserted to database.', {
        id: ToastId,
        duration: 3000,
      });
      checkSroStatus(selectedSro?.value!);
    } else if (res.status === 202) {
      toast.success('Update saved to database.', {
        id: ToastId,
        duration: 3000,
      });
      checkSroStatus(selectedSro?.value!);
    }
  };

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: SRO Scraper</h1>
      <Toaster />
      <form
        className='mt-5 flex w-full max-w-[70%] flex-col gap-4 self-center rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        onSubmit={submitForm}
      >
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>SRO Name & Code :</span>
          <Select
            className='w-full flex-[5]'
            key={'sros'}
            options={sroOptions}
            isLoading={loadingSros}
            controlShouldRenderValue
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedSro(e);
              //   checkSroStatus(selectedSro?.value!);
            }}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Enabled:</span>
          <span className='flex flex-[5] items-center justify-between gap-5'>
            <span
              className={`badge badge-lg font-bold text-white ${
                switchValue ? 'badge-success' : 'badge-error'
              }`}
            >
              Switch is {switchValue ? 'ON' : 'OFF'}
            </span>
            <input
              type='checkbox'
              className='toggle toggle-success'
              checked={switchValue}
              onChange={() => setSwitchValue(!switchValue)}
            />
          </span>
        </label>
        <button className='btn btn-info w-full self-center text-white'>
          Update
        </button>
      </form>
      {selectedSroTableData && (
        <TanstackReactTable
          data={selectedSroTableData?.data}
          columns={selectedSroTableData?.cols}
          showPagination={false}
          enableSearch={false}
        />
      )}
    </div>
  );
}

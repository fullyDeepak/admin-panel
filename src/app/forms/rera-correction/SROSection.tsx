'use client';
import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import {
  SroResponse,
  useCorrectionStore,
  useCorrectionStoreState,
} from './useCorrectionStore';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import { useId } from 'react';
import axiosClient from '@/utils/AxiosClient';
import { isEqual, uniqWith } from 'lodash';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { sroTableColumns } from './utils';

export default function SROSection() {
  const { selectedSroDistrict, selectedSroMandal, sroTableData } =
    useCorrectionStoreState();
  const { setFormData } = useCorrectionStore();
  const { isPending: loadingSroDistricts, data: sroDistrictOptions } = useQuery(
    {
      queryKey: ['sro-districts', selectedSroMandal],
      queryFn: async () => {
        const options = await fetchDropdownOption('districts', 'state', 36);
        return options.map((item) => ({
          label: `${item.value}:${item.label}`,
          value: item.value,
        }));
      },
      // staleTime: Infinity,
    }
  );
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
        // setSroTableData(data);
        setFormData('sroTableData', data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
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
        // setSroTableData(data);
        setFormData('sroTableData', data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });
  return (
    <div className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <h3 className='text-center text-2xl font-semibold'>SRO DMVs</h3>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={sroDistrictOptions || undefined}
          isLoading={loadingSroDistricts}
          value={selectedSroDistrict}
          instanceId={useId()}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setFormData('selectedSroDistrict', e);
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={sroMandalOptions || undefined}
          isLoading={loadingSroMandals}
          value={selectedSroMandal}
          instanceId={useId()}
          onChange={(e) => {
            setFormData('selectedSroMandal', e);
          }}
          isDisabled={Boolean(!selectedSroDistrict)}
        />
      </label>
      <div className='max-w-[40vw] rounded-lg border-2 p-2'>
        <h3 className='mt-5 text-center text-2xl font-semibold underline'>
          SRO Data
        </h3>
        {sroTableData && sroTableData?.length > 0 && (
          <div className='overflow-x-auto'>
            <TanstackReactTable columns={sroTableColumns} data={sroTableData} />
          </div>
        )}
      </div>
    </div>
  );
}

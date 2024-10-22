'use client';
import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import { SroResponse, useCorrectionStore } from './useCorrectionStore';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import { useId } from 'react';
import axiosClient from '@/utils/AxiosClient';
import { isEqual, uniqWith } from 'lodash';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { sroTableColumns } from './utils';

export default function SROSection() {
  const { updateCorrectionFormData, correctionData } = useCorrectionStore();
  const { isPending: loadingSroDistricts, data: sroDistrictOptions } = useQuery(
    {
      queryKey: ['sro-districts', correctionData.selectedSroMandal],
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
    queryKey: ['sro-mandals', correctionData.selectedSroDistrict],
    queryFn: async () => {
      if (
        correctionData.selectedSroDistrict !== undefined &&
        correctionData.selectedSroDistrict !== null
      ) {
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: { district_id: correctionData.selectedSroDistrict.value },
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
        updateCorrectionFormData('sroTableData', data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  // populated sro village dropdown on sro mandal selection
  useQuery({
    queryKey: ['sro-villages', correctionData.selectedSroMandal?.value],
    queryFn: async () => {
      if (
        correctionData.selectedSroMandal !== undefined &&
        correctionData.selectedSroMandal !== null
      ) {
        if (correctionData.selectedSroMandal.value === -1) {
          refetchSroMandalOption();
          return true;
        }
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: {
              district_id: correctionData.selectedSroDistrict?.value,
              mandal_id: correctionData.selectedSroMandal.value,
            },
          }
        );
        const data = response.data?.data;
        const options = data.map((item) => ({
          label: `${item.mandal_id}:${item.mandal_name}`,
          value: item.mandal_id,
        }));
        // setSroTableData(data);
        updateCorrectionFormData('sroTableData', data);
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
          value={correctionData.selectedSroDistrict}
          instanceId={useId()}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateCorrectionFormData('selectedSroDistrict', e);
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
          value={correctionData.selectedSroMandal}
          instanceId={useId()}
          onChange={(e) => {
            updateCorrectionFormData('selectedSroMandal', e);
          }}
          isDisabled={Boolean(!correctionData.selectedSroDistrict)}
        />
      </label>
      <div className='max-w-[40vw] rounded-lg border-2 p-2'>
        <h3 className='mt-5 text-center text-2xl font-semibold underline'>
          SRO Data
        </h3>
        {correctionData.sroTableData &&
          correctionData.sroTableData?.length > 0 && (
            <div className='overflow-x-auto'>
              <TanstackReactTable
                columns={sroTableColumns}
                data={correctionData.sroTableData}
              />
            </div>
          )}
      </div>
    </div>
  );
}

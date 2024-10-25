import React, { useId, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import { MultiSelect } from 'react-multi-select-component';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import { ReraDMLVTableData } from '@/types/types';
import { useCorrectionStore } from './useCorrectionStore';
import { generateOptions } from './utils';

export default function ReraDropdown() {
  const {
    setProjectOptions,
    setSelectedProjects,
    reraTableDataStore,
    setRERATableDataStore,
  } = useReraCorrectionStore();
  const { correctionData, updateCorrectionFormData, setTableRowSelection } =
    useCorrectionStore();

  const [reraRawMandalOption, setRawMandalOption] = useState<
    | {
        label: string;
        value: string;
      }[]
    | null
  >();
  const [reraRawVillageOption, setRawVillageOption] = useState<
    | {
        label: string;
        value: string;
      }[]
    | null
  >();
  const [developerOption, setDeveloperOption] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  // populate rera district dropdown
  const { isPending: loadingReraDistricts, data: reraDistrictOptions } =
    useQuery({
      queryKey: ['rera-districts', correctionData.selectedReraMandal],
      queryFn: async () => {
        const options = await fetchDropdownOption('districts', 'state', 36);
        return options.map((item) => ({
          label: `${item.value}:${item.label}`,
          value: item.value,
        }));
      },
    });

  // populate rera mandal dropdown on rera district selection
  const {
    isPending: loadingReraMandals,
    data: reraMandalOptions,
    refetch: refetchReraMandalOptions,
  } = useQuery({
    queryKey: ['rera-district', correctionData.selectedReraDistrict],
    queryFn: async () => {
      if (
        correctionData.selectedReraDistrict !== undefined &&
        correctionData.selectedReraDistrict !== null
      ) {
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: { district_id: correctionData.selectedReraDistrict.value },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const {
          cleanMandalOptions,
          rawMandalOptions,
          rawVillageOptions,
          optionsForProjects,
          developerOption,
        } = generateOptions(data);
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setTableRowSelection({});
        setRawVillageOption(rawVillageOptions);
        setRawMandalOption(rawMandalOptions);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return [{ label: 'ALL', value: '-1' }, ...cleanMandalOptions];
      }
    },
    refetchOnWindowFocus: false,
  });

  // populate rera table data on rera raw mandal selection
  useQuery({
    queryKey: ['rera-raw-mandal', correctionData.selectedReraRawMandal],
    queryFn: async () => {
      if (
        correctionData.selectedReraDistrict &&
        correctionData.selectedReraRawMandal != null &&
        correctionData.selectedReraMandal
      ) {
        console.log('Calling BB');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: correctionData.selectedReraDistrict.value,
              mandal: correctionData.selectedReraMandal?.label.split(':')[1],
              mandal_raw: correctionData.selectedReraRawMandal.value,
            },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const {
          cleanMandalOptions,
          rawMandalOptions,
          rawVillageOptions,
          optionsForProjects,
        } = generateOptions(data);
        setTableRowSelection({});
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setRawVillageOption(rawVillageOptions);
        setRawMandalOption(rawMandalOptions);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return [{ label: 'ALL', value: '-1' }, ...cleanMandalOptions];
      }
    },
    refetchOnWindowFocus: false,
  });

  // populate rera table data on rera raw village selection
  useQuery({
    queryKey: ['rera-raw-village', correctionData.selectedReraRawVillage],
    queryFn: async () => {
      if (
        correctionData.selectedReraDistrict &&
        correctionData.selectedReraMandal &&
        correctionData.selectedReraRawVillage
      ) {
        console.log('Calling BBVILL');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: correctionData.selectedReraDistrict.value,
              mandal: correctionData.selectedReraMandal?.label.split(':')[1],
              village: correctionData.selectedReraVillage?.label.split(':')[1],
              village_raw: correctionData.selectedReraRawVillage.value,
            },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const { rawMandalOptions, rawVillageOptions, optionsForProjects } =
          generateOptions(data);
        setTableRowSelection({});
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setRawVillageOption(rawVillageOptions);
        setRawMandalOption(rawMandalOptions);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  //  populate rera village dropdown on rera mandal selection
  const {
    isPending: loadingReraVillages,
    data: reraVillageOptions,
    refetch: _refetchReraVillageOptions,
  } = useQuery({
    queryKey: ['rera-mandal', correctionData.selectedReraMandal],
    queryFn: async () => {
      if (correctionData.selectedReraMandal != undefined) {
        if (correctionData.selectedReraMandal?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        console.log('Calling CC');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: correctionData.selectedReraDistrict?.value,
              mandalId: correctionData.selectedReraMandal?.value.split(':')[0],
              mandal: correctionData.selectedReraMandal?.value.split(':')[1],
              village: correctionData.selectedReraVillage?.value.split(':')[1],
            },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const {
          cleanVillageOptions,
          rawMandalOptions,
          rawVillageOptions,
          optionsForProjects,
        } = generateOptions(data);
        setTableRowSelection({});
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setRawMandalOption(rawMandalOptions);
        setRawVillageOption(rawVillageOptions);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return [{ label: 'ALL', value: '-1' }, ...cleanVillageOptions];
      }
    },
    refetchOnWindowFocus: false,
  });

  //  populate rera locality dropdown on rera village selection
  const {
    isPending: loadingReraLocality,
    data: reraLocalityOptions,
    refetch: refetchReraLocalityOptions,
  } = useQuery({
    queryKey: ['rera-village', correctionData.selectedReraVillage],
    queryFn: async () => {
      if (correctionData.selectedReraVillage != undefined) {
        if (correctionData.selectedReraVillage?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        console.log('Calling DD');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: correctionData.selectedReraDistrict?.value,
              mandalId: correctionData.selectedReraMandal?.value.split(':')[0],
              mandal: correctionData.selectedReraMandal?.value.split(':')[1],
              village: correctionData.selectedReraVillage?.value.split(':')[1],
              mandal_raw: correctionData.selectedReraRawMandal?.value,
            },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const { localityOption, rawVillageOptions, optionsForProjects } =
          generateOptions(data);
        setTableRowSelection({});
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setRawVillageOption(rawVillageOptions);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return [{ label: 'ALL', value: '-1' }, ...localityOption];
      }
    },
    refetchOnWindowFocus: false,
  });

  //  filter rera table data on rera locality selection
  useQuery({
    queryKey: ['rera-mandal', correctionData.selectedReraLocality],
    queryFn: async () => {
      if (correctionData.selectedReraMandal != undefined) {
        if (correctionData.selectedReraLocality?.value === '-1') {
          refetchReraLocalityOptions();
          return null;
        }
        console.log('Calling EE');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: correctionData.selectedReraDistrict?.value,
              mandalId: correctionData.selectedReraMandal?.value.split(':')[0],
              mandal: correctionData.selectedReraMandal?.value.split(':')[1],
              villageId:
                correctionData.selectedReraVillage?.value.split(':')[0],
              village: correctionData.selectedReraVillage?.value.split(':')[1],
              locality: correctionData.selectedReraLocality?.value,
            },
          }
        );
        const data = response.data?.data;
        updateCorrectionFormData('reraTableData', data);
        const optionsForProjects: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setTableRowSelection({});
        setDeveloperOption(developerOption);
        setSelectedDeveloper(developerOption);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={reraDistrictOptions || undefined}
          isLoading={loadingReraDistricts}
          value={correctionData.selectedReraDistrict}
          instanceId={useId()}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateCorrectionFormData('selectedReraDistrict', e);
            updateCorrectionFormData('selectedReraMandal', null);
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={reraMandalOptions || undefined}
          isLoading={loadingReraMandals}
          value={correctionData.selectedReraMandal}
          instanceId={useId()}
          onChange={(e) => {
            updateCorrectionFormData('selectedReraMandal', e);
            updateCorrectionFormData('selectedReraVillage', null);
            updateCorrectionFormData('selectedReraRawMandal', null);
            updateCorrectionFormData('selectedReraRawVillage', null);
          }}
          isDisabled={Boolean(!correctionData.selectedReraDistrict)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Raw Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={reraRawMandalOption || undefined}
          value={correctionData.selectedReraRawMandal}
          instanceId={useId()}
          onChange={(e) => {
            updateCorrectionFormData('selectedReraRawMandal', e);
            updateCorrectionFormData('selectedReraRawVillage', null);
            updateCorrectionFormData('selectedReraVillage', null);
          }}
          isDisabled={
            correctionData.selectedReraMandal?.label.split(':')[0] === 'NULL'
              ? false
              : true
          }
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          instanceId={useId()}
          options={reraVillageOptions || undefined}
          isLoading={loadingReraVillages}
          value={
            correctionData.selectedReraMandal
              ? correctionData.selectedReraVillage
              : null
          }
          onChange={(e) => updateCorrectionFormData('selectedReraVillage', e)}
          isDisabled={Boolean(!correctionData.selectedReraMandal)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Raw Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          instanceId={useId()}
          options={reraRawVillageOption || undefined}
          value={
            correctionData.selectedReraMandal
              ? correctionData.selectedReraRawVillage
              : null
          }
          onChange={(e) =>
            updateCorrectionFormData('selectedReraRawVillage', e)
          }
          isDisabled={
            correctionData.selectedReraVillage?.label.split(':')[0] === 'NULL'
              ? false
              : true
          }
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Locality:</span>
        <Select
          className='w-full flex-[5]'
          instanceId={useId()}
          key={'locality'}
          options={reraLocalityOptions || undefined}
          isLoading={loadingReraLocality}
          value={
            correctionData.selectedReraVillage
              ? correctionData.selectedReraLocality
              : null
          }
          onChange={(e) => updateCorrectionFormData('selectedReraLocality', e)}
          isDisabled={Boolean(!correctionData.selectedReraVillage)}
        />
      </label>
      <div className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Developers:</span>
        <div className='flex flex-[5] items-center gap-3'>
          <MultiSelect
            options={developerOption}
            value={selectedDeveloper}
            className='w-full'
            labelledBy=''
            onChange={(
              e: {
                label: string;
                value: string;
              }[]
            ) => {
              setSelectedDeveloper(e);
              setTableRowSelection({});
              const selectedDevId = e.map((item) => item.value);
              const filteredTableData = reraTableDataStore?.filter((item) =>
                selectedDevId.includes(item.dev_name)
              );
              filteredTableData &&
                updateCorrectionFormData('reraTableData', filteredTableData);
            }}
          />
        </div>
      </div>
    </>
  );
}

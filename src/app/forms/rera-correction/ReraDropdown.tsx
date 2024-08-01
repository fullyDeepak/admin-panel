import React, { useId, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import { isEqual, uniqWith } from 'lodash';
import { MultiSelect } from 'react-multi-select-component';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import { ReraDMLVTableData } from '@/types/types';
import {
  useCorrectionStore,
  useCorrectionStoreState,
} from './useCorrectionStore';

export default function ReraDropdown() {
  const {
    projectOption,
    selectedProjects,
    setProjectOptions,
    setSelectedProjects,
    reraTableDataStore,
    setRERATableDataStore,
  } = useReraCorrectionStore();
  const {
    selectedReraDistrict,
    selectedReraMandal,
    selectedReraRawMandal,
    selectedReraRawVillage,
    selectedReraVillage,
    selectedReraLocality,
  } = useCorrectionStoreState();

  const { setFormData } = useCorrectionStore();
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

  // populate rera district dropdown
  const { isPending: loadingReraDistricts, data: reraDistrictOptions } =
    useQuery({
      queryKey: ['rera-districts', selectedReraMandal],
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
    queryKey: ['rera-district', selectedReraDistrict],
    queryFn: async () => {
      if (selectedReraDistrict !== undefined && selectedReraDistrict !== null) {
        console.log('Calling AA');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: { district_id: selectedReraDistrict.value },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        const rawOptions: {
          label: string;
          value: string;
        }[] = [];
        const rawVillageOptions: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.clean_mandal_name}`,
            value: `${item.mandal_id}:${item.clean_mandal_name}`,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
          rawOptions.push({
            label: item.mandal === '' ? 'BLANK' : item.mandal,
            value: item.mandal === '' ? 'BLANK' : item.mandal,
          });
          rawVillageOptions.push({
            label: item.village === '' ? 'BLANK' : item.village,
            value: item.village === '' ? 'BLANK' : item.village,
          });
        });
        setFormData('reraTableData', data);
        setRawVillageOption(uniqWith(rawVillageOptions, isEqual));
        setRawMandalOption(uniqWith(rawOptions, isEqual));
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
  });

  // populate rera table data on rera raw mandal selection
  useQuery({
    queryKey: ['rera-raw-mandal', selectedReraRawMandal],
    queryFn: async () => {
      if (
        selectedReraDistrict &&
        selectedReraRawMandal != null &&
        selectedReraMandal
      ) {
        console.log('Calling BB');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict.value,
              mandal: selectedReraMandal?.label.split(':')[1],
              mandal_raw: selectedReraRawMandal.value,
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        const rawOptions: {
          label: string;
          value: string;
        }[] = [];
        const rawVillageOptions: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.clean_mandal_name}`,
            value: `${item.mandal_id}:${item.clean_mandal_name}`,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
          rawOptions.push({
            label: item.mandal === '' ? 'BLANK' : item.mandal,
            value: item.mandal === '' ? 'BLANK' : item.mandal,
          });
          rawVillageOptions.push({
            label: item.village === '' ? 'BLANK' : item.village,
            value: item.village === '' ? 'BLANK' : item.village,
          });
        });
        setFormData('reraTableData', data);
        setRawVillageOption(uniqWith(rawVillageOptions, isEqual));
        setRawMandalOption(uniqWith(rawOptions, isEqual));
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
  });

  // populate rera table data on rera raw village selection
  useQuery({
    queryKey: ['rera-raw-village', selectedReraRawVillage],
    queryFn: async () => {
      if (
        selectedReraDistrict &&
        selectedReraMandal &&
        selectedReraRawVillage
      ) {
        console.log('Calling BBVILL');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict.value,
              mandal: selectedReraMandal?.label.split(':')[1],
              village: selectedReraVillage?.label.split(':')[1],
              village_raw: selectedReraRawVillage.value,
            },
          }
        );
        const data = response.data?.data;
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        const rawOptions: {
          label: string;
          value: string;
        }[] = [];
        const rawVillageOptions: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
          rawOptions.push({
            label: item.mandal === '' ? 'BLANK' : item.mandal,
            value: item.mandal === '' ? 'BLANK' : item.mandal,
          });
          rawVillageOptions.push({
            label: item.village === '' ? 'BLANK' : item.village,
            value: item.village === '' ? 'BLANK' : item.village,
          });
        });
        setFormData('reraTableData', data);
        setRawVillageOption(uniqWith(rawVillageOptions, isEqual));
        setRawMandalOption(uniqWith(rawOptions, isEqual));
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
    queryKey: ['rera-mandal', selectedReraMandal],
    queryFn: async () => {
      if (selectedReraMandal != undefined) {
        if (selectedReraMandal?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        console.log('Calling CC');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              village: selectedReraVillage?.value.split(':')[1],
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const rawMandalOptions: {
          label: string;
          value: string;
        }[] = [];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        const rawVillageOptions: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          options.push({
            label: `${item.village_id}:${item.clean_village_name}`,
            value: `${item.village_id}:${item.clean_village_name}`,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
          rawMandalOptions.push({
            label: item.mandal === '' ? 'BLANK' : item.mandal,
            value: item.mandal === '' ? 'BLANK' : item.mandal,
          });
          rawVillageOptions.push({
            label: item.village === '' ? 'BLANK' : item.village,
            value: item.village === '' ? 'BLANK' : item.village,
          });
        });
        setFormData('reraTableData', data);
        setRawMandalOption(uniqWith(rawMandalOptions, isEqual));
        setRawVillageOption(uniqWith(rawVillageOptions, isEqual));
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
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
    queryKey: ['rera-village', selectedReraVillage],
    queryFn: async () => {
      if (selectedReraVillage != undefined) {
        if (selectedReraVillage?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        console.log('Calling DD');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              village: selectedReraVillage?.value.split(':')[1],
              mandal_raw: selectedReraRawMandal?.value,
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        const rawOptions: {
          label: string;
          value: string;
        }[] = [];
        const rawVillageOptions: {
          label: string;
          value: string;
        }[] = [];
        data.map((item) => {
          options.push({
            label: item.locality,
            value: item.locality,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
          rawOptions.push({
            label: item.mandal === '' ? 'BLANK' : item.mandal,
            value: item.mandal === '' ? 'BLANK' : item.mandal,
          });
          rawVillageOptions.push({
            label: item.village === '' ? 'BLANK' : item.village,
            value: item.village === '' ? 'BLANK' : item.village,
          });
        });
        setFormData('reraTableData', data);
        // setRawMandalOption(uniqWith(rawOptions, isEqual));
        setRawVillageOption(uniqWith(rawVillageOptions, isEqual));
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
  });

  //  filter rera table data on rera locality selection
  useQuery({
    queryKey: ['rera-mandal', selectedReraLocality],
    queryFn: async () => {
      if (selectedReraMandal != undefined) {
        if (selectedReraLocality?.value === '-1') {
          refetchReraLocalityOptions();
          return null;
        }
        console.log('Calling EE');
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              villageId: selectedReraVillage?.value.split(':')[0],
              village: selectedReraVillage?.value.split(':')[1],
              locality: selectedReraLocality?.value,
            },
          }
        );
        const data = response.data?.data;
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        data.map((item) => {
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setFormData('reraTableData', data);
        setFormData('reraTableData', data);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Projects:</span>
        <div className='flex flex-[5] items-center gap-3'>
          <MultiSelect
            options={projectOption}
            value={selectedProjects}
            className='w-full'
            labelledBy=''
            onChange={(
              e: {
                label: string;
                value: number;
              }[]
            ) => {
              setSelectedProjects(e);
              const selectedProjectId = e.map((item) => item.value);
              const filteredTableData = reraTableDataStore?.filter((item) =>
                selectedProjectId.includes(item.id)
              );
              filteredTableData &&
                setFormData('reraTableData', filteredTableData);
            }}
          />
          <span
            className={`badge aspect-square h-10 rounded-full bg-violet-200 ${selectedProjects.length > 100 ? 'text-base' : 'text-lg'} `}
          >
            {selectedProjects.length}
          </span>
        </div>
      </div>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={reraDistrictOptions || undefined}
          isLoading={loadingReraDistricts}
          value={selectedReraDistrict}
          instanceId={useId()}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setFormData('selectedReraDistrict', e);
            setFormData('selectedReraMandal', null);
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
          value={selectedReraMandal}
          instanceId={useId()}
          onChange={(e) => {
            setFormData('selectedReraMandal', e);
            setFormData('selectedReraVillage', null);
            setFormData('selectedReraRawMandal', null);
            setFormData('selectedReraRawVillage', null);
          }}
          isDisabled={Boolean(!selectedReraDistrict)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Raw Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={reraRawMandalOption || undefined}
          value={selectedReraRawMandal}
          instanceId={useId()}
          onChange={(e) => {
            setFormData('selectedReraRawMandal', e);
            setFormData('selectedReraRawVillage', null);
            setFormData('selectedReraVillage', null);
          }}
          isDisabled={
            selectedReraMandal?.label.split(':')[0] === 'NULL' ? false : true
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
          value={selectedReraMandal ? selectedReraVillage : null}
          onChange={(e) => setFormData('selectedReraVillage', e)}
          isDisabled={Boolean(!selectedReraMandal)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Raw Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          instanceId={useId()}
          options={reraRawVillageOption || undefined}
          value={selectedReraMandal ? selectedReraRawVillage : null}
          onChange={(e) => setFormData('selectedReraRawVillage', e)}
          isDisabled={
            selectedReraVillage?.label.split(':')[0] === 'NULL' ? false : true
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
          value={selectedReraVillage ? selectedReraLocality : null}
          onChange={(e) => setFormData('selectedReraLocality', e)}
          isDisabled={Boolean(!selectedReraVillage)}
        />
      </label>
    </>
  );
}

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { SingleValue } from 'react-select';

export default function StaticDataForm() {
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
  const [selectedProjectSourceType, setSelectedProjectSourceType] =
    useState<SingleValue<{ label: string; value: string }> | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const { isLoading: isLoadingDMV, isError: isErrorDMV } = useQuery({
    queryKey: ['village-project-cleaner-developer-tagger'],
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
    data: tempProjects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: errorProjects,
  } = useQuery({
    queryKey: ['sourceProjects', selectedVillage],
    queryFn: async () => {
      if (!selectedVillage) return [];
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
        }[];
      }>('/temp-projects', {
        params: {
          village_id: selectedVillage?.value,
        },
      });
      console.log(res.data.data);
      return res.data.data.map((e) => ({
        label: `${e.id}:${e.name}`,
        value: e.id,
      }));
    },
    staleTime: Infinity,
  });
  return (
    <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
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
            console.log('district changed', e);
            if (e) {
              const mandalOpts = dmvData
                ?.find((item) => item.district_id === e.value)
                ?.mandals.map((item) => ({
                  label: `${item.mandal_id}:${item.mandal_name}`,
                  value: item.mandal_id,
                }));
              console.log('mandal options', mandalOpts);
              setMandalOptions(mandalOpts || []);
            } else {
              setMandalOptions([]);
            }
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
            console.log('mandal changed', e);
            if (e) {
              console.log(
                dmvData
                  ?.find((item) => item.district_id === selectedDistrict?.value)
                  ?.mandals.find((item) => item.mandal_id === e.value)
              );
              const villageOpts = dmvData
                ?.find((item) => item.district_id === selectedDistrict?.value)
                ?.mandals.find((item) => item.mandal_id === e.value)
                ?.villages.map((item) => ({
                  label: `${item.village_id}:${item.village_name}`,
                  value: item.village_id,
                }));
              console.log('village options', villageOpts);
              setVillageOptions(villageOpts || []);
            } else {
              setVillageOptions([]);
            }
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
          ) => {
            setSelectedVillage(e);
          }}
          isDisabled={Boolean(!selectedMandal)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>
          Project Source Type:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'project-source-type'}
          options={[
            {
              label: 'RERA',
              value: 'RERA',
            },
            {
              label: 'TEMP',
              value: 'TEMP',
            },
            {
              label: 'HYBRID',
              value: 'HYBRID',
            },
          ]}
          value={selectedProjectSourceType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            setSelectedProjectSourceType(e);
          }}
          isDisabled={Boolean(!selectedVillage)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>
          Select Project Name:
        </span>
        <Select
          className='w-full flex-[5]'
          key={'tempProject'}
          options={tempProjects || []}
          isLoading={isLoadingProjects}
          menuIsOpen={true}
          styles={{
            menu: (baseStyles: any, state: any) => ({
              ...baseStyles,
              height: '20vh',
              overflowY: 'scroll',
            }),
            menuList: (baseStyles: any, state: any) => ({
              ...baseStyles,
              height: '20vh',
            }),
          }}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            if (e) {
              setSelectedProjects((prev) => {
                return [
                  ...prev,
                  {
                    label: e.label.split(':')[1].trim(),
                    value: e.value,
                  },
                ];
              });
            }
          }}
          isDisabled={Boolean(!selectedVillage)}
        />
      </label>
      <span>
        Selected Source Projects:{' '}
        {selectedProjects.map((e) => e.label).join(', ')}
      </span>
      adasdasd
    </div>
  );
}

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import useDMVDataStore from '../../useDMVDataStore';
import { useProjectDataStore } from '../../useProjectDataStore';
import ProjectDropdown from './ProjectDropdown';

export default function ProjectContainer() {
  const {
    DMVData,
    districtOptions,
    mandalOptions,
    villageOptions,
    setDMVData,
    setDistrictOptions,
    setMandalOptions,
    setVillageOptions,
  } = useDMVDataStore();
  const { projectData, updateProjectData } = useProjectDataStore();

  const { isLoading: isLoadingDMV } = useQuery({
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
      setDMVData(telanganaData);
      const districtOpts = telanganaData.map((item) => ({
        label: `${item.district_id}:${item.district_name}`,
        value: item.district_id,
      }));
      setDistrictOptions(districtOpts);
      return res.data.data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });

  return (
    <div className='flex flex-col gap-4'>
      {/*  DISTRICT SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={districtOptions || []}
          value={projectData.selectedDistrict}
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateProjectData({
              selectedDistrict: e,
            });
            if (e) {
              const mandalOpts = DMVData?.find(
                (item) => item.district_id === e.value
              )?.mandals.map((item) => ({
                label: `${item.mandal_id}:${item.mandal_name}`,
                value: item.mandal_id,
              }));
              console.log('mandal options', mandalOpts);
              setMandalOptions(mandalOpts || []);
            } else {
              setMandalOptions([]);
            }
            updateProjectData({ selectedMandal: null });
          }}
        />
      </label>

      {/* MANDAL SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={mandalOptions || []}
          value={projectData.selectedMandal}
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateProjectData({ selectedMandal: e });
            if (e) {
              const villageOpts = DMVData?.find(
                (item) =>
                  item.district_id === projectData.selectedDistrict?.value
              )
                ?.mandals.find((item) => item.mandal_id === e.value)
                ?.villages.map((item) => ({
                  label: `${item.village_id}:${item.village_name}`,
                  value: item.village_id,
                }));
              setVillageOptions(villageOpts || []);
            } else {
              setVillageOptions([]);
            }
            updateProjectData({
              selectedVillage: null,
            });
          }}
          isDisabled={Boolean(!projectData.selectedDistrict)}
        />
      </label>

      {/* VILLAGE SELECTION */}
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          options={villageOptions || []}
          value={
            projectData.selectedMandal ? projectData.selectedVillage : null
          }
          isLoading={isLoadingDMV}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            updateProjectData({ selectedVillage: e });
            // resetData();
            // resetAllProjectData();
          }}
          isDisabled={Boolean(!projectData.selectedMandal)}
        />
      </label>
      <ProjectDropdown />
    </div>
  );
}

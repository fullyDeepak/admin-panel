import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import Select, { SingleValue } from 'react-select';
import useDMVDataStore from '../../useDMVDataStore';
import { useProjectDataStore } from '../../useProjectDataStore';
import { NewProjectData } from '@/app/forms/update-project/api_types';
import {
  TowerUnitDetailType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';

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
  const { setTowerFormData } = useTowerUnitStore();
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
  const { data: projectOptions, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: { id: number; project_name: string }[];
      }>('/projects');
      console.log(res.data.data);
      return res.data.data.map((ele) => ({
        label: `${ele.id}:${ele.project_name}`,
        value: ele.id,
      }));
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
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'onBoardedProjects'}
          options={projectOptions || []}
          isLoading={loadingProjects}
          value={projectData.selectedProject}
          onChange={async (
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            if (e) {
              updateProjectData({
                selectedProject: e,
              });
              const projectData = await axiosClient.get<NewProjectData>(
                '/onboarding/projects/' + e.value
              );
              const towerData: TowerUnitDetailType[] = [];
              projectData.data.data.towers.map((ele, index) => {
                towerData.push({
                  tower_id: ele.tower_id,
                  towerNameDisplay: ele.tower_name_alias,
                  towerNameETL: ele.etl_tower_name,
                  reraTowerId: ele.rera_tower_id,
                  reraId: ele.rera_id,
                  gfName: '',
                  gfUnitCount: '',
                  unitCards: [],
                  tmRefTable: [],
                  reraRefTable: [],
                  typicalMaxFloor: 0,
                  typicalUnitCount: '',
                });
              });
              setTowerFormData(towerData);
            }
          }}
        />
      </label>
    </div>
  );
}

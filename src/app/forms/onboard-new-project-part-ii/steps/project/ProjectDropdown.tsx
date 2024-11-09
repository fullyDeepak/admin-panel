import Select, { SingleValue } from 'react-select';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useProjectDataStore } from '../../useProjectDataStore';
import {
  TowerUnitDetailType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import { NewProjectData } from '@/app/forms/update-project/api_types';
import toast from 'react-hot-toast';

export default function ProjectDropdown() {
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
  const { projectData, updateProjectData } = useProjectDataStore();
  const { setTowerFormData } = useTowerUnitStore();

  async function handleProjectChange(
    e: SingleValue<{
      label: string;
      value: number;
    }>
  ) {
    if (e) {
      setTowerFormData([]);
      updateProjectData({
        selectedProject: e,
      });
      toast.promise(
        axiosClient.get<NewProjectData>('/onboarding/projects/' + e.value),
        {
          loading: "Fetching Project's Towers...",
          success: ({ data: res }) => {
            const towerData: TowerUnitDetailType[] = [];
            res.data.towers.map((ele) => {
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
            return 'Fetched Towers';
          },
          error: 'Error',
        }
      );
    }
  }

  return (
    <label className='flex items-center justify-between gap-5'>
      <span className='flex-[2] text-base md:text-xl'>Select Project:</span>
      <Select
        className='w-full flex-[5]'
        key={'onBoardedProjects'}
        options={projectOptions || []}
        isLoading={loadingProjects}
        value={projectData.selectedProject}
        onChange={handleProjectChange}
      />
    </label>
  );
}

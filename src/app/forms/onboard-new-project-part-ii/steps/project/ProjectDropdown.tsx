import Select, { SingleValue } from 'react-select';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useProjectDataStore } from '../../useProjectDataStore';
import {
  TowerUnitDetailType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import toast from 'react-hot-toast';

export interface ProjectData {
  status: string;
  data: {
    tower_id: string;
    tower_name: string;
    rera_id: any;
    ground_floor_name: string;
    ground_floor_unit_no_max: string;
    ground_floor_unit_no_min: string;
    typical_floor_unit_no_min: string;
    typical_floor_unit_no_max: string;
    min_floor: string;
    max_floor: string;
    rera_tower_id: any;
    etl_tower_name: string;
    display_tower_type: string;
    tm_unit_ref: {
      extent: number;
      facing: Record<string, string>;
      configName?: string;
      floor_list: string[];
      salable_area: number;
      unit_numbers: string | undefined[];
    }[];
  }[];
}

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
        axiosClient.get<ProjectData>(
          '/onboarding/getProjectsDetailsForPart2/',
          { params: { project_id: e.value } }
        ),
        {
          loading: "Fetching Project's Towers...",
          success: ({ data: res }) => {
            const towerData: TowerUnitDetailType[] = [];
            res.data.map((ele) => {
              towerData.push({
                tower_id: +ele.tower_id,
                towerNameDisplay: ele.tower_name,
                towerNameETL: ele.etl_tower_name,
                reraTowerId: ele.rera_tower_id,
                towerType: ele.display_tower_type,
                reraId: ele.rera_id,
                gfName: ele.ground_floor_name,
                gfUnitCount: ele.ground_floor_unit_no_max,
                unitCards: [],
                tmRefTable: [],
                reraRefTable: [],
                typicalMaxFloor: +ele.max_floor,
                typicalUnitCount: ele.typical_floor_unit_no_max,
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

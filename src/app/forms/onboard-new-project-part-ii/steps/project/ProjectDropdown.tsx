import Select, { SingleValue } from 'react-select';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useProjectDataStore } from '../../useProjectDataStore';
import {
  RefTableType,
  TowerUnitDetailType,
  UnitCardType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import toast from 'react-hot-toast';
import { convertArrayToRangeString } from '../../utils';
import { uniq } from 'lodash';

export interface ProjectData {
  status: string;
  data: {
    tower_id: string;
    tower_name: string;
    rera_id: string | null;
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
      unit_numbers: (string | undefined)[];
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
              const unitCards: UnitCardType[] = [];
              const tmUnitRefKey: Record<
                string,
                RefTableType & { extent: string }
              > = {};
              ele.tm_unit_ref.map((etlData) => {
                const key = `${etlData.configName || 'NULL'}: ${etlData.salable_area}`;
                if (key in tmUnitRefKey) {
                  const existingData = tmUnitRefKey[key];
                  existingData.type = key;
                  existingData.config = uniq(
                    `${existingData.config},${etlData.configName}`.split(',')
                  ).join(', ');
                  existingData.unitCount = (
                    +existingData.unitCount + etlData.unit_numbers.length
                  ).toString();
                  existingData.salableArea = uniq(
                    `${existingData.salableArea},${etlData.salable_area}`.split(
                      ','
                    )
                  ).join(', ');
                  console.log(
                    'salArea: ',
                    uniq(
                      `${existingData.salableArea},${etlData.salable_area}`.split(
                        ','
                      )
                    ).join(', ')
                  );
                  existingData.extent = uniq(
                    `${existingData.extent},${etlData.extent}`.split(',')
                  ).join(', ');
                  existingData.facing = uniq(
                    `${existingData.facing}, ${Object.values(etlData.facing).join(', ')}`.split(
                      ', '
                    )
                  ).join(', ');
                  existingData.floorList = `${existingData.floorList}, ${etlData.floor_list.join(', ')}`;
                  existingData.unitList = `${existingData.unitList}, ${etlData.unit_numbers.join(', ')}`;
                  tmUnitRefKey[key] = existingData;
                } else {
                  console.log({ mainSale: etlData.salable_area });
                  const newData = {} as RefTableType & { extent: string };
                  newData.type = key;
                  newData.config = etlData.configName || 'NULL';
                  newData.unitCount = etlData.unit_numbers.length.toString();
                  newData.salableArea = etlData.salable_area.toString();
                  newData.extent = etlData.extent.toString();
                  newData.facing = uniq(Object.values(etlData.facing)).join(
                    ', '
                  );
                  newData.floorList = etlData.floor_list.join(', ');
                  newData.unitList = etlData.unit_numbers.join(', ');
                  tmUnitRefKey[key] = newData;
                }
              });
              ele.tm_unit_ref.map((etlData, idx) => {
                unitCards.push({
                  id: idx + 1,
                  reraUnitType: null,
                  existingUnitType: null,
                  floorNos: convertArrayToRangeString(etlData.floor_list),
                  salableArea: etlData.salable_area,
                  extent: etlData.extent,
                  parking: 0,
                  facing: null,
                  corner: false,
                  configName: etlData.configName || null,
                  configVerified: true,
                  unitFloorCount: null,
                  unitNos: etlData.unit_numbers.join(', '),
                  doorNoOverride: '',
                  maidConfig: null,
                  toiletConfig: null,
                  tmUnitType: null,
                });
              });
              towerData.push({
                tower_id: +ele.tower_id,
                towerNameDisplay: ele.tower_name,
                towerNameETL: ele.etl_tower_name,
                reraTowerId: ele.rera_tower_id,
                towerType: ele.display_tower_type,
                reraId: ele.rera_id || '',
                gfName: ele.ground_floor_name,
                gfUnitCount: ele.ground_floor_unit_no_max,
                unitCards: unitCards,
                tmRefTable: Object.values(tmUnitRefKey),
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

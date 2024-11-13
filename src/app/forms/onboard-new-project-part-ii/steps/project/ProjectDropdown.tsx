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
import { uniq } from 'lodash';
import { convertArrayToRangeString } from '../../utils';

export interface ProjectData {
  status: string;
  data: {
    tmData: {
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
    unitData: {
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
      unit_type_json: {
        unit_type_id: string;
        tower_id: number;
        rera_type: string | null;
        tower_type: string;
        unit_type: string;
        saleable_area: number;
        parking: number | null;
        extent: number;
        config: string;
        confident: boolean;
        wc_count: string | null;
        other_features: any[];
        unit_floors: number;
        door_no_override: string | null;
        type_floors: string;
        type_units: string;
        facing: string;
        is_corner: boolean;
      }[];
    }[];
    reraData: {
      rera_tower_id: string;
      tower_id: string;
      rera_unit_type_ids: string[];
      ref_data: {
        units: string[] | null;
        config: string;
        floor_ids: number[];
        salable_area: number;
        facing: string | null;
      }[];
    }[];
  };
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
            res.data.tmData.map((ele) => {
              const unitCards: UnitCardType[] = [];
              const tmUnitRefKey: Record<
                string,
                RefTableType & { extent: string }
              > = {};
              ele.tm_unit_ref?.map((etlData) => {
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

              const unitData = res.data.unitData.find((temp) => {
                return temp.tower_id == ele.tower_id;
              });
              const reraData = res.data.reraData.find((temp) => {
                return temp.tower_id == ele.tower_id;
              });

              const reraRefTable: RefTableType[] | undefined =
                reraData?.ref_data.map((item) => ({
                  type: `${item.config} : ${item.salable_area}`,
                  unitCount: item.units?.length.toString() || 'N/A',
                  config: item.config,
                  salableArea: item.salable_area.toString(),
                  facing: item.facing ? item.facing.substring(0, 1) : 'N/A',
                  floorList: convertArrayToRangeString(
                    item.floor_ids.map(String)
                  ),
                  unitList: item.units?.join(', ') || 'N/A',
                }));

              unitData?.unit_type_json.map((etlData, idx) => {
                unitCards.push({
                  id: idx + 1,
                  reraUnitType: null,
                  floorNos: etlData.type_floors,
                  salableArea: etlData.saleable_area,
                  extent: etlData.extent,
                  parking: etlData.parking || 0,
                  facing: etlData.facing,
                  corner: etlData.is_corner,
                  configName: etlData.config || null,
                  configVerified: true,
                  unitFloorCount: etlData.unit_floors.toString(),
                  unitNos: etlData.type_units,
                  doorNoOverride: etlData.door_no_override || '',
                  otherConfig: null,
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
                reraRefTable: reraRefTable || [],
                typicalMaxFloor: +ele.max_floor,
                typicalUnitCount: ele.typical_floor_unit_no_max,
                reraUnitTypeOption:
                  reraData?.rera_unit_type_ids.map((ele) => ({
                    label: ele,
                    value: ele,
                  })) || [],
              });
            });
            setTowerFormData(towerData);
            return 'Fetched Towers';
          },
          error: (err) => {
            console.log(err);
            return 'Error';
          },
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

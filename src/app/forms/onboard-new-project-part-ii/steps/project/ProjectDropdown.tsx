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
import { useProjectImageStore } from '../../useProjectImageStore';
import { findLargest, findSmallest } from '../tower/utils';
import { useEffect, useState } from 'react';

export interface ProjectData {
  status: string;
  data: {
    tmData: {
      tower_id: string;
      tower_name: string;
      rera_id: string | null;
      rera_tower_id: any;
      etl_tower_name: string;
      display_tower_type: string;
      ground_floor_name: string;
      ground_floor_unit_no_min: string;
      ground_floor_unit_no_max: string;
      typical_floor_unit_no_min: string;
      typical_floor_unit_no_max: string;
      max_floor: string;
      floor_list: string[];
      typical_units: string[];
      gf_units: string[];
      gf_floors: string[];
      tm_unit_ref: {
        extent: number[];
        facing: Record<string, string>;
        configName?: string;
        floor_list: string[];
        salable_area: number;
        unit_numbers: (string | undefined)[];
        apt_unit_count: number;
        villa_unit_count: number;
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
        other_features: string;
        unit_floors: number;
        door_no_override: string | null;
        type_floors: string;
        type_units: string;
        facing: string;
        is_corner: boolean;
        s3_path: string;
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
    statusData: {
      project_id: string;
      tower_id: string;
      updated_at: string;
      updated_field: string;
      updated_value: string;
    }[];
  };
}

export default function ProjectDropdown() {
  const { data: projectOptions, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: { id: number; project_name: string; config_tagging: boolean }[];
      }>('/onboarding/getProjectsForPart2');
      return res.data.data;
    },
  });

  const { projectData, updateProjectData } = useProjectDataStore();
  const {
    setTowerFormData,
    resetStatusFormData,
    setLockUnitType,
    setExistingStatusData,
  } = useTowerUnitStore();
  const { resetImageStore } = useProjectImageStore();
  const [optionType, setOptionType] = useState<
    'ALL' | 'COMPLETED' | 'IN_COMPLETED'
  >('IN_COMPLETED');
  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

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
              const tmTableData: (RefTableType & {
                extent: string;
              })[] = [];
              ele.tm_unit_ref?.map((etlData) => {
                const key = `${etlData.configName || 'NULL'}: ${etlData.salable_area}`;

                tmTableData.push({
                  ...etlData,
                  extent: etlData.extent.join(', '),
                  config: etlData.configName || 'NULL',
                  type: key,
                  unitCount:
                    ele.display_tower_type === 'APARTMENT'
                      ? etlData.apt_unit_count.toString()
                      : etlData.villa_unit_count.toString(),
                  salableArea: etlData.salable_area.toString(),
                  facing:
                    uniq(Object.values(etlData.facing || {})).join(', ') ||
                    'N/A',
                  floorList: convertArrayToRangeString(
                    etlData.floor_list?.map(String) || []
                  ),
                  unitList: etlData.unit_numbers.join(', '),
                });
              });

              const unitData = res.data.unitData.find((temp) => {
                return temp.tower_id == ele.tower_id;
              });
              const reraData = res.data.reraData.find((temp) => {
                return temp.tower_id == ele.tower_id;
              });

              const reraRefTable: RefTableType[] | undefined =
                reraData?.ref_data
                  .sort((a, b) => b.salable_area - a.salable_area)
                  .map((item) => ({
                    type: `${item.config} : ${item.salable_area}`,
                    unitCount: item.units?.length.toString() || 'N/A',
                    config: item.config,
                    salableArea: item.salable_area?.toString() || '',
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
                  salableArea: etlData.saleable_area || 0,
                  extent: etlData.extent || 0,
                  parking: etlData.parking || 0,
                  facing: etlData.facing,
                  corner: etlData.is_corner,
                  configName: etlData.config || '',
                  configVerified: etlData.confident || true,
                  unitFloorCount: etlData.unit_floors.toString(),
                  unitNos: etlData.type_units,
                  doorNoOverride: etlData.door_no_override || '',
                  otherConfig: etlData.other_features,
                  toiletConfig: etlData.wc_count,
                  tmUnitType: null,
                  unitFloorPlanFile: null,
                  s3_path: etlData.s3_path || '',
                });
              });
              towerData.push({
                tower_id: +ele.tower_id,
                towerFloorPlanFile: [],
                towerNameDisplay: ele.tower_name,
                towerNameETL: ele.etl_tower_name,
                reraTowerId: ele.rera_tower_id,
                towerType: ele.display_tower_type,
                reraId: ele.rera_id || '',
                maxFloor:
                  ele?.floor_list && ele.floor_list.length > 0
                    ? Math.max(...ele.floor_list.map(Number))
                    : 0,
                gfName: ele.ground_floor_name || '',
                gfUnitMaxUN: ele.gf_units
                  ? findLargest(ele.gf_units).toString()
                  : '',
                gfUnitMinUN: ele.gf_units
                  ? findSmallest(ele.gf_units).toString()
                  : '',
                typicalMaxUN: ele.typical_units
                  ? findLargest(ele.typical_units).toString()
                  : '',
                typicalMinUN: ele.typical_units
                  ? findSmallest(ele.typical_units).toString()
                  : '',
                dbMaxFloor: ele.max_floor || 'N/A',
                dbGfName: ele.ground_floor_name || 'N/A',
                dbGfMin: ele.ground_floor_unit_no_min || 'N/A',
                dbGfMax: ele.ground_floor_unit_no_max || 'N/A',
                dbTypicalMin: ele.typical_floor_unit_no_min || 'N/A',
                dbTypicalMax: ele.typical_floor_unit_no_max || 'N/A',
                unitCards: unitCards,
                tmRefTable: tmTableData,
                reraRefTable: reraRefTable || [],
                reraUnitTypeOption:
                  reraData?.rera_unit_type_ids.map((ele) => ({
                    label: ele,
                    value: ele,
                  })) || [],
              });
            });
            setExistingStatusData(res.data.statusData);
            setLockUnitType(e.label.includes('✅'));
            setTowerFormData(towerData);
            resetImageStore();
            resetStatusFormData();
            return 'Fetched Towers';
          },
          error: (err) => {
            console.log(err);
            resetImageStore();
            resetStatusFormData();
            return 'Error';
          },
        }
      );
    }
  }

  useEffect(() => {
    if (optionType === 'ALL') {
      setOptions(
        projectOptions?.map((ele) => ({
          label: ele.config_tagging
            ? `${ele.id}:${ele.project_name}✅`
            : `${ele.id}:${ele.project_name}`,
          value: ele.id,
        })) || []
      );
    } else if (optionType === 'COMPLETED') {
      setOptions(
        projectOptions
          ?.filter((ele) => ele.config_tagging)
          .map((ele) => ({
            label: `${ele.id}:${ele.project_name}✅`,
            value: ele.id,
          })) || []
      );
    } else if (optionType === 'IN_COMPLETED') {
      setOptions(
        projectOptions
          ?.filter((ele) => !ele.config_tagging)
          .map((ele) => ({
            label: `${ele.id}:${ele.project_name}`,
            value: ele.id,
          })) || []
      );
    }
  }, [optionType, projectOptions]);

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Filter:</span>
        <div className='flex flex-[5] items-center gap-5'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              name='radio-1'
              className='radio-success radio'
              checked={optionType === 'ALL'}
              onChange={() => setOptionType('ALL')}
            />
            <span>Show All</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              name='radio-1'
              className='radio-success radio'
              checked={optionType === 'IN_COMPLETED'}
              onChange={() => setOptionType('IN_COMPLETED')}
            />
            <span>Show Incomplete</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              name='radio-1'
              className='radio-success radio'
              checked={optionType === 'COMPLETED'}
              onChange={() => setOptionType('COMPLETED')}
            />
            <span>Show Completed</span>
          </label>
        </div>
      </div>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Select Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'onBoardedProjects'}
          options={options || []}
          isLoading={loadingProjects}
          value={projectData.selectedProject}
          onChange={handleProjectChange}
        />
      </label>
    </div>
  );
}

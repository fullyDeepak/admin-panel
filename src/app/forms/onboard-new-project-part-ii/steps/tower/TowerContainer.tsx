import { inputBoxClass } from '@/app/constants/tw-class';
import TowerSection from './TowerSection';
import { useState } from 'react';
import {
  RefTableType,
  TowerUnitDetailType,
  UnitCardType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import axiosClient from '@/utils/AxiosClient';
import { uniq } from 'lodash';
import toast from 'react-hot-toast';

export default function TowerContainer() {
  const [value, setValue] = useState('');
  const [valueTM, setValueTM] = useState('');

  const { setTowerFormData } = useTowerUnitStore();
  async function fetchReraUnitRef() {
    if (!value) return;
    const response = axiosClient.get<{
      data: {
        project_id: string;
        project_name: string;
        project_type: string;
        project_subtype: string;
        total_land_area_sqmt: number;
        calculated_net_land_area_sqmt: number;
        village_id: string;
        survey_number: string;
        plot_number: string;
        rera_id: string;
        developer_name: string;
        master_developer_id: number | null;
        jv_id: number | null;
        is_jv: boolean;
        tower_count: number;
        tower_id: string;
        tower_name: string;
        tower_type: string;
        max_floor_id: string;
        min_floor: number;
        gf_max_unit_count: string;
        typical_floor_max_unit: string;
        etl_unit_configs: {
          configName: string;
          minArea: number;
          maxArea: number;
          facing:
            | 'EAST'
            | 'EF'
            | 'NF'
            | 'NORTH'
            | 'SF'
            | 'SOUTH'
            | 'WEST'
            | 'WF'
            | null;
          corner: boolean;
          unit_count: number;
          floor_list: number[];
        }[];
      }[];
    }>('/forms/rera/getProjectsDetails', {
      params: { projectIds: JSON.stringify([value]) },
    });

    toast.promise(response, {
      loading: 'Fetching Project Details...',
      success: ({ data: res }) => {
        const data = res.data;
        const phases: Record<number, number> = {};
        const projectIds = uniq(data.map((item) => +item.project_id));
        projectIds.map((num, index) => (phases[num] = index + 1));

        const towersData: TowerUnitDetailType[] = data.map((item, index) => {
          const unitCards: UnitCardType[] = [];
          const reraRefTable: RefTableType[] = [];
          item.etl_unit_configs.map((etl, idx) => {
            unitCards.push({
              id: idx + 1,
              reraUnitType: null,
              existingUnitType: null,
              floorNos: '',
              salableArea: etl.minArea,
              extent: 0,
              parking: 0,
              doorNoOverride: '',
              facing: etl.facing?.substring(0, 1) || null,
              corner: false,
              configName: etl.configName,
              configVerified: true,
              unitFloorCount: null,
              unitNos: '',
              maidConfig: '',
              tmUnitType: null,
              toiletConfig: '',
            });
            reraRefTable.push({
              type: `${etl.configName} : ${etl.minArea} : ${etl.maxArea} : ${etl.facing || 'N/A'}`,
              towerId: item.tower_id,
              unitCount: etl.unit_count.toString(),
              config: etl.configName,
              salableArea: `${etl.minArea} : ${etl.maxArea}`,
              facing: etl.facing || 'N/A',
              floorList: etl.floor_list.sort((a, b) => a - b).join(', '),
            });
          });

          return {
            tower_id: index + 1,
            reraId: item.rera_id || '',
            reraTowerId: item.rera_id,
            towerNameDisplay: item.tower_name,
            towerNameETL: item.tower_name,
            towerType: '',
            gfName: '',
            gfUnitCount: item.gf_max_unit_count,
            reraRefTable: reraRefTable,
            tmRefTable: [],
            typicalMaxFloor: +item.max_floor_id,
            typicalUnitCount: item.typical_floor_max_unit,
            unitCards: unitCards,
          };
        });
        setTowerFormData(towersData);
        return 'Project Details fetched';
      },
      error: 'Error',
    });
  }

  async function fetchTMUnitRef() {
    if (!valueTM) return;
    const response = axiosClient.get<{
      data: {
        tower_id: number;
        unit_types: {
          extent: number;
          facing: string;
          configName: string[];
          floor_list: string[];
          unit_count: number;
          salable_area: number;
        }[];
      }[];
    }>('/forms/tmUnitTypeRef', {
      params: { project_id: valueTM },
    });

    toast.promise(response, {
      loading: 'Fetching Project Details...',
      success: ({ data: res }) => {
        const data = res.data;

        const towersData: TowerUnitDetailType[] = data.map((item, index) => {
          const unitCards: UnitCardType[] = [];
          const tmRefTable: (RefTableType & { extent: string })[] = [];
          item.unit_types.map((etl, idx) => {
            unitCards.push({
              id: idx + 1,
              reraUnitType: null,
              existingUnitType: null,
              floorNos: '',
              salableArea: etl.salable_area || 0,
              extent: etl.extent || 0,
              parking: 0,
              doorNoOverride: '',
              facing: etl.facing?.substring(0, 1) || null,
              corner: false,
              configName: etl.configName?.join(', ') || '',
              configVerified: true,
              unitFloorCount: null,
              unitNos: '',
              maidConfig: '',
              tmUnitType: null,
              toiletConfig: '',
            });
            tmRefTable.push({
              type: `${etl.configName} : ${etl.salable_area} : ${etl.facing || 'N/A'}`,
              towerId: item.tower_id.toString(),
              unitCount: etl.unit_count.toString(),
              config: etl.configName?.join(', '),
              salableArea: etl.salable_area.toString(),
              extent: etl.extent.toString(),
              facing: etl.facing || 'N/A',
              floorList: etl.floor_list.join(', '),
            });
          });

          return {
            tower_id: index + 1,
            reraId: '',
            reraTowerId: '',
            towerNameDisplay: '',
            towerNameETL: '',
            towerType: '',
            gfName: '',
            gfUnitCount: '',
            reraRefTable: [],
            tmRefTable: tmRefTable,
            typicalMaxFloor: 0,
            typicalUnitCount: '',
            unitCards: unitCards,
          };
        });
        setTowerFormData(towersData);
        return 'Project Details fetched';
      },
      error: 'Error',
    });
  }
  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Fetch Rera Ref:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            className={`${inputBoxClass} !ml-0`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button className='btn btn-neutral btn-sm' onClick={fetchReraUnitRef}>
          Fetch
        </button>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Fetch TM Ref:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            className={`${inputBoxClass} !ml-0`}
            value={valueTM}
            onChange={(e) => setValueTM(e.target.value)}
          />
        </div>
        <button className='btn btn-neutral btn-sm' onClick={fetchTMUnitRef}>
          Fetch
        </button>
      </div>
      <TowerSection />
    </>
  );
}

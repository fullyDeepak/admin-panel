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
  const { setTowerFormData } = useTowerUnitStore();
  async function fetchProjectsDetails() {
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
              salableAreaMin: etl.minArea,
              salableAreaMax: etl.maxArea,
              extentMin: 0,
              extentMax: 0,
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
            id: index + 1,
            reraId: item.rera_id || '',
            reraTowerId: item.rera_id,
            towerNameDisplay: item.tower_name,
            towerNameETL: item.tower_name,
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
  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3]'>Fetch Rera:</span>
        <div className='flex flex-[5] items-center gap-2'>
          <input
            className={`${inputBoxClass} !ml-0`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          className='btn btn-neutral btn-sm'
          onClick={fetchProjectsDetails}
        >
          Fetch
        </button>
      </div>
      <TowerSection />
    </>
  );
}

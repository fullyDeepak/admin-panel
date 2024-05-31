import axiosClient from '@/utils/AxiosClient';
import { startCase } from 'lodash';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TowerFloorDataType = {
  towerId: number;
  towerName: string;
  towerType: string;
  floorsUnits: {
    floorId: number;
    units: string[];
    selectedUnits: string[];
  }[];
};

interface State {
  towerFloorFormData: TowerFloorDataType[];
  loadingTowerFloorData: 'idle' | 'loading' | 'complete' | 'error';
}

type Actions = {
  setTowerFloorFormData: (newData: TowerFloorDataType[]) => void;
  setSelectedUnit: (
    payload:
      | {
          towerId: number;
          floorId: number;
          unitName: string;
          selectColumn?: boolean;
        }
      | {
          towerId: number;
          floorId: number;
          unitName: number;
          selectColumn: boolean;
        }
  ) => void;
  setLoadingTowerFloorData: (status: State['loadingTowerFloorData']) => void;
  fetchTowerFloorData: (projectIds: number[]) => void;
  resetTowerFloorData: () => void;
};

interface Response {
  project_id: number;
  project_name: string;
  tower_id: number;
  tower_name: string;
  type: 'apartment' | 'villa' | 'apartmentSingle';
  floors_units: {
    floor_id: number;
    unit_names: string[];
  }[];
}

export const useImageFormStore = create<State & Actions>()(
  immer((set) => ({
    // Initial state
    towerFloorFormData: [],
    setTowerFloorFormData: (newData) => set({ towerFloorFormData: newData }),
    setSelectedUnit: (payload) =>
      set(({ towerFloorFormData }) => {
        if (typeof payload.unitName === 'number') {
          const unitIndex = payload.unitName;
          const towerData = towerFloorFormData.find(
            (towerFloorData) => towerFloorData.towerId === payload.towerId
          );
          if (payload.selectColumn === true) {
            towerData?.floorsUnits.map((item) => {
              item.selectedUnits.push(item.units[unitIndex]);
            });
          } else if (payload.selectColumn === false) {
            towerData?.floorsUnits.map((item) => {
              const tempUnitName = item.units[unitIndex];
              const tempUnitIndex = item.selectedUnits.indexOf(tempUnitName);
              item.selectedUnits.splice(tempUnitIndex, 1);
            });
          }
        } else {
          const towerData = towerFloorFormData.find(
            (towerFloorData) => towerFloorData.towerId === payload.towerId
          );
          const floorUnitsData = towerData?.floorsUnits.find(
            (flrUnit) => flrUnit.floorId === payload.floorId
          );
          if (floorUnitsData?.selectedUnits.includes(payload.unitName)) {
            const unitNameIndex = floorUnitsData?.selectedUnits.indexOf(
              payload.unitName
            );
            floorUnitsData?.selectedUnits?.splice(unitNameIndex, 1);
          } else {
            floorUnitsData?.selectedUnits.push(payload.unitName);
          }
        }
      }),
    loadingTowerFloorData: 'idle',
    setLoadingTowerFloorData: (status) =>
      set({ loadingTowerFloorData: status }),
    fetchTowerFloorData: async (projectId) => {
      set({ loadingTowerFloorData: 'loading' });
      try {
        const response = await axiosClient.get<{
          data: Response[];
        }>('/forms/getUMUnitNames', {
          params: { project_id: projectId },
        });
        const units: TowerFloorDataType[] = response.data.data?.map(
          (towerFloorData) => ({
            towerId: towerFloorData.tower_id,
            towerName: towerFloorData.tower_name,
            towerType: startCase(towerFloorData.type),
            floorsUnits: towerFloorData.floors_units.map((floorUnits) => ({
              floorId: floorUnits.floor_id,
              units: floorUnits.unit_names,
              selectedUnits: [],
            })),
          })
        );
        set({ loadingTowerFloorData: 'complete' });
        set({ towerFloorFormData: units });
      } catch (error) {
        set({ loadingTowerFloorData: 'error' });
      }
    },
    resetTowerFloorData: () =>
      set({ towerFloorFormData: [], loadingTowerFloorData: 'idle' }),
  }))
);

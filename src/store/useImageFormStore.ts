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
  }[];
};

export type SetSelectedUnitProps =
  | {
      towerId: number;
      floorId: number;
      unitName: string;
      unitType: number;
      selectColumn?: boolean;
    }
  | {
      towerId: number;
      floorId: number;
      unitName: number;
      unitType: number;
      selectColumn: boolean;
    };

export type SelectedTowerFloorUnitDataType = {
  [towerId: number]: {
    selectedUnits: {
      [unitName: string]: null | number;
    };
  };
};
interface State {
  towerFloorFormData: TowerFloorDataType[];
  selectedTFUData: SelectedTowerFloorUnitDataType;
  loadingTowerFloorData: 'idle' | 'loading' | 'complete' | 'error';
}

type Actions = {
  setTowerFloorFormData: (newData: TowerFloorDataType[]) => void;
  setSelectedUnit: (
    payload:
      | {
          towerId: number;
          unitName: string;
          unitType: number;
          selectColumn?: boolean;
        }
      | {
          towerId: number;
          unitName: number;
          unitType: number;
          selectColumn: boolean;
        }
  ) => void;
  fetchTowerFloorData: (projectId: number) => void;
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
  immer((set, get) => ({
    // Initial state
    towerFloorFormData: [] as TowerFloorDataType[],
    selectedTFUData: {} as SelectedTowerFloorUnitDataType,
    setTowerFloorFormData: (newData) => set({ towerFloorFormData: newData }),
    setSelectedUnit: (payload) =>
      set(({ towerFloorFormData, selectedTFUData }) => {
        const unitType = payload.unitType;
        const unitName = payload.unitName;
        if (typeof payload.unitName === 'number') {
          const unitIndex = payload.unitName;
          const ogTowerData = towerFloorFormData.find(
            (towerFloorData) => towerFloorData.towerId === payload.towerId
          );
          ogTowerData?.floorsUnits.map((item) => {
            if (payload.selectColumn === true) {
              console.log('Updating TFU....', unitType);
              selectedTFUData[payload.towerId]['selectedUnits'][
                item.units[unitIndex]
              ] = unitType !== null ? unitType + 1 : null;
            } else if (payload.selectColumn === false) {
              selectedTFUData[payload.towerId]['selectedUnits'][
                item.units[unitIndex]
              ] = null;
            }
          });
        } else {
          const prevValue =
            selectedTFUData[payload.towerId]['selectedUnits'][unitName];
          selectedTFUData[payload.towerId]['selectedUnits'][unitName] =
            prevValue === null ? unitType + 1 : null;
        }
      }),
    loadingTowerFloorData: 'idle',
    fetchTowerFloorData: async (projectId) => {
      set({ loadingTowerFloorData: 'loading' });
      try {
        const response = await axiosClient.get<{
          data: Response[];
        }>('/forms/getUMUnitNames', {
          params: { project_id: projectId },
        });
        const units: TowerFloorDataType[] = [];
        const selectedUnits: SelectedTowerFloorUnitDataType = {};
        response.data.data?.map((towerFloorData) => {
          selectedUnits[towerFloorData.tower_id] = { selectedUnits: {} };
          units.push({
            towerId: towerFloorData.tower_id,
            towerName: towerFloorData.tower_name,
            towerType: startCase(towerFloorData.type),
            floorsUnits: towerFloorData.floors_units.map((floorUnits) => ({
              floorId: floorUnits.floor_id,
              units: floorUnits.unit_names,
              selectedUnits: [],
            })),
          });
          towerFloorData.floors_units.map((floorUnits) => {
            floorUnits.unit_names.map((item) => {
              selectedUnits[towerFloorData.tower_id]['selectedUnits'][item] =
                null;
            });
          });
        });
        set({ towerFloorFormData: units });
        set({ selectedTFUData: selectedUnits });
        set({ loadingTowerFloorData: 'complete' });
      } catch (error) {
        set({ loadingTowerFloorData: 'error' });
        console.log(error);
      }
    },
    resetTowerFloorData: () =>
      set({ towerFloorFormData: [], loadingTowerFloorData: 'idle' }),
  }))
);

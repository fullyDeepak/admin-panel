import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { FormTowerDetailType } from '@/types/types';

interface TowerDetailsDataType extends FormTowerDetailType {
  towerType: {
    label: string;
    value: string;
  };
}

interface FormState {
  towerFormData: TowerDetailsDataType[];
  updateTowerFormData: (
    id: number,
    key: keyof TowerDetailsDataType,
    value: any
  ) => void;
  addNewTowerData: (newDetails: TowerDetailsDataType) => void;
  deleteTowerFormData: (towerId: number) => void;
  addEtlUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  updateEtlUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  deleteEtlUnitConfig: (towerId: number, configName: string) => void;
  resetTowerFormData: () => void;
}

const initialState: TowerDetailsDataType[] = [
  {
    id: 1,
    projectPhase: 1,
    reraId: '',
    towerType: {
      label: '',
      value: '',
    },
    towerName: '',
    towerDoorNo: '',
    minFloor: 0,
    maxFloor: 0,
    groundFloorName: '',
    groundFloorUnitNoMin: 0,
    groundFloorUnitNoMax: 0,
    typicalFloorUnitNoMin: 0,
    typicalFloorUnitNoMax: 0,
    deleteFullUnitNos: '',
    exceptionUnitNos: '',
    etlUnitConfigs: [{ configName: '', minArea: 0, maxArea: 0 }],
    validTowerUnits: null,
  },
];

export const useTowerStore = create<FormState>((set) => ({
  // Initial state
  towerFormData: initialState,

  // Update functions
  updateTowerFormData: (id, key, value) => {
    set((state) => ({
      towerFormData: state.towerFormData.map((data) =>
        data.id === id ? { ...data, [key]: value } : data
      ),
    }));
  },
  deleteTowerFormData: (towerId) => {
    set((state) => ({
      towerFormData: state.towerFormData.filter((data) => data.id !== towerId),
    }));
  },

  addNewTowerData: (newDetails) => {
    set((state) => ({
      towerFormData: [...state.towerFormData, { ...newDetails }],
    }));
  },

  addEtlUnitConfig: (towerId, configName, minArea, maxArea) => {
    set((state) => ({
      towerFormData: state.towerFormData.map((data) =>
        data.id === towerId
          ? {
              ...data,
              etlUnitConfigs: [
                ...data.etlUnitConfigs,
                { configName, minArea, maxArea },
              ],
            }
          : data
      ),
    }));
  },

  updateEtlUnitConfig: (towerId, configName, minArea, maxArea) => {
    set((state) => ({
      towerFormData: state.towerFormData.map((data) =>
        data.id === towerId
          ? {
              ...data,
              etlUnitConfigs: data.etlUnitConfigs.map((unit) =>
                unit.configName === configName
                  ? {
                      ...unit,
                      configName: unit.configName,
                      minArea: minArea,
                      maxArea: maxArea,
                    }
                  : unit
              ),
            }
          : data
      ),
    }));
  },

  deleteEtlUnitConfig: (towerId, configName) => {
    set((state) => ({
      towerFormData: state.towerFormData.map((data) =>
        data.id === towerId
          ? {
              ...data,
              etlUnitConfigs: data.etlUnitConfigs.filter(
                (config) => config.configName !== configName
              ),
            }
          : data
      ),
    }));
  },
  resetTowerFormData: () => {
    set({ towerFormData: initialState });
  },
}));

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { FormTowerDetailType } from '@/types/types';

interface towerDetailRera extends FormTowerDetailType {
  reraTowerId: string;
  towerType: SingleValue<{
    label: string;
    value: string;
  }>;
  displayTowerType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  towerTypeSuggestion: string;
}
interface FormState {
  towerFormDataRera: towerDetailRera[];
  setTowersDataRera: (_data: towerDetailRera[]) => void;
  updateTowerFormDataRera: (
    _id: number,
    _key: keyof towerDetailRera,
    _value: any
  ) => void;
  addNewTowerDataRera: (_newDetails: towerDetailRera) => void;
  deleteTowerFormDataRera: (_towerId: number) => void;
  addEtlUnitConfigRera: (
    _towerId: number,
    _configName: string,
    _minArea: number,
    _maxArea: number
  ) => void;
  updateEtlUnitConfigRera: (
    _towerId: number,
    _configName: string,
    _minArea: number,
    _maxArea: number
  ) => void;
  deleteEtlUnitConfigRera: (_towerId: number, _configName: string) => void;
  resetTowerFormDataRera: () => void;
}

const initialState: towerDetailRera[] = [
  {
    id: 1,
    projectPhase: 1,
    reraId: '',
    reraTowerId: '',
    towerType: {
      label: '',
      value: '',
    },
    displayTowerType: null,
    towerTypeSuggestion: '',
    etlTowerName: '',
    towerNameAlias: '',
    towerDoorNo: '',
    minFloor: 0,
    maxFloor: 0,
    validTowerUnits: null,
    groundFloorName: '',
    groundFloorUnitNoMin: 0,
    groundFloorUnitNoMax: 0,
    typicalFloorUnitNoMin: 0,
    typicalFloorUnitNoMax: 0,
    deleteFullUnitNos: '',
    exceptionUnitNos: '',
    etlUnitConfigs: [{ configName: '', minArea: 0, maxArea: 0 }],
  },
];

export const useTowerStoreRera = create<FormState>((set) => ({
  // Initial state
  towerFormDataRera: initialState,

  // Update functions
  updateTowerFormDataRera: (id, key, value) => {
    set((state) => ({
      towerFormDataRera: state.towerFormDataRera.map((data) =>
        data.id === id ? { ...data, [key]: value } : data
      ),
    }));
  },
  setTowersDataRera: (data) => {
    set(() => ({
      towerFormDataRera: data,
    }));
  },
  deleteTowerFormDataRera: (towerId) => {
    set((state) => ({
      towerFormDataRera: state.towerFormDataRera.filter(
        (data) => data.id !== towerId
      ),
    }));
  },

  addNewTowerDataRera: (newDetails) => {
    set((state) => ({
      towerFormDataRera: [...state.towerFormDataRera, { ...newDetails }],
    }));
  },

  addEtlUnitConfigRera: (towerId, configName, minArea, maxArea) => {
    set((state) => ({
      towerFormDataRera: state.towerFormDataRera.map((data) =>
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
  updateEtlUnitConfigRera: (towerId, configName, minArea, maxArea) => {
    set((state) => ({
      towerFormDataRera: state.towerFormDataRera.map((data) =>
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

  deleteEtlUnitConfigRera: (towerId, configName) => {
    set((state) => ({
      towerFormDataRera: state.towerFormDataRera.map((data) =>
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
  resetTowerFormDataRera: () => {
    set({ towerFormDataRera: initialState });
  },
}));

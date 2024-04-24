import { create } from 'zustand';
import { SingleValue } from 'react-select';

interface etlUnitConfigRera {
  configName: string;
  minArea: number;
  maxArea: number;
}

interface towerDetailRera {
  id: number;
  projectPhase: number;
  reraId: string;
  towerId: string;
  towerType: SingleValue<{
    label: string;
    value: string;
  }>;
  towerTypeSuggestion: string;
  towerName: string;
  etlUnitConfigs: etlUnitConfigRera[];
}

interface FormState {
  towerFormDataRera: towerDetailRera[];
  setTowersDataRera: (data: towerDetailRera[]) => void;
  updateTowerFormDataRera: (
    id: number,
    key: keyof towerDetailRera,
    value: any
  ) => void;
  addNewTowerDataRera: (newDetails: towerDetailRera) => void;
  deleteTowerFormDataRera: (towerId: number) => void;
  addEtlUnitConfigRera: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  updateEtlUnitConfigRera: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  deleteEtlUnitConfigRera: (towerId: number, configName: string) => void;
  resetTowerFormDataRera: () => void;
}

const initialState: towerDetailRera[] = [
  {
    id: 1,
    projectPhase: 1,
    reraId: '',
    towerId: '',
    towerType: {
      label: '',
      value: '',
    },
    towerTypeSuggestion: '',
    towerName: '',
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

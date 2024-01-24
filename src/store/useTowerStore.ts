import { create } from 'zustand';
import { SingleValue } from 'react-select';

interface etlUnitConfig {
  configName: string;
  minArea: number;
  maxArea: number;
}

interface towerDetail {
  id: number;
  projectPhase: number;
  reraId: string;
  towerType: SingleValue<{
    label: string;
    value: string;
  }>;
  towerName: string;
  etlUnitConfigs: etlUnitConfig[];
}

interface FormState {
  towerFormData: towerDetail[];
  updateTowerFormData: (id: number, key: keyof towerDetail, value: any) => void;
  addNewTowerData: (newDetails: towerDetail) => void;
  deleteTowerFormData: (towerId: number) => void;
  addEtlUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  deleteEtlUnitConfig: (towerId: number, configName: string) => void;
}

export const useTowerStore = create<FormState>((set) => ({
  // Initial state
  towerFormData: [
    {
      id: 1,
      projectPhase: 1,
      reraId: '',
      towerType: {
        label: '',
        value: '',
      },
      towerName: '',
      etlUnitConfigs: [{ configName: '', minArea: 0, maxArea: 0 }],
    },
  ],

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
}));

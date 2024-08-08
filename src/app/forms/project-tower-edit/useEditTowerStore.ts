import { FormTowerDetailType } from '@/types/types';
import { create } from 'zustand';

export interface editTowerDetail extends FormTowerDetailType {
  towerId: number | '__new';
  towerType: string;
}

interface FormState {
  editTowerFormData: editTowerDetail[];
  oldTowerFormData: editTowerDetail[];
  setNewTowerEditData: (_data: editTowerDetail[]) => void;
  setOldTowerEditData: (_data: editTowerDetail[]) => void;
  updateEditTowerFormData: (
    _id: number,
    _key: keyof editTowerDetail,
    _value: any
  ) => void;
  addNewEditTowerData: (_newDetails: editTowerDetail) => void;
  deleteEditTowerFormData: (_towerId: number) => void;
  addEtlUnitConfig: (
    _towerId: number,
    _configName: string,
    _minArea: number,
    _maxArea: number
  ) => void;
  updateEtlUnitConfig: (
    _towerId: number,
    _configName: string,
    _minArea: number,
    _maxArea: number
  ) => void;
  deleteEtlUnitConfig: (_towerId: number, _configName: string) => void;
  resetEditTowerFormData: () => void;
}

const initialState: editTowerDetail[] = [
  {
    id: 1,
    towerId: '__new',
    projectPhase: 1,
    reraId: '',
    towerType: '',
    etlTowerName: '',
    towerNameAlias: '',
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

export const useEditTowerStore = create<FormState>((set) => ({
  // Initial state
  editTowerFormData: initialState,
  oldTowerFormData: initialState,

  setNewTowerEditData: (data) => {
    set(() => ({
      editTowerFormData: data,
    }));
  },
  setOldTowerEditData: (data) => {
    set(() => ({
      oldTowerFormData: data,
    }));
  },

  // Update functions
  updateEditTowerFormData: (id, key, value) => {
    set((state) => ({
      editTowerFormData: state.editTowerFormData.map((data) =>
        data.id === id ? { ...data, [key]: value } : data
      ),
    }));
  },
  deleteEditTowerFormData: (towerId) => {
    set((state) => ({
      editTowerFormData: state.editTowerFormData.filter(
        (data) => data.id !== towerId
      ),
    }));
  },

  addNewEditTowerData: (newDetails) => {
    set((state) => ({
      editTowerFormData: [...state.editTowerFormData, { ...newDetails }],
    }));
  },

  addEtlUnitConfig: (towerId, configName, minArea, maxArea) => {
    set((state) => ({
      editTowerFormData: state.editTowerFormData.map((data) =>
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
      editTowerFormData: state.editTowerFormData.map((data) =>
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
      editTowerFormData: state.editTowerFormData.map((data) =>
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
  resetEditTowerFormData: () => {
    set({ editTowerFormData: initialState, oldTowerFormData: initialState });
  },
}));

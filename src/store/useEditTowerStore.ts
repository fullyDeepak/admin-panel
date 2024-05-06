import { create } from 'zustand';

interface etlUnitConfig {
  configName: string;
  minArea: number;
  maxArea: number;
}

export interface editTowerDetail {
  id: number;
  towerId: number | '__new';
  projectPhase: number;
  reraId: string;
  towerType: string;
  towerName: string;
  towerDoorNo: string;
  singleUnit: boolean;
  towerPattern: string;
  floorPattern: string;
  unitPattern: string;
  minFloor: number;
  maxFloor: number;
  groundFloorName: string;
  groundFloorUnitNoMin: number | string;
  groundFloorUnitNoMax: number | string;
  typicalFloorUnitNoMin: number | string;
  typicalFloorUnitNoMax: number | string;
  deleteFullUnitNos: string;
  exceptionUnitNos: string;
  etlUnitConfigs: etlUnitConfig[];
  validTowerUnits: string[][] | null;
}

interface FormState {
  editTowerFormData: editTowerDetail[];
  oldTowerFormData: editTowerDetail[];
  setNewTowerEditData: (data: editTowerDetail[]) => void;
  setOldTowerEditData: (data: editTowerDetail[]) => void;
  updateEditTowerFormData: (
    id: number,
    key: keyof editTowerDetail,
    value: any
  ) => void;
  addNewEditTowerData: (newDetails: editTowerDetail) => void;
  deleteEditTowerFormData: (towerId: number) => void;
  addEtlUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  deleteEtlUnitConfig: (towerId: number, configName: string) => void;
  resetEditTowerFormData: () => void;
}

const initialState: editTowerDetail[] = [
  {
    id: 1,
    towerId: '__new',
    projectPhase: 1,
    reraId: '',
    towerType: '',
    towerName: '',
    singleUnit: false,
    towerDoorNo: '',
    towerPattern: '',
    floorPattern: '',
    unitPattern: '',
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
    set({ editTowerFormData: initialState });
  },
}));

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { uniqBy } from 'lodash';
import { FormEtlUnitConfigType } from '@/types/types';

export type TowerDetailType = {
  id: number;
  towerId?: number;
  projectPhase: number;
  reraId: string;
  towerType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  displayTowerType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  reraTowerId: string;
  singleUnit: boolean;
  towerNameDisplay: string;
  towerNameETL: string;
  towerDoorNoString: string;
  etlUnitConfigs: FormEtlUnitConfigType[];
  gfName: string;
};

const INITIAL_STATE: TowerDetailType[] = [
  {
    id: 1,
    projectPhase: 1,
    reraId: '',
    towerType: { label: 'Apartment', value: 'apartment' },
    singleUnit: false,
    displayTowerType: { label: 'APARTMENT', value: 'APARTMENT' },
    reraTowerId: '',
    towerNameETL: '',
    towerNameDisplay: '',
    towerDoorNoString: '',
    etlUnitConfigs: [],
    gfName: '',
  },
];

type Store = {
  towerFormData: TowerDetailType[];
  projectPricingStatus: {
    updated_at: string;
    tower_id: string;
    updated_field: 'price';
    updated_value: string;
  }[];
  projectBookingStatus: {
    updated_at: string;
    tower_id: string;
    updated_field: 'manual_bookings';
    updated_value: string;
  }[];
  projectConstructionStatus: {
    updated_at: string;
    tower_id: string;
    updated_field: 'display_construction_status';
    updated_value: string;
  }[];
  existingUnitTypeOption: SingleValue<{
    label: string;
    value: string;
  }>[];
  setExistingUnitTypeOption: (
    _data: SingleValue<{
      label: string;
      value: string;
    }>[]
  ) => void;
  updateTowerFormData: (
    _towerCardId: number,
    _newDetails: Partial<TowerDetailType>
  ) => void;
  addNewTowerCard: () => void;
  duplicateTowerCard: (_towerCardId: number) => void;
  setTowerFormData: (_data: TowerDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  resetTowerUnitStore: () => void;
  updateProjectStatus: (
    _key: 'booking' | 'pricing' | 'display_construction_status',
    _newData: {
      updated_at: string;
      tower_id: string;
      updated_value: string;
      updated_field:
        | 'manual_bookings'
        | 'price'
        | 'display_construction_status';
    }[]
  ) => void;
  deleteProjectStatusData: (
    _key: 'booking' | 'pricing' | 'display_construction_status',
    _tower_id: string
  ) => void;
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
  deleteEtlUnitConfig: (
    _towerId: number,
    _config: FormEtlUnitConfigType
  ) => void;
};

export const useTowerUnitStore = create<Store>()(
  immer((set) => ({
    towerFormData: INITIAL_STATE,
    projectBookingStatus: [] as Store['projectBookingStatus'],
    projectPricingStatus: [] as Store['projectPricingStatus'],
    projectConstructionStatus: [] as Store['projectConstructionStatus'],

    existingUnitTypeOption: [] as SingleValue<{
      label: string;
      value: string;
    }>[],
    setExistingUnitTypeOption: (data) => set({ existingUnitTypeOption: data }),
    updateTowerFormData: (id, newDetails) =>
      set((prev) => {
        const idx = prev.towerFormData.findIndex((data) => data.id === id);
        if (idx !== -1) {
          prev.towerFormData[idx] = {
            ...prev.towerFormData[idx],
            ...newDetails,
          };
        }
      }),

    addNewTowerCard: () =>
      set((prev) => {
        prev.towerFormData.push({
          id: prev.towerFormData.length + 1,
          projectPhase: 1,
          reraId: '',
          singleUnit: false,
          towerType: null,
          displayTowerType: null,
          reraTowerId: '',
          towerNameDisplay: '',
          towerNameETL: '',
          towerDoorNoString: '',
          etlUnitConfigs: [],
          gfName: '',
        });
      }),

    duplicateTowerCard: (towerCardId) =>
      set((prev) => {
        const tower = prev.towerFormData.find(
          (data) => data.id === towerCardId
        );
        if (tower) {
          const newTowerCard = {
            ...tower,
            id: Math.max(...prev.towerFormData.map((data) => data.id)) + 1,
          };
          prev.towerFormData.push(newTowerCard);
        }
      }),
    deleteTowerCard: (id) =>
      set((prev) => {
        prev.towerFormData = prev.towerFormData.filter(
          (data) => data.id !== id
        );
      }),
    setTowerFormData: (data) => set({ towerFormData: data }),

    resetTowerUnitStore: () =>
      set({
        towerFormData: INITIAL_STATE,
        existingUnitTypeOption: [],
      }),
    updateProjectStatus: (key, newData) => {
      if (key === 'booking') {
        set((state) => ({
          projectBookingStatus: uniqBy(
            [
              ...state.projectBookingStatus,
              ...(newData as Store['projectBookingStatus']),
            ],
            'tower_id'
          ),
        }));
      } else if (key === 'pricing') {
        set((state) => ({
          projectPricingStatus: uniqBy(
            [
              ...state.projectPricingStatus,
              ...(newData as Store['projectPricingStatus']),
            ],
            'tower_id'
          ),
        }));
      } else if (key === 'display_construction_status') {
        set((state) => ({
          projectConstructionStatus: uniqBy(
            [
              ...state.projectConstructionStatus,
              ...(newData as Store['projectConstructionStatus']),
            ],
            'tower_id'
          ),
        }));
      }
    },
    deleteProjectStatusData: (key, tower_id) => {
      if (key === 'booking') {
        set((state) => ({
          projectBookingStatus: state.projectBookingStatus.filter(
            (item) => item.tower_id != tower_id
          ),
        }));
      } else if (key === 'pricing') {
        set((state) => ({
          projectPricingStatus: state.projectPricingStatus.filter(
            (item) => item.tower_id != tower_id
          ),
        }));
      } else if (key === 'display_construction_status') {
        set((state) => ({
          projectConstructionStatus: state.projectConstructionStatus.filter(
            (item) => item.tower_id != tower_id
          ),
        }));
      }
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
                        minArea,
                        maxArea,
                      }
                    : unit
                ),
              }
            : data
        ),
      }));
    },

    deleteEtlUnitConfig: (towerId, config) => {
      set((state) => ({
        towerFormData: state.towerFormData.map((data) =>
          data.id === towerId
            ? {
                ...data,
                etlUnitConfigs: data.etlUnitConfigs.filter(
                  (unit) =>
                    !(
                      unit.configName === config.configName &&
                      unit.maxArea === config.maxArea &&
                      unit.minArea === config.minArea
                    )
                ),
              }
            : data
        ),
      }));
    },
  }))
);

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { uniqBy } from 'lodash';
import { FormEtlUnitConfigType } from '@/types/types';

export type TowerUnitDetailType = {
  id: number;
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
  unitCards: UnitCardType[];
  etlUnitConfigs: FormEtlUnitConfigType[];
};

export type UnitCardType = {
  id: number;
  reraUnitType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  existingUnitType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  floorNos: string;
  salableAreaMin: number;
  salableAreaMax: number;
  extentMin: number;
  extentMax: number;
  facing: string | null;
  corner: boolean;
  configName: string | null;
  configVerified: boolean;
  unitFloorCount: string | null;
  unitNos: string;
};

const INITIAL_STATE: TowerUnitDetailType[] = [
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
    unitCards: [
      {
        id: 1,
        reraUnitType: null,
        existingUnitType: null,
        floorNos: '',
        salableAreaMin: 0,
        salableAreaMax: 0,
        extentMin: 0,
        extentMax: 0,
        facing: null,
        corner: false,
        configName: null,
        configVerified: true,
        unitFloorCount: null,
        unitNos: '',
      },
    ],
    etlUnitConfigs: [],
  },
];
export type HmRefTable = {
  tower_name: string;
  freq: number;
  unit_numbers: string;
};

export type TMRefTable = {
  apt_name: string;
  unit_type: string;
  freq: string;
  floors: string;
  unit_numbers: string;
};
type Store = {
  towerFormData: TowerUnitDetailType[];
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
  hmRefTable: HmRefTable[];
  tmRefTable: TMRefTable[];
  showHMRefTable: boolean;
  showTMRefTable: boolean;
  toggleRefTable: (_key: 'hm' | 'tm') => void;
  updateHMRefTable: (_data: HmRefTable[]) => void;
  updateTMRefTable: (_data: TMRefTable[]) => void;
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
    _newDetails: Partial<TowerUnitDetailType>
  ) => void;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  addNewTowerCard: () => void;
  duplicateTowerCard: (_towerCardId: number) => void;
  setTowerFormData: (_data: TowerUnitDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
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
  deleteEtlUnitConfig: (_towerId: number, _configName: string) => void;
};

export const useTowerUnitStore = create<Store>()(
  immer((set) => ({
    towerFormData: INITIAL_STATE,
    projectBookingStatus: [] as Store['projectBookingStatus'],
    projectPricingStatus: [] as Store['projectPricingStatus'],
    projectConstructionStatus: [] as Store['projectConstructionStatus'],
    hmRefTable: [] as HmRefTable[],
    tmRefTable: [] as TMRefTable[],
    showHMRefTable: true as boolean,
    showTMRefTable: true as boolean,
    toggleRefTable: (key) =>
      set((prev) => {
        if (key === 'hm') {
          prev.showHMRefTable = !prev.showHMRefTable;
        } else if (key === 'tm') {
          prev.showTMRefTable = !prev.showTMRefTable;
        }
      }),
    updateHMRefTable: (data) => set({ hmRefTable: data }),
    existingUnitTypeOption: [] as SingleValue<{
      label: string;
      value: string;
    }>[],
    updateTMRefTable: (data) => set({ tmRefTable: data }),
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
          unitCards: [],
          etlUnitConfigs: [],
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
    updateUnitCard: (towerCardId, unitCardId, newDetails) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.id === towerCardId
        );
        if (towerIdx !== -1) {
          const unitCardIdx = prev.towerFormData[towerIdx].unitCards.findIndex(
            (unitCard) => unitCard.id === unitCardId
          );
          if (unitCardIdx !== -1) {
            prev.towerFormData[towerIdx].unitCards[unitCardIdx] = {
              ...prev.towerFormData[towerIdx].unitCards[unitCardIdx],
              ...newDetails,
            };
          }
        }
      }),

    copyUnitCard: (towerCardId, newDetails) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.id === towerCardId
        );
        if (towerIdx !== -1) {
          prev.towerFormData[towerIdx].unitCards.push({
            ...newDetails,
          });
        }
      }),

    addNewUnitCard: (towerCardId) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.id === towerCardId
        );
        if (towerIdx !== -1) {
          prev.towerFormData[towerIdx].unitCards.push({
            id: prev.towerFormData[towerIdx].unitCards.length + 1,
            reraUnitType: null,
            existingUnitType: null,
            floorNos: '',
            salableAreaMin: 0,
            salableAreaMax: 0,
            extentMin: 0,
            extentMax: 0,
            facing: '',
            corner: false,
            configName: null,
            configVerified: true,
            unitFloorCount: null,
            unitNos: '',
          });
        }
      }),

    deleteUnitCard: (towerCardId, unitCardId) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.id === towerCardId
        );
        if (towerIdx !== -1) {
          const unitCardIdx = prev.towerFormData[towerIdx].unitCards.findIndex(
            (unitCard) => unitCard.id === unitCardId
          );
          if (unitCardIdx !== -1) {
            prev.towerFormData[towerIdx].unitCards = prev.towerFormData[
              towerIdx
            ].unitCards.filter((unitCard) => unitCard.id !== unitCardId);
          }
        }
      }),

    resetTowerUnitStore: () =>
      set({
        towerFormData: INITIAL_STATE,
        hmRefTable: [],
        tmRefTable: [],
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

    deleteEtlUnitConfig: (towerId, configName) => {
      set((state) => ({
        towerFormData: state.towerFormData.map((data) =>
          data.id === towerId
            ? {
                ...data,
                etlUnitConfigs: data.etlUnitConfigs.filter(
                  (unit) => unit.configName !== configName
                ),
              }
            : data
        ),
      }));
    },
  }))
);

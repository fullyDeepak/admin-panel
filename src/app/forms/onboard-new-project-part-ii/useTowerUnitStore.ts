import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { uniqBy } from 'lodash';

export type RefTableType = {
  type: string;
  unitCount: string;
  config: string;
  salableArea: string;
  facing: string;
  floorList: string;
  unitList: string;
};

export type TowerUnitDetailType = {
  tower_id: number;
  reraId: string;
  reraTowerId: string;
  towerFloorPlanFile: { name: string; file: File }[];
  towerNameDisplay: string;
  towerNameETL: string;
  towerType: string;
  maxFloor: number;
  typicalMaxUN: string;
  typicalMinUN: string;
  gfName: string;
  gfUnitMaxUN: string;
  gfUnitMinUN: string;
  dbMaxFloor: string;
  dbGfName: string;
  dbGfMin: string;
  dbGfMax: string;
  dbTypicalMin: string;
  dbTypicalMax: string;
  unitCards: UnitCardType[];
  reraRefTable: RefTableType[];
  tmRefTable: (RefTableType & { extent: string })[];
  reraUnitTypeOption: {
    label: string;
    value: string;
  }[];
};

export type UnitCardType = {
  id: number;
  reraUnitType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  tmUnitType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  floorNos: string;
  salableArea: number;
  extent: number;
  parking: number;
  facing: string | null;
  corner: boolean;
  configName: string | null;
  toiletConfig: string | null;
  otherConfig: string | null;
  configVerified: boolean;
  unitFloorCount: string | null;
  unitNos: string;
  doorNoOverride: string;
  unitFloorPlanFile: { name: string; file: File } | null;
  s3_path: string;
};

const INITIAL_STATE: TowerUnitDetailType[] = [
  {
    tower_id: 1,
    towerFloorPlanFile: [],
    reraId: '',
    reraTowerId: '',
    towerNameETL: '',
    towerNameDisplay: '',
    towerType: '',
    maxFloor: 0,
    typicalMaxUN: '',
    typicalMinUN: '',
    gfName: '',
    gfUnitMaxUN: '',
    gfUnitMinUN: '',
    dbMaxFloor: '',
    dbGfName: '',
    dbGfMin: '',
    dbGfMax: '',
    dbTypicalMin: '',
    dbTypicalMax: '',
    unitCards: [
      {
        id: 1,
        reraUnitType: null,
        floorNos: '',
        salableArea: 0,
        extent: 0,
        parking: 0,
        facing: null,
        corner: false,
        configName: null,
        configVerified: true,
        unitFloorCount: null,
        unitNos: '',
        otherConfig: null,
        toiletConfig: null,
        tmUnitType: null,
        doorNoOverride: '',
        unitFloorPlanFile: null,
        s3_path: '',
      },
    ],
    reraRefTable: [],
    tmRefTable: [],
    reraUnitTypeOption: [],
  },
];

type Store = {
  towerFormData: TowerUnitDetailType[];
  existingUnitTypeOption: SingleValue<{
    label: string;
    value: string;
  }>[];
  showTMRefTable: boolean;
  setShowTMRefTable: (_data: boolean) => void;
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
  projectPricingStatus: {
    updated_at: string;
    project_id: string;
    tower_id: string;
    updated_field: 'price';
    updated_value: string;
  }[];
  projectBookingStatus: {
    updated_at: string;
    project_id: string;
    tower_id: string;
    updated_field: 'manual_bookings';
    updated_value: string;
  }[];
  projectConstructionStatus: {
    updated_at: string;
    project_id: string;
    tower_id: string;
    updated_field: 'display_construction_status';
    updated_value: string;
  }[];
  lockUnitType: boolean;
  existingStatusData: {
    project_id: string;
    tower_id: string;
    updated_at: string;
    updated_field: string;
    updated_value: string;
  }[];
  setTowerFormData: (_data: TowerUnitDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
  resetTowerUnitStore: () => void;
  setTowerFloorPlanFile: (
    _towerCardId: number,
    imageData: { name: string; file: File }
  ) => void;
  removeTowerFloorPlanFile: (_towerCardId: number, fileName: string) => void;
  updateProjectStatus: (
    _key: 'booking' | 'pricing' | 'display_construction_status',
    _newData: {
      updated_at: string;
      project_id: string;
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
  resetStatusFormData: () => void;
  setLockUnitType: (_data: boolean) => void;
  setExistingStatusData: (_data: Store['existingStatusData']) => void;
};

export const useTowerUnitStore = create<Store>()(
  immer((set) => ({
    towerFormData: INITIAL_STATE,
    showTMRefTable: false as boolean,
    setShowTMRefTable: (data) => set({ showTMRefTable: data }),
    existingUnitTypeOption: [] as SingleValue<{
      label: string;
      value: string;
    }>[],
    setExistingUnitTypeOption: (data) => set({ existingUnitTypeOption: data }),

    projectBookingStatus: [] as Store['projectBookingStatus'],
    projectPricingStatus: [] as Store['projectPricingStatus'],
    projectConstructionStatus: [] as Store['projectConstructionStatus'],

    existingStatusData: [] as Store['existingStatusData'],

    lockUnitType: false as boolean,

    updateTowerFormData: (id, newDetails) =>
      set((prev) => {
        const idx = prev.towerFormData.findIndex(
          (data) => data.tower_id === id
        );
        if (idx !== -1) {
          prev.towerFormData[idx] = {
            ...prev.towerFormData[idx],
            ...newDetails,
          };
        }
      }),
    deleteTowerCard: (id) =>
      set((prev) => {
        prev.towerFormData = prev.towerFormData.filter(
          (data) => data.tower_id !== id
        );
      }),
    setTowerFormData: (data) => set({ towerFormData: data }),
    updateUnitCard: (towerCardId, unitCardId, newDetails) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.tower_id === towerCardId
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
          (data) => data.tower_id === towerCardId
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
          (data) => data.tower_id === towerCardId
        );
        if (towerIdx !== -1) {
          prev.towerFormData[towerIdx].unitCards.push({
            id: prev.towerFormData[towerIdx].unitCards.length + 1,
            reraUnitType: null,
            floorNos: '',
            salableArea: 0,
            extent: 0,
            parking: 0,
            facing: '',
            corner: false,
            configName: null,
            configVerified: true,
            unitFloorCount: null,
            unitNos: '',
            otherConfig: null,
            toiletConfig: null,
            tmUnitType: null,
            doorNoOverride: '',
            unitFloorPlanFile: null,
            s3_path: '',
          });
        }
      }),
    deleteUnitCard: (towerCardId, unitCardId) =>
      set((prev) => {
        const towerIdx = prev.towerFormData.findIndex(
          (data) => data.tower_id === towerCardId
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
        existingUnitTypeOption: [],
      }),

    setTowerFloorPlanFile: (towerCardId, imageData) => {
      set((prev) => {
        const towerDataIdx = prev.towerFormData.findIndex(
          (tower) => tower.tower_id === towerCardId
        );
        if (towerDataIdx === -1) return;
        prev.towerFormData[towerDataIdx].towerFloorPlanFile = [
          ...prev.towerFormData[towerDataIdx].towerFloorPlanFile,
          imageData,
        ];
      });
    },

    removeTowerFloorPlanFile: (towerCardId, fileName) => {
      set((prev) => {
        const towerDataIdx = prev.towerFormData.findIndex(
          (tower) => tower.tower_id === towerCardId
        );
        if (towerDataIdx === -1) return;
        prev.towerFormData[towerDataIdx].towerFloorPlanFile =
          prev.towerFormData[towerDataIdx].towerFloorPlanFile.filter(
            (item) => item.name !== fileName
          );
      });
    },

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

    resetStatusFormData: () =>
      set({
        projectBookingStatus: [],
        projectPricingStatus: [],
        projectConstructionStatus: [],
      }),

    setLockUnitType: (_data) => set({ lockUnitType: _data }),

    setExistingStatusData: (data) => set({ existingStatusData: data }),
  }))
);

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

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
  towerFloorPlanFile: { fileName: string; file: File }[];
  towerNameDisplay: string;
  towerNameETL: string;
  towerType: string;
  typicalMaxFloor: number;
  typicalUnitCount: string;
  gfName: string;
  gfUnitCount: string;
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
    typicalMaxFloor: 0,
    typicalUnitCount: '',
    gfName: '',
    gfUnitCount: '',
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
  setTowerFormData: (_data: TowerUnitDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
  resetTowerUnitStore: () => void;
  setTowerFloorPlanFile: (
    _towerCardId: number,
    imageData: { fileName: string; file: File }
  ) => void;
  removeTowerFloorPlanFile: (_towerCardId: number, fileName: string) => void;
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
        prev.towerFormData[towerDataIdx].towerFloorPlanFile =
          prev.towerFormData[towerDataIdx].towerFloorPlanFile.filter(
            (item) => item.fileName !== fileName
          );
      });
    },
  }))
);

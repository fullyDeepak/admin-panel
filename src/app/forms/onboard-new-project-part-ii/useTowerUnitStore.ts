import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

export type RefTableType = {
  type: string;
  towerId: string;
  unitCount: string;
  config: string;
  salableArea: string;
  facing: string;
  floorList: string;
};

export type TowerUnitDetailType = {
  id: number;
  reraId: string;
  reraTowerId: string;
  towerNameDisplay: string;
  towerNameETL: string;
  typicalMaxFloor: number;
  typicalUnitCount: string;
  gfName: string;
  gfUnitCount: string;
  unitCards: UnitCardType[];
  reraRefTable: RefTableType[];
  tmRefTable: RefTableType[];
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
  toiletConfig: string | null;
  maidConfig: string | null;
  configVerified: boolean;
  unitFloorCount: string | null;
  unitNos: string;
};

const INITIAL_STATE: TowerUnitDetailType[] = [
  {
    id: 1,
    reraId: '',
    reraTowerId: '',
    towerNameETL: '',
    towerNameDisplay: '',
    typicalMaxFloor: 0,
    typicalUnitCount: '',
    gfName: '',
    gfUnitCount: '',
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
        maidConfig: null,
        toiletConfig: null,
        tmUnitType: null,
      },
    ],
    reraRefTable: [],
    tmRefTable: [],
  },
];

type Store = {
  towerFormData: TowerUnitDetailType[];
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
  setTowerFormData: (_data: TowerUnitDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
  resetTowerUnitStore: () => void;
};

export const useTowerUnitStore = create<Store>()(
  immer((set) => ({
    towerFormData: INITIAL_STATE,
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
            maidConfig: null,
            toiletConfig: null,
            tmUnitType: null,
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
        existingUnitTypeOption: [],
      }),
  }))
);

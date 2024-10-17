import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

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
  towerFloorName: string;
  salableAreaMin: number;
  salableAreaMax: number;
  extentMin: number;
  extentMax: number;
  facing: string | null;
  corner: boolean;
  configName: SingleValue<{
    label: string;
    value: string;
  }> | null;
  configVerified: boolean;
  unitFloorCount: number;
  unitNos: string;
};

const INITIAL_STATE: TowerUnitDetailType[] = [
  {
    id: 1,
    projectPhase: 1,
    reraId: '',
    towerType: null,
    singleUnit: false,
    displayTowerType: null,
    reraTowerId: '',
    towerNameETL: '',
    towerNameDisplay: '',
    towerDoorNoString: '',
    unitCards: [
      {
        id: 1,
        reraUnitType: null,
        existingUnitType: null,
        towerFloorName: '',
        salableAreaMin: 0,
        salableAreaMax: 0,
        extentMin: 0,
        extentMax: 0,
        facing: null,
        corner: false,
        configName: null,
        configVerified: true,
        unitFloorCount: 0,
        unitNos: '',
      },
    ],
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
  addNewTowerCard: () => void;
  setTowerFormData: (_data: TowerUnitDetailType[]) => void;
  deleteTowerCard: (_id: number) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
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
        });
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
            towerFloorName: '',
            salableAreaMin: 0,
            salableAreaMax: 0,
            extentMin: 0,
            extentMax: 0,
            facing: '',
            corner: false,
            configName: null,
            configVerified: true,
            unitFloorCount: 0,
            unitNos: '',
          });
        }
      }),
    deleteUnitCard: (towerCardId, unitCardId) =>
      set((prev) => {
        prev.towerFormData.forEach((data) => {
          if (data.id === towerCardId) {
            prev.towerFormData[towerCardId].unitCards = prev.towerFormData[
              towerCardId
            ].unitCards.filter((unitCard) => unitCard.id !== unitCardId);
          }
        });
      }),
  }))
);

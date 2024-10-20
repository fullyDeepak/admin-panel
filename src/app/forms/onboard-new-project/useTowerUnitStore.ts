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
};

export const useTowerUnitStore = create<Store>()(
  immer((set) => ({
    towerFormData: INITIAL_STATE,
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
  }))
);

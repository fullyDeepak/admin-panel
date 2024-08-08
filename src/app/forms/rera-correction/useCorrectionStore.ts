import { ReraDMLVTableData } from '@/types/types';
import { produce } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type SroResponse = {
  district_id: number;
  district_name: string;
  mandal_id: number;
  mandal_name: string;
  village_id: number;
  village_name: string;
};

type CorrectionStoreState = {
  selectedSroDistrict: {
    label: string;
    value: number;
  } | null;
  selectedReraDistrict: {
    label: string;
    value: number;
  } | null;
  selectedSroMandal: {
    label: string;
    value: number;
  } | null;
  selectedReraMandal: {
    label: string;
    value: string;
  } | null;
  selectedReraRawMandal: {
    label: string;
    value: string;
  } | null;
  selectedReraVillage: {
    label: string;
    value: string;
  } | null;
  selectedReraRawVillage: {
    label: string;
    value: string;
  } | null;
  selectedReraLocality: {
    label: string;
    value: string;
  } | null;
  reraTableData: ReraDMLVTableData[] | null;
  sroTableData: SroResponse[] | null;
  districtIdValue: string | undefined;
  mandalIdValue: string | undefined;
  villageIdValue: string | undefined;
};

type CorrectionStore = {
  state: CorrectionStoreState;
  setFormData: <K extends keyof CorrectionStoreState>(
    _name: K,
    _value: CorrectionStoreState[K]
  ) => void;
  resetAll: () => void;
};

const INITIAL_STATE: CorrectionStoreState = {
  selectedSroDistrict: null,
  selectedReraDistrict: null,
  selectedSroMandal: null,
  selectedReraMandal: null,
  selectedReraRawMandal: null,
  selectedReraVillage: null,
  selectedReraRawVillage: null,
  selectedReraLocality: null,
  reraTableData: null,
  sroTableData: null,
  districtIdValue: undefined,
  mandalIdValue: undefined,
  villageIdValue: undefined,
};

export const useCorrectionStore = create<CorrectionStore>()(
  immer((set) => ({
    state: INITIAL_STATE,
    setFormData: <K extends keyof CorrectionStoreState>(
      name: K,
      value: CorrectionStoreState[K]
    ) => {
      set((state) =>
        produce(state, (draft) => {
          draft.state[name] = value;
        })
      );
    },
    resetAll: () => {
      set({ state: INITIAL_STATE });
    },
  }))
);

export const useCorrectionStoreActions = () =>
  useCorrectionStore.getState().setFormData;

export const useCorrectionStoreState = () =>
  useCorrectionStore.getState().state;

export const useCorrectionStoreReset = () =>
  useCorrectionStore.getState().resetAll;

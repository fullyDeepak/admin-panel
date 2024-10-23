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
  correctionData: CorrectionStoreState;
  selectedTableRows: ReraDMLVTableData[];
  setSelectedTableRows: (_data: ReraDMLVTableData[]) => void;
  updateSelectedTableRows: (
    _projectId: number,
    _data: Partial<ReraDMLVTableData>
  ) => void;
  updateCorrectionFormData: <K extends keyof CorrectionStoreState>(
    _name: K,
    _value: CorrectionStoreState[K]
  ) => void;
  resetAll: () => void;
  updateCurrentTableData: (
    _projectId: number,
    _data: Partial<ReraDMLVTableData>
  ) => void;
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
    correctionData: INITIAL_STATE,
    selectedTableRows: [] as ReraDMLVTableData[],
    setSelectedTableRows: (data) => set({ selectedTableRows: data }),
    updateSelectedTableRows: (pid, data) => {
      set((prev) => {
        if (prev.selectedTableRows) {
          const idx = prev.selectedTableRows?.findIndex(
            (ele) => ele.id === pid
          );
          if (idx >= -1) {
            prev.selectedTableRows[idx] = {
              ...prev.selectedTableRows[idx],
              ...data,
            };
          }
        }
      });
    },
    updateCorrectionFormData: <K extends keyof CorrectionStoreState>(
      name: K,
      value: CorrectionStoreState[K]
    ) => {
      set((state) =>
        produce(state, (draft) => {
          draft.correctionData[name] = value;
        })
      );
    },
    updateCurrentTableData: (pid, data) => {
      set((prev) => {
        if (prev.correctionData.reraTableData) {
          const idx = prev.correctionData.reraTableData?.findIndex(
            (ele) => ele.id === pid
          );
          if (idx >= -1) {
            prev.correctionData.reraTableData[idx] = {
              ...prev.correctionData.reraTableData[idx],
              ...data,
            };
          }
        }
      });
    },
    resetAll: () => {
      set({ correctionData: INITIAL_STATE });
    },
  }))
);

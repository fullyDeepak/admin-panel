import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type VillageProjectCleanerState = {
  dmvOptions: {
    district: {
      label: string;
      value: number;
    }[];
    mandal: {
      label: string;
      value: number;
    }[];
    village: {
      label: string;
      value: number;
    }[];
  };
  selectedDMV: {
    district: { label: string; value: number } | null;
    mandal: { label: string; value: number } | null;
    village: { label: string; value: number } | null;
  };
};

type VillageProjectCleanerActions = {
  setDMVOptions: (
    _key: keyof VillageProjectCleanerState['dmvOptions'],
    _value: {
      label: string;
      value: number;
    }[]
  ) => void;
  setSelectedDMV: (
    _key: keyof VillageProjectCleanerState['selectedDMV'],
    _value: { label: string; value: number } | null
  ) => void;
};

const INITIAL_STATE: VillageProjectCleanerState = {
  dmvOptions: {
    district: [],
    mandal: [],
    village: [],
  },
  selectedDMV: {
    district: null,
    mandal: null,
    village: null,
  },
};

export const useVillageProjectCleanerStore = create<
  VillageProjectCleanerState & VillageProjectCleanerActions
>()(
  immer((set) => ({
    ...INITIAL_STATE,
    setDMVOptions: (key, value) =>
      set((prev) => {
        if (key === 'district') {
          prev.dmvOptions.district = value;
        } else if (key === 'mandal') {
          prev.dmvOptions.mandal = value;
        } else if (key === 'village') {
          prev.dmvOptions.village = value;
        }
      }),
    setSelectedDMV: (key, value) =>
      set((prev) => {
        if (key === 'district') {
          prev.selectedDMV.district = value;
        } else if (key === 'mandal') {
          prev.selectedDMV.mandal = value;
        } else if (key === 'village') {
          prev.selectedDMV.village = value;
        }
      }),
  }))
);

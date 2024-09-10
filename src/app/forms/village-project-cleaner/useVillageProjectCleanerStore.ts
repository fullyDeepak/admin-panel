import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ProjectCordWithinVillage } from './MapUI';

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
  cleanAptName: string | null;
  mapData: ProjectCordWithinVillage['data'] | null;
  selectedMapProject: ProjectCordWithinVillage['data'][0] | null;
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
  setCleanAptName: (_value: string | null) => void;
  setMapData: (_data: ProjectCordWithinVillage['data'] | null) => void;
  setSelectedMapProject: (
    _data: ProjectCordWithinVillage['data'][0] | null
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
  cleanAptName: null,
  mapData: null,
  selectedMapProject: null,
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
    setCleanAptName: (value) =>
      set((prev) => {
        prev.cleanAptName = value;
      }),
    setMapData: (data) =>
      set((prev) => {
        prev.mapData = data;
      }),
    setSelectedMapProject: (data) =>
      set((prev) => {
        prev.selectedMapProject = data;
      }),
  }))
);

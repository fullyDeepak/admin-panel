import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ProjectCordWithinVillage } from './MapUI';
import axiosClient from '@/utils/AxiosClient';
import toast from 'react-hot-toast';

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
  attachedMapData: Record<
    string,
    {
      village_id: number | undefined;
      place_id: string | undefined;
      full_address: string | undefined;
      pincode: string | undefined;
      lng: number | undefined;
      lat: number | undefined;
    }
  >;
  selectedCleanProjectId: string;
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
  setAttachedMapData: (
    _key: string | 0,
    _data: {
      village_id: number | undefined;
      place_id: string | undefined;
      full_address: string | undefined;
      pincode: string | undefined;
      lng: number | undefined;
      lat: number | undefined;
    } | null
  ) => void;
  submitMapData: () => Promise<void>;
  setSelectedCleanProjectId: (_data: string) => void;
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
  attachedMapData: {},
  selectedCleanProjectId: '__new',
};

export const useVillageProjectCleanerStore = create<
  VillageProjectCleanerState & VillageProjectCleanerActions
>()(
  immer((set, get) => ({
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
    setAttachedMapData: (key, data) => {
      if (key && data) {
        set((prev) => {
          prev.attachedMapData[key] = data;
        });
      } else if (key === 0) {
        set((prev) => {
          prev.attachedMapData = {};
        });
      }
    },
    submitMapData: async () => {
      if (Object.keys(get().attachedMapData).length === 0) return;
      const resPromise = axiosClient.post('/map/project-cord-within-village', {
        mapData: get().attachedMapData,
      });
      await toast.promise(
        resPromise,
        {
          loading: 'Submitting map data...',
          success: () => {
            set({
              selectedMapProject: null,
              mapData: null,
              attachedMapData: {},
            });
            return 'Map Data successfully submitted.';
          },
          error: 'Error',
        },
        { duration: 5000 }
      );
    },
    setSelectedCleanProjectId: (data) => set({ selectedCleanProjectId: data }),
  }))
);

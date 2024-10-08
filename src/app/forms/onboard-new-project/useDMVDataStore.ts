import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Actions {
  setDMVData: (_data: Store['DMVData']) => void;
  setDistrictOptions: (_data: Store['districtOptions']) => void;
  setMandalOptions: (_data: Store['mandalOptions']) => void;
  setVillageOptions: (_data: Store['villageOptions']) => void;
}

interface Store extends Actions {
  DMVData:
    | {
        district_id: number;
        district_name: string;
        mandals: {
          mandal_id: number;
          mandal_name: string;
          villages: { village_id: number; village_name: string }[];
        }[];
      }[]
    | null;
  districtOptions: {
    label: string;
    value: number;
  }[];
  mandalOptions: {
    label: string;
    value: number;
  }[];
  villageOptions: {
    label: string;
    value: number;
  }[];
}

export default create<Store>()(
  immer((set) => ({
    DMVData: null,
    districtOptions: [],
    mandalOptions: [],
    villageOptions: [],
    setDMVData: (data) => set({ DMVData: data }),
    setDistrictOptions: (data) => set({ districtOptions: data }),
    setMandalOptions: (data) => set({ mandalOptions: data }),
    setVillageOptions: (data) => set({ villageOptions: data }),
  }))
);

import axiosClient from '@/utils/AxiosClient';
import { countBy, isEqual, startCase, uniq, uniqWith } from 'lodash';
import { SingleValue } from 'react-select';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type UMManualDataType = {
  project_id: number;
  tower_id: number;
  tower_name: string;
  floor: number;
  unit_number: string;
  doc_id_list: string;
  latest_owner: string;
  owner_list: string;
  ptin: string;
  current_owner_hm: string;
  transaction_types: string;
  master_door_number: string;
  verified: null;
};

interface State {
  selectedProject:
    | SingleValue<{
        value: number;
        label: string;
      }>
    | undefined;
  selectedTower:
    | SingleValue<{
        value: number;
        label: string;
      }>
    | undefined;
  selectedFloor:
    | {
        value: number;
        label: string;
      }[]
    | [];
  selectedErrorType:
    | SingleValue<{
        label: string;
        value: 'err-type-1';
      }>
    | undefined;
  towerOptions:
    | {
        value: number;
        label: string;
      }[]
    | undefined;
  floorOptions:
    | {
        value: number;
        label: string;
      }[]
    | null;
  loadingTowerFloorData: 'idle' | 'loading' | 'complete' | 'error';
  umManualDataStore: UMManualDataType[] | null;
  tableData: UMManualDataType[] | null;
}

type Actions = {
  setSelectedProject: (selection: State['selectedProject']) => void;
  fetchUMManualData: () => void;
  setSelectedTower: (selection: State['selectedTower']) => void;
  setSelectedFloor: (selection: State['selectedFloor']) => void;
  setErrorType: (selection: State['selectedErrorType']) => void;
  setTableData: (newData: UMManualDataType[]) => void;
  setFloorOption: (newData: State['floorOptions']) => void;
};

export const useUMCorrectionFormStore = create<State & Actions>()(
  immer((set, get) => ({
    // Initial state

    selectedProject: undefined,
    selectedTower: undefined,
    selectedFloor: [],
    selectedErrorType: undefined,
    umManualDataStore: null,
    tableData: null,
    towerOptions: undefined,
    floorOptions: null,

    loadingTowerFloorData: 'idle',
    fetchUMManualData: async () => {
      const project_id = get().selectedProject?.value;
      if (project_id) {
        try {
          const res = await axiosClient.get<{
            data: UMManualDataType[];
          }>('/unitmaster/manualdata', {
            params: { project_id: project_id },
          });
          set({ umManualDataStore: res.data.data });
          set({ tableData: res.data.data });
          //filter for tower dropdown option
          const towerOptions = uniqWith(
            res.data.data.map((item) => ({
              value: item.tower_id,
              label: `${item.tower_id}:${item.tower_name}`,
            })),
            isEqual
          );
          const towerCount = countBy(res.data.data, 'tower_id');
          const towerOptionCount = towerOptions.map((item) => ({
            ...item,
            label: `${item.label}-(${towerCount[item.value]})`,
          }));
          set({ towerOptions: towerOptionCount });

          //filter
        } catch (error) {
          console.log(error);
        }
      }
    },
    setFloorOption: (options) =>
      set({ floorOptions: uniqWith(options, isEqual) }),
    setSelectedProject: (select) => set({ selectedProject: select }),
    setSelectedTower: (select) => set({ selectedTower: select }),
    setSelectedFloor: (select) => set({ selectedFloor: select }),
    setErrorType: (select) => set({ selectedErrorType: select }),
    setTableData: (select) => set({ tableData: select }),
  }))
);

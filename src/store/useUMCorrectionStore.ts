import axiosClient from '@/utils/AxiosClient';
import { countBy, isEqual, uniqWith } from 'lodash';
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
  selectedTableData: Partial<State['tableData']>;
  loadingErrOneTableData: 'idle' | 'loading' | 'complete' | 'error';
  umManualDataStore: UMManualDataType[] | null;
  tableData: UMManualDataType[] | null;
  matchedData:
    | Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
  unMatchedData:
    | Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
}

type Actions = {
  setSelectedProject: (selection: State['selectedProject']) => void;
  fetchUMManualData: () => void;
  setSelectedTower: (selection: State['selectedTower']) => void;
  setSelectedFloor: (selection: State['selectedFloor']) => void;
  setErrorType: (selection: State['selectedErrorType']) => void;
  setTableData: (newData: UMManualDataType[]) => void;
  setFloorOption: (newData: State['floorOptions']) => void;
  setSelectedTableData: (newData: State['selectedTableData']) => void;
  setMatchedData: (newData: State['matchedData']) => void;
  setUnMatchedData: (newData: State['matchedData']) => void;
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
    selectedTableData: [],
    matchedData: [],
    unMatchedData: [],

    loadingErrOneTableData: 'idle',
    fetchUMManualData: async () => {
      const project_id = get().selectedProject?.value;
      if (project_id) {
        set({ loadingErrOneTableData: 'loading' });
        try {
          const res = await axiosClient.get<{
            data: UMManualDataType[];
          }>('/unitmaster/manualdata', {
            params: { project_id: project_id },
          });
          const resData = uniqWith(res.data.data, isEqual);
          set({ umManualDataStore: resData });
          set({ tableData: resData });
          //filter for tower dropdown option
          const towerOptions = uniqWith(
            resData.map((item) => ({
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
          const prevSelectedTower = get().selectedTower;
          if (prevSelectedTower && prevSelectedTower.value) {
            const newSelectedTower = towerOptionCount.find(
              (item) => item.value === prevSelectedTower.value
            );
            set({ selectedTower: newSelectedTower });
          }
          set({ loadingErrOneTableData: 'complete' });
        } catch (error) {
          console.log(error);
          set({ loadingErrOneTableData: 'error' });
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
    setSelectedTableData: (data) => set({ selectedTableData: data }),
    setMatchedData: (data) => set({ matchedData: data }),
    setUnMatchedData: (data) => set({ unMatchedData: data }),
  }))
);

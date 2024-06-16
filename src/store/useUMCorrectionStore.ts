import axiosClient from '@/utils/AxiosClient';
import { countBy, isEqual, uniqWith } from 'lodash';
import { SingleValue } from 'react-select';
import { create } from 'zustand';

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
  transaction_hm_match_type: string;
  transaction_types: string;
  master_door_number: string;
  verified: null;
};

interface State {
  errorType: SingleValue<{
    value: string;
    label: string;
  }> | null;
  errTwoTFU: {
    tower_id: number;
    tower_name: string;
    floor: number;
    unit_numbers: string[];
  }[];
  errTwoMatchedData: {
    matchedData: State['errTwoRightData'] | null;
    unmatchedData: State['errTwoRightData'] | null;
    matchType: 'Matched' | 'Unmatched' | 'Stale' | null;
  };
  errTwoSelectedUnit: { value: string; label: string } | null;
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
  selectedErrTwoFloor: {
    value: number;
    label: string;
  } | null;
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
  selectedErrTwoData: State['errTwoRightData'];
  loadingErrData: 'idle' | 'loading' | 'complete' | 'error';
  umManualDataStore: UMManualDataType[] | null;
  tableData: UMManualDataType[] | null;
  errTwoLeftData: {
    generated_door_number: string;
    latest_owner: string;
    doc_id_list: string;
    transaction_types: string;
    owner_list: string;
  }[];
  errTwoRightData: {
    master_door_number: string;
    ptin: string;
    current_owner_hm: string;
    mobile_number: string;
    transaction_hm_match_type: string;
  }[];

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
  matchedStaleData:
    | Pick<
        UMManualDataType,
        'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
}

type Actions = {
  setSelectedProject: (selection: State['selectedProject']) => void;
  fetchUMMErrData: () => void;
  fetchUMMErrTwoData: () => void;
  setSelectedTower: (selection: State['selectedTower']) => void;
  setSelectedFloor: (selection: State['selectedFloor']) => void;
  setErrorType: (selection: State['errorType']) => void;
  setTableData: (newData: UMManualDataType[]) => void;
  setFloorOption: (newData: State['floorOptions']) => void;
  setSelectedTableData: (newData: State['selectedTableData']) => void;
  setSelectedErrTwoData: (newData: State['errTwoRightData']) => void;
  setMatchedData: (newData: State['matchedData']) => void;
  setUnMatchedData: (newData: State['matchedData']) => void;
  setMatchedStaleData: (newData: State['matchedData']) => void;
  setErrTwoSelectedUnit: (newData: State['errTwoSelectedUnit']) => void;
  setSelectedErrTwoFloor: (newData: State['selectedErrTwoFloor']) => void;
  resetErrTwoLeftRightData: () => void;
  setErrTwoMatchedData: (data: State['errTwoMatchedData']) => void;
};

export const useUMCorrectionFormStore = create<State & Actions>((set, get) => ({
  // Initial state
  errorType: null,
  selectedProject: undefined,
  selectedTower: undefined,
  selectedFloor: [],
  umManualDataStore: null,
  tableData: null,
  towerOptions: undefined,
  floorOptions: null,
  selectedTableData: [],
  matchedData: [],
  unMatchedData: [],
  matchedStaleData: [],
  errTwoTFU: [],
  errTwoSelectedUnit: null,
  selectedErrTwoFloor: null,
  errTwoLeftData: [],
  errTwoRightData: [],
  errTwoMatchedData: {
    matchedData: null,
    unmatchedData: null,
    matchType: null,
  },
  selectedErrTwoData: [],

  loadingErrData: 'idle' as State['loadingErrData'],
  fetchUMMErrData: async () => {
    const project_id = get().selectedProject?.value;
    if (project_id && get().errorType?.value === 'err-type-1') {
      set({ loadingErrData: 'loading' });
      try {
        const res = await axiosClient.get<{
          data: UMManualDataType[];
        }>('/unitmaster/errOneData', {
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
        set({ loadingErrData: 'complete' });
      } catch (error) {
        console.log(error);
        set({ loadingErrData: 'error' });
      }
    } else if (project_id && get().errorType?.value === 'err-type-2') {
      const res = await axiosClient.get<{
        data: {
          tower_id: number;
          tower_name: string;
          floor: number;
          unit_numbers: string[];
        }[];
      }>('/unitmaster/errTwoTFU', {
        params: { project_id: project_id },
      });
      const towerOptions = uniqWith(
        res.data.data.map((item) => ({
          value: item.tower_id,
          label: `${item.tower_id}:${item.tower_name}`,
        })),
        isEqual
      );
      set({ towerOptions: towerOptions });
      set({ errTwoTFU: res.data.data });
    }
  },
  fetchUMMErrTwoData: async () => {
    const project_id = get().selectedProject?.value;
    const tower_id = get().selectedTower?.value;
    const floor = get().selectedErrTwoFloor?.value;
    const unit_number = get().errTwoSelectedUnit?.value;
    if (
      project_id != null &&
      tower_id != null &&
      floor != null &&
      unit_number != null &&
      get().errorType?.value === 'err-type-2'
    ) {
      set({ loadingErrData: 'loading' });
      try {
        const res = await axiosClient.get<{
          data: {
            leftData: State['errTwoLeftData'];
            rightData: State['errTwoRightData'];
          };
        }>('/unitmaster/errTwoData', {
          params: { project_id, tower_id, floor, unit_number },
        });
        set({ errTwoLeftData: res.data.data.leftData });
        set({ errTwoRightData: res.data.data.rightData });
        set({ loadingErrData: 'complete' });
      } catch (error) {
        set({ loadingErrData: 'error' });
      }
    }
  },
  setFloorOption: (options) =>
    set({ floorOptions: uniqWith(options, isEqual) }),
  setSelectedProject: (select) => set({ selectedProject: select }),
  setSelectedTower: (select) => set({ selectedTower: select }),
  setSelectedFloor: (select) => set({ selectedFloor: select }),
  setErrorType: (select) => set({ errorType: select }),
  setTableData: (select) => set({ tableData: select }),
  setSelectedTableData: (data) => set({ selectedTableData: data }),
  setMatchedData: (data) => set({ matchedData: data }),
  setUnMatchedData: (data) => set({ unMatchedData: data }),
  setMatchedStaleData: (data) => set({ matchedStaleData: data }),
  setErrTwoSelectedUnit: (data) => set({ errTwoSelectedUnit: data }),
  setSelectedErrTwoFloor: (data) => set({ selectedErrTwoFloor: data }),
  resetErrTwoLeftRightData: () =>
    set({ errTwoLeftData: [], errTwoRightData: [] }),
  setErrTwoMatchedData: (newData) => set({ errTwoMatchedData: newData }),
  setSelectedErrTwoData: (newData) => set({ selectedErrTwoData: newData }),
}));

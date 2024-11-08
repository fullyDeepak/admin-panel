import axiosClient from '@/utils/AxiosClient';
import { countBy, isEqual, uniqWith } from 'lodash';
import { SingleValue } from 'react-select';
import { create } from 'zustand';

export type UMManualDataType = {
  id: number;
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
  errTwoType: 'type-a' | 'type-b' | null;
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
    id: number;
    generated_door_number: string;
    latest_owner: string;
    doc_id_list: string;
    transaction_types: string;
    owner_list: string;
  }[];
  errTwoRightData: {
    id: number;
    master_door_number: string;
    ptin: string;
    current_owner_hm: string;
    mobile_number: string;
    transaction_hm_match_type: string;
  }[];

  matchedData:
    | Pick<
        UMManualDataType,
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
  unMatchedData:
    | Pick<
        UMManualDataType,
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
  matchedStaleData:
    | Pick<
        UMManualDataType,
        'id' | 'project_id' | 'tower_id' | 'floor' | 'unit_number'
      >[]
    | [];
}

type Actions = {
  setSelectedProject: (_selection: State['selectedProject']) => void;
  fetchUMMErrData: () => void;
  fetchUMMErrTwoData: () => void;
  setSelectedTower: (_selection: State['selectedTower']) => void;
  setSelectedFloor: (_selection: State['selectedFloor']) => void;
  setErrorType: (_selection: State['errorType']) => void;
  setErrTwoType: (_selection: State['errTwoType']) => void;
  setTableData: (_newData: UMManualDataType[]) => void;
  setFloorOption: (_newData: State['floorOptions']) => void;
  setSelectedTableData: (_newData: State['selectedTableData']) => void;
  setSelectedErrTwoData: (_newData: State['errTwoRightData']) => void;
  setMatchedData: (_newData: State['matchedData']) => void;
  setUnMatchedData: (_newData: State['matchedData']) => void;
  setMatchedStaleData: (_newData: State['matchedData']) => void;
  setErrTwoSelectedUnit: (_newData: State['errTwoSelectedUnit']) => void;
  setSelectedErrTwoFloor: (_newData: State['selectedErrTwoFloor']) => void;
  resetErrTwoLeftRightData: () => void;
  setErrTwoMatchedData: (_data: State['errTwoMatchedData']) => void;
  setLoadingErrData: (_data: State['loadingErrData']) => void;
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
  errTwoType: null,

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
    } else if (project_id && get().errTwoType) {
      const res = await axiosClient.get<{
        data: {
          tower_id: number;
          tower_name: string;
          floor: number;
          unit_numbers: string[];
        }[];
      }>('/unitmaster/errTwoTFU', {
        params: { project_id: project_id, type: get().errTwoType },
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
          params: {
            project_id,
            tower_id,
            floor,
            unit_number,
            type: get().errTwoType,
          },
        });
        set({ errTwoLeftData: res.data.data.leftData });
        set({ errTwoRightData: res.data.data.rightData });
        set({ loadingErrData: 'complete' });
      } catch (_error) {
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
  setErrTwoType: (select) => set({ errTwoType: select }),
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
  setLoadingErrData: (newData) => set({ loadingErrData: newData }),
}));

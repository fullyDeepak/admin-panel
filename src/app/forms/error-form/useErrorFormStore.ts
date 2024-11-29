import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { ErrorTableDataType, GET__RecordsByProjectResp } from './types';

export interface ErrorFormDataType {
  selectedMainError: SingleValue<{
    label: string;
    value: string;
  }> | null;
  selectedMainProject: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedProject: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedTower: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedFloor: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedUnit: SingleValue<{
    label: string;
    value: string;
  }> | null;
  selectedError: SingleValue<{
    label: string;
    value: string;
  }> | null;
  selectedMainFilter: 'PROJECT' | 'ERROR';
  towerOptions: {
    label: string;
    value: number;
  }[];
  floorOptions: {
    label: string;
    value: number;
  }[];
  unitOptions: {
    label: string;
    value: string;
  }[];
  errorOptions: {
    label: string;
    value: string;
  }[];
}

interface State {
  errorFormData: ErrorFormDataType;
  recordsByProjectResp: GET__RecordsByProjectResp[];
  errorTableData: ErrorTableDataType[];
}

interface Actions {
  updateErrorFormData: (_newDetails: Partial<ErrorFormDataType>) => void;
  setRecordsByProjectResp: (_newDetails: GET__RecordsByProjectResp[]) => void;
  setErrorTableData: (_newDetails: ErrorTableDataType[]) => void;
}

const INITIAL_PROJECT_DATA_STATE: ErrorFormDataType = {
  selectedMainError: null,
  selectedMainProject: null,
  selectedProject: null,
  selectedError: null,
  selectedFloor: null,
  selectedTower: null,
  selectedUnit: null,
  selectedMainFilter: 'ERROR',
  towerOptions: [],
  floorOptions: [],
  unitOptions: [],
  errorOptions: [],
};

export const useErrorFormStore = create<State & Actions>()(
  immer((set) => ({
    errorFormData: INITIAL_PROJECT_DATA_STATE,
    recordsByProjectResp: [] as GET__RecordsByProjectResp[],
    errorTableData: [] as ErrorTableDataType[],

    updateErrorFormData: (newDetails) =>
      set((prev) => {
        prev.errorFormData = { ...prev.errorFormData, ...newDetails };
      }),

    setRecordsByProjectResp: (newDetails) =>
      set((prev) => {
        prev.recordsByProjectResp = newDetails;
      }),

    setErrorTableData: (newDetails) =>
      set((prev) => {
        prev.errorTableData = newDetails;
      }),
  }))
);

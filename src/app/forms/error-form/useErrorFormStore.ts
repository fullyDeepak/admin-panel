import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { GET__RecordsByProjectIdRes } from './types';

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
  recordsByProjectId: GET__RecordsByProjectIdRes[];
}

interface Actions {
  updateErrorFormData: (_newDetails: Partial<ErrorFormDataType>) => void;
  updateRecordsByProjectId: (_newDetails: GET__RecordsByProjectIdRes[]) => void;
}

const INITIAL_PROJECT_DATA_STATE: ErrorFormDataType = {
  selectedMainError: null,
  selectedMainProject: null,
  selectedProject: null,
  selectedMainFilter: 'ERROR',
  towerOptions: [],
  floorOptions: [],
  unitOptions: [],
  errorOptions: [],
};

export const useErrorFormStore = create<State & Actions>()(
  immer((set) => ({
    errorFormData: INITIAL_PROJECT_DATA_STATE,
    recordsByProjectId: [] as GET__RecordsByProjectIdRes[],

    updateErrorFormData: (newDetails) =>
      set((prev) => {
        prev.errorFormData = { ...prev.errorFormData, ...newDetails };
      }),

    updateRecordsByProjectId: (newDetails) =>
      set((prev) => {
        prev.recordsByProjectId = newDetails;
      }),
  }))
);

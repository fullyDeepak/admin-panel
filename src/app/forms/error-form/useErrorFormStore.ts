import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { ErrorTableDataType, GET__RecordsByProjectUnit } from './types';
import toast from 'react-hot-toast';

export interface ErrorFormDataType {
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
  projectETLVillage: string;
  projectLocality: string;
}

interface State {
  errorFormData: ErrorFormDataType;
  recordsByProjectResp: GET__RecordsByProjectUnit[];
  errorTableData: ErrorTableDataType[];
  tableRowSelection: Record<string, boolean>;
  selectedTableRows: ErrorTableDataType[];
}

interface Actions {
  updateErrorFormData: (_newDetails: Partial<ErrorFormDataType>) => void;
  setRecordsByProjectResp: (_newDetails: GET__RecordsByProjectUnit[]) => void;
  setErrorTableData: (_newDetails: ErrorTableDataType[]) => void;
  setTableRowSelection: (
    _updater:
      | Record<string, boolean>
      | ((_prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  setSelectedTableRows: (_newDetails: ErrorTableDataType[]) => void;
  updateCurrentTableData: (
    project_tower: string,
    full_unit_name: string,
    newData: Partial<ErrorTableDataType>
  ) => void;
}

const INITIAL_PROJECT_DATA_STATE: ErrorFormDataType = {
  selectedProject: null,
  selectedError: null,
  selectedFloor: null,
  selectedTower: null,
  selectedUnit: null,
  towerOptions: [],
  floorOptions: [],
  unitOptions: [],
  errorOptions: [],
  projectETLVillage: '',
  projectLocality: '',
};

export const useErrorFormStore = create<State & Actions>()(
  immer((set) => ({
    errorFormData: INITIAL_PROJECT_DATA_STATE,
    recordsByProjectResp: [] as GET__RecordsByProjectUnit[],
    errorTableData: [] as ErrorTableDataType[],
    tableRowSelection: {},
    selectedTableRows: [] as ErrorTableDataType[],

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

    setSelectedTableRows: (newDetails) =>
      set((prev) => {
        prev.selectedTableRows = newDetails;
      }),

    setTableRowSelection: (updater) =>
      set((state) => ({
        tableRowSelection:
          typeof updater === 'function'
            ? updater(state.tableRowSelection)
            : updater,
      })),

    updateCurrentTableData: (project_tower, full_unit_name, data) => {
      set((prev) => {
        if (prev.errorTableData) {
          const idx = prev.errorTableData?.findIndex(
            (ele) =>
              ele.project_tower === project_tower &&
              ele.full_unit_name === full_unit_name
          );
          if (idx >= -1) {
            prev.errorTableData[idx] = {
              ...prev.errorTableData[idx],
              ...data,
            };
            toast.success('Record updated successfully');
          } else {
            toast.error('Could not update the record');
          }
        }
      });
    },
  }))
);

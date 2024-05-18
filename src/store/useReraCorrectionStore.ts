import { ReraDMLVTableData } from '@/types/types';
import { create } from 'zustand';

type ReraDocType =
  | {
      projectId: {
        projectId: number;
        fileName: string;
        content: { type: string; data: Uint8Array };
      }[];
    }
  | {};

interface FormState {
  reraTableDataStore: ReraDMLVTableData[] | null;
  projectOption: {
    label: string;
    value: number;
  }[];
  setProjectOptions: (
    options: {
      label: string;
      value: number;
    }[]
  ) => void;

  setRERATableDataStore: (tableData: ReraDMLVTableData[]) => void;
  selectedProjects: FormState['projectOption'];
  setSelectedProjects: (options: FormState['projectOption']) => void;
  reraDocsList: ReraDocType;
  setReraDocList: (projectId: ReraDocType) => void;
  resetReraDocsList: () => void;
}

export const useReraCorrectionStore = create<FormState>((set) => ({
  // Initial state
  reraTableDataStore: null,
  projectOption: [],
  selectedProjects: [],
  reraDocsList: {},
  setRERATableDataStore: (tableData) => set({ reraTableDataStore: tableData }),
  setProjectOptions: (options) => set({ projectOption: options }),
  setSelectedProjects: (projects) => set({ selectedProjects: projects }),
  setReraDocList: (projectId) => set({ reraDocsList: { ...projectId } }),
  resetReraDocsList: () => set({ reraDocsList: {} }),
}));

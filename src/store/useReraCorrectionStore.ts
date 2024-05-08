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

type tableData = {
  id: number;
  project_name: string;
  district: string;
  district_id: number;
  mandal: string;
  mandal_id: number;
  locality: string;
  village: string;
  village_id: number;
};

interface FormState {
  reraTableDataStore: tableData[] | null;
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

  setRERATableDataStore: (tableData: tableData[]) => void;
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

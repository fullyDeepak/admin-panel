import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

export interface ProjectDataType {
  selectedDistrict: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedMandal: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedVillage: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedProject: SingleValue<{
    label: string;
    value: number;
  }> | null;
}

interface State {
  projectData: ProjectDataType;
  randomGridValue: number;
  formStepsList: ['Project', 'Tower', 'Status', 'Preview'];
  currentFormStep: State['formStepsList'][number];
}

interface Actions {
  updateProjectData: (_newDetails: Partial<ProjectDataType>) => void;
  setFormSteps: (_step: State['currentFormStep']) => void;
  updateRandomGridValue: (_value: number) => void;
}

const INITIAL_PROJECT_DATA_STATE: ProjectDataType = {
  selectedDistrict: null,
  selectedMandal: null,
  selectedVillage: null,
  selectedProject: null,
};

export const useProjectDataStore = create<State & Actions>()(
  immer((set) => ({
    projectData: INITIAL_PROJECT_DATA_STATE,
    randomGridValue: 0,
    currentFormStep: 'Project' as State['currentFormStep'],
    formStepsList: [
      'Project',
      'Tower',

      'Status',
      'Preview',
    ] as State['formStepsList'],
    setFormSteps: (step) => set({ currentFormStep: step }),
    updateProjectData: (newDetails) =>
      set((prev) => {
        prev.projectData = { ...prev.projectData, ...newDetails };
      }),

    updateRandomGridValue: (value) => set({ randomGridValue: value }),
  }))
);

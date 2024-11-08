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
  formStepsList: ['Project', 'Tower', 'Image', 'Status', 'Preview'];
  currentFormStep: State['formStepsList'][number];
  setFormSteps: (_step: State['currentFormStep']) => void;
}

interface Actions {
  updateProjectData: (_newDetails: Partial<ProjectDataType>) => void;
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
    currentFormStep: 'Project' as State['currentFormStep'],
    formStepsList: [
      'Project',
      'Tower',
      'Image',
      'Status',
      'Preview',
    ] as State['formStepsList'],
    setFormSteps: (step) => set({ currentFormStep: step }),
    updateProjectData: (newDetails) =>
      set((prev) => {
        prev.projectData = { ...prev.projectData, ...newDetails };
      }),
  }))
);

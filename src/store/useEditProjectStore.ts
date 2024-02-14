import { create } from 'zustand';
import { SingleValue } from 'react-select';

export interface ProjectTaggingType {
  selectedProject: null | number;
  selectedProjectOption:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  village_id: number;
  projectName: string;
  layoutName: string;
  developer: string;
  developerGroup: string;
  projectType: string;
  towerTypeOptions:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
  projectSubTypeOptions:
    | {
        label: string;
        value: string;
      }[]
    | [];
  projectSubType: string;
  projectDesc: string;
  amenitiesTags: string[];
  surveyEqual: string[];
  surveyContains: string[];
  plotEqual: string[];
  apartmentContains: string;
  counterpartyContains: string;
}

interface FormState {
  editProjectFormData: ProjectTaggingType;
  updateEditProjectFormData: (newDetails: Partial<ProjectTaggingType>) => void;
  loadEditProjectFormData?: (data: any) => void;
  resetEditProjectFormData: () => void;
}

const initialState: ProjectTaggingType = {
  selectedProject: null,
  selectedProjectOption: undefined,
  village_id: 0,
  projectName: '',
  layoutName: '',
  developer: '',
  developerGroup: '',
  projectType: '',
  projectSubType: '',
  towerTypeOptions: [],
  projectSubTypeOptions: [],
  projectDesc: '',
  amenitiesTags: [],
  surveyEqual: [],
  surveyContains: [],
  plotEqual: [],
  apartmentContains: '',
  counterpartyContains: '',
};

export const useEditProjectStore = create<FormState>((set) => ({
  // Initial state
  editProjectFormData: initialState,

  // Update functions
  updateEditProjectFormData: (newDetails) =>
    set((state) => ({
      editProjectFormData: { ...state.editProjectFormData, ...newDetails },
    })),

  resetEditProjectFormData: () => {
    set({ editProjectFormData: initialState });
  },
}));

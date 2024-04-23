import { create } from 'zustand';
import { SingleValue } from 'react-select';

export interface ProjectTaggingType {
  selectedProject: number | undefined;
  selectedProjectOption:
    | {
        label: string;
        value: string;
      }[]
    | [];
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
  amenitiesTags: { label: string; value: string; __isNew__?: boolean }[];
  surveyEqual: string[];
  docId: string;
  rootDocs: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  plotEqual: string[];
  surveyContains: string[];
  plotContains: string[];
  localityContains: string[];
  wardBlock: string[];
  localityPlot: string[];
  doorNoStartWith: string;
  aptNameNotContains: string;
}

interface FormState {
  editProjectFormData: ProjectTaggingType;
  oldProjectFormData: ProjectTaggingType | null;
  updateOldProjectFormData: (oldDetails: Partial<ProjectTaggingType>) => void;
  updateEditProjectFormData: (newDetails: Partial<ProjectTaggingType>) => void;
  loadEditProjectFormData?: (data: any) => void;
  resetEditProjectFormData: () => void;
}

const initialState: ProjectTaggingType = {
  selectedProject: undefined,
  selectedProjectOption: [],
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
  docId: '',
  rootDocs: [],
  apartmentContains: [],
  counterpartyContains: [],
  surveyEqual: [],
  plotEqual: [],
  surveyContains: [],
  plotContains: [],
  localityContains: [],
  wardBlock: [],
  localityPlot: [],
  doorNoStartWith: '',
  aptNameNotContains: '',
};

export const useEditProjectStore = create<FormState>((set) => ({
  // Initial state
  editProjectFormData: initialState,
  oldProjectFormData: null,
  updateOldProjectFormData: (oldDetails) =>
    set((state) => ({
      oldProjectFormData: { ...state.editProjectFormData, ...oldDetails },
    })),

  // Update functions
  updateEditProjectFormData: (newDetails) =>
    set((state) => ({
      editProjectFormData: { ...state.editProjectFormData, ...newDetails },
    })),

  resetEditProjectFormData: () => {
    set({ editProjectFormData: initialState });
  },
}));

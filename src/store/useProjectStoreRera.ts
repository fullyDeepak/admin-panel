import { create } from 'zustand';
import { SingleValue } from 'react-select';

export interface ProjectTaggingTypeRera {
  district: SingleValue<{
    label: string;
    value: string;
  }>;
  mandal: SingleValue<{
    label: string;
    value: string;
  }>;
  village: SingleValue<{
    label: string;
    value: string;
  }>;
  village_id: number;
  projects: {
    label: string;
    value: string;
  }[];
  projectName: string;
  projectIds: number[];
  layoutName: string;
  developers: string[];
  developerGroup: string;
  projectType: SingleValue<{
    label: string;
    value: string;
  }>;
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
    | undefined;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectTypeSuggestion: string[];
  projectSubTypeSuggestion: string[];
  projectDesc: string;
  amenitiesTags: { label: string; value: string; __isNew__?: boolean }[];
  surveySuggestion: string[];
  plotSuggestion: string[];
  docId: string;
  rootDocs: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  surveyEqual: string[];
  plotEqual: string[];
  surveyContains: string[];
  plotContains: string[];
  doorNoStartWith: string;
  aptNameNotContains: string;
  projectCoordinates: string[];
}

interface FormState {
  projectFormDataRera: ProjectTaggingTypeRera;
  updateProjectFormDataRera: (
    newDetails: Partial<ProjectTaggingTypeRera>
  ) => void;
  resetProjectFormDataRera: () => void;
}

const initialState: ProjectTaggingTypeRera = {
  district: null,
  mandal: null,
  village: null,
  village_id: 0,
  projects: [],
  projectName: '',
  projectIds: [],
  layoutName: '',
  developers: [],
  developerGroup: '',
  projectType: {
    label: '',
    value: '',
  },
  towerTypeOptions: undefined,
  projectSubTypeOptions: undefined,
  projectSubType: {
    label: '',
    value: '',
  },
  projectTypeSuggestion: [],
  projectSubTypeSuggestion: [],
  projectDesc: '',
  amenitiesTags: [],
  surveyEqual: [],
  surveySuggestion: [],
  plotSuggestion: [],
  docId: '',
  rootDocs: [],
  apartmentContains: [],
  counterpartyContains: [],
  plotEqual: [],
  surveyContains: [],
  plotContains: [],
  doorNoStartWith: '',
  aptNameNotContains: '',
  projectCoordinates: [],
};

export const useProjectStoreRera = create<FormState>((set) => ({
  // Initial state
  projectFormDataRera: initialState,

  // Update functions
  updateProjectFormDataRera: (newDetails) =>
    set((state) => ({
      projectFormDataRera: { ...state.projectFormDataRera, ...newDetails },
    })),

  resetProjectFormDataRera: () => {
    set({ projectFormDataRera: initialState });
  },
}));

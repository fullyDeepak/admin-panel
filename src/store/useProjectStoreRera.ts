import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { FormProjectTaggingType } from '@/types/types';
export interface ProjectTaggingTypeRera extends FormProjectTaggingType {
  isRERAProject: boolean;
  district: SingleValue<{
    label: string;
    value: number;
  }>;
  mandal: SingleValue<{
    label: string;
    value: number;
  }>;
  village: SingleValue<{
    label: string;
    value: number;
  }>;
  projects: {
    label: string;
    value: string;
  }[];
  projectIds: number[];
  projectType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectTypeSuggestion: string[];
  projectSubTypeSuggestion: string[];
  surveySuggestion: string[];
  plotSuggestion: string[];
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
  isRERAProject: true,
  district: null,
  mandal: null,
  village: null,
  projects: [],
  projectName: '',
  projectIds: [],
  layoutName: '',
  developer: '',
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
  surveyEquals: [],
  surveySuggestion: [],
  plotSuggestion: [],
  docId: [],
  rootDocs: [],
  apartmentContains: [],
  counterpartyContains: [],
  aptSurveyPlotDetails: false,
  counterpartySurveyPlotDetails: false,
  plotEquals: [],
  surveyContains: [],
  plotContains: [],
  doorNoStartWith: [],
  aptNameNotContains: [],
  docIdNotContains: [],
  projectCoordinates: [],
  singleUnit: false,
  towerPattern: '',
  floorPattern: '',
  unitPattern: '',
  localities: [],
  localityContains: [],
  localityPlot: [],
  wardBlock: [],
};

export const useProjectStoreRera = create<FormState>((set) => ({
  // Initial state
  projectFormDataRera: initialState,

  // Update functions
  updateProjectFormDataRera: (newDetails) =>
    set((state) => ({
      projectFormDataRera: { ...state.projectFormDataRera, ...newDetails },
    })),

  resetProjectFormDataRera: () => set({ projectFormDataRera: initialState }),
}));

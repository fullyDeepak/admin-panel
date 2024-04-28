import { create } from 'zustand';
import { SingleValue } from 'react-select';

export interface ProjectTaggingType {
  village_id: SingleValue<{
    label: string;
    value: number;
  }>;
  projectName: string;
  layoutName: string;
  developer: string;
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
  projectDesc: string;
  amenitiesTags: { label: string; value: string; __isNew__?: boolean }[];
  surveyEquals: string[];
  surveyContains: string[];
  plotEquals: string[];
  plotContains: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  projectCoordinates: string[];
  docId: string[];
  rootDocs: string[];
  aptSurveyPlotDetails: boolean;
  counterpartySurveyPlotDetails: boolean;
  localityContains: string[];
  wardBlock: string[];
  localityPlot: string[];
  doorNoStartWith: string[];
  aptNameNotContains: string[];
}

interface FormState {
  projectFormData: ProjectTaggingType;
  updateProjectFormData: (newDetails: Partial<ProjectTaggingType>) => void;
  resetProjectFormData: () => void;
}

const initialState: ProjectTaggingType = {
  village_id: {
    label: '',
    value: 0,
  },
  projectName: '',
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
  projectDesc: '',
  amenitiesTags: [],
  surveyEquals: [],
  surveyContains: [],
  plotEquals: [],
  apartmentContains: [],
  counterpartyContains: [],
  projectCoordinates: [],
  aptNameNotContains: [],
  aptSurveyPlotDetails: false,
  counterpartySurveyPlotDetails: false,
  docId: [],
  doorNoStartWith: [],
  localityContains: [],
  localityPlot: [],
  plotContains: [],
  rootDocs: [],
  wardBlock: [],
};

export const useProjectStore = create<FormState>((set) => ({
  // Initial state
  projectFormData: initialState,

  // Update functions
  updateProjectFormData: (newDetails) =>
    set((state) => ({
      projectFormData: { ...state.projectFormData, ...newDetails },
    })),

  resetProjectFormData: () => {
    set({ projectFormData: initialState });
  },
}));

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { FormProjectTaggingType } from '@/types/types';

export interface ProjectTaggingType extends FormProjectTaggingType {
  village_id: SingleValue<{
    label: string;
    value: number;
  }>;
  projectType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectCoordinates: string[];
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
  docIdNotContains: [],
  doorNoStartWith: [],
  localityContains: [],
  localityPlot: [],
  plotContains: [],
  rootDocs: [],
  wardBlock: [],
  singleUnit: false,
  towerPattern: '',
  floorPattern: '',
  unitPattern: '',
  localities: [],
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

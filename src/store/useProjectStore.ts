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
  amenitiesTags: string[];
  surveyEqual: string[];
  surveyContains: string[];
  plotEqual: string[];
  apartmentContains: string;
  counterpartyContains: string;
  projectCoordinates: string[];
}

interface FormState {
  projectFormData: ProjectTaggingType;
  updateProjectFormData: (newDetails: Partial<ProjectTaggingType>) => void;
}

export const useProjectStore = create<FormState>((set) => ({
  // Initial state
  projectFormData: {
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
    surveyEqual: [],
    surveyContains: [],
    plotEqual: [],
    apartmentContains: '',
    counterpartyContains: '',
    projectCoordinates: [],
  },

  // Update functions
  updateProjectFormData: (newDetails) =>
    set((state) => ({
      projectFormData: { ...state.projectFormData, ...newDetails },
    })),
}));

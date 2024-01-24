import { create } from 'zustand';
import { SingleValue } from 'react-select';

export interface ProjectTaggingType {
  village_id: SingleValue<{
    label: string;
    value: number;
  }>;
  projectName: string;
  layoutName: string;
  reraId: string;
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
  towerType: SingleValue<{
    label: string;
    value: string;
  }>;
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
  status: SingleValue<{
    label: string;
    value: string;
  }>;
  preRera: string;
  projectBrief: string;
  numberOfUnits: number;
  projectSize_builtUp: number;
  avgFloorplate: number;
  avgFloorHeight: number;
  yearCompleted: number;
  micromarket: string;
  landArea: number;
  amenitiesTags: string[];
  surveyEqual: string;
  surveyContains: string;
  plotEqual: string;
  apartmentContains: string;
  counterpartyContains: string;
  towerCoordinates: string;
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
    reraId: '',
    developer: '',
    developerGroup: '',
    projectType: {
      label: '',
      value: '',
    },
    towerTypeOptions: undefined,
    projectSubTypeOptions: undefined,
    towerType: {
      label: '',
      value: '',
    },
    projectSubType: {
      label: '',
      value: '',
    },
    status: {
      label: '',
      value: '',
    },
    preRera: '',
    projectBrief: '',
    numberOfUnits: 0,
    projectSize_builtUp: 0,
    avgFloorplate: 0,
    avgFloorHeight: 0,
    yearCompleted: 0,
    micromarket: '',
    landArea: 0,
    amenitiesTags: [],
    surveyEqual: '',
    surveyContains: '',
    plotEqual: '',
    apartmentContains: '',
    counterpartyContains: '',
    towerCoordinates: '',
  },

  // Update functions
  updateProjectFormData: (newDetails) =>
    set((state) => ({
      projectFormData: { ...state.projectFormData, ...newDetails },
    })),
}));

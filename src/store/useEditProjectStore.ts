import { FormProjectTaggingType } from '@/types/types';
import { create } from 'zustand';

export interface EditProjectTaggingType extends FormProjectTaggingType {
  village_id: number;
  selectedProject: number | undefined;
  selectedProjectOption:
    | {
        label: string;
        value: string;
      }[]
    | [];
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
}

interface FormState {
  editProjectFormData: EditProjectTaggingType;
  oldProjectFormData: EditProjectTaggingType | null;
  updateOldProjectFormData: (
    oldDetails: Partial<EditProjectTaggingType>
  ) => void;
  updateEditProjectFormData: (
    newDetails: Partial<EditProjectTaggingType>
  ) => void;
  loadEditProjectFormData?: (data: any) => void;
  resetEditProjectFormData: () => void;
}

const initialState: EditProjectTaggingType = {
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
  docId: [],
  docIdNotEquals: [],
  rootDocs: [],
  apartmentContains: [],
  counterpartyContains: [],
  aptSurveyPlotDetails: false,
  counterpartySurveyPlotDetails: false,
  surveyEquals: [],
  plotEquals: [],
  surveyContains: [],
  plotContains: [],
  localityContains: [],
  wardBlock: [],
  localityPlot: [],
  doorNoStartWith: [],
  aptNameNotContains: [],
  singleUnit: false,
  towerPattern: '',
  floorPattern: '',
  unitPattern: '',
  localities: [],
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

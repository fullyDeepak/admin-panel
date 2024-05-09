import { create } from 'zustand';

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
  amenitiesTags: {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  surveyEquals: string[];
  docId: string[];
  rootDocs: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  aptSurveyPlotDetails: boolean;
  counterpartySurveyPlotDetails: boolean;
  plotEquals: string[];
  surveyContains: string[];
  plotContains: string[];
  localityContains: string[];
  wardBlock: string[];
  localityPlot: string[];
  doorNoStartWith: string[];
  aptNameNotContains: string[];
  singleUnit: boolean;
  towerPattern: string;
  floorPattern: string;
  unitPattern: string;
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
  docId: [],
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

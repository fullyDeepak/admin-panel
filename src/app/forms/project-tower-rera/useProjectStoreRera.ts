import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { FormProjectETLTagDataType, FormProjectDataType } from '@/types/types';
export interface ProjectTaggingTypeRera extends FormProjectDataType {
  isRERAProject: boolean;
  district: SingleValue<{
    label: string;
    value: number;
  }>;
  mandal: SingleValue<{
    label: string;
    value: number;
  }>;
  mandalSuggestion: string[];
  village: SingleValue<{
    label: string;
    value: number;
  }>;
  village_id: number | null;
  villageSuggestion: string[];
  projects: {
    label: string;
    value: number;
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
  reraProjectType: 'mixed' | 'villa' | 'commercial';
  projectTypeSuggestion: string[];
  projectSubTypeSuggestion: string[];
  surveySuggestion: string[];
  plotSuggestion: string[];
  projectCoordinates: string[];
  selectedProjectStatusTowers: {
    label: string;
    value: number;
  }[];
}

interface FormState {
  projectFormDataRera: ProjectTaggingTypeRera;
  projectFormETLTagData: FormProjectETLTagDataType[];
  updateProjectFormDataRera: (
    _newDetails: Partial<ProjectTaggingTypeRera>
  ) => void;
  updateProjectETLTagData: (
    _etlCardId: number,
    _key: string,
    _value: any
  ) => void;
  addProjectETLTagCard: (_newDetails: FormProjectETLTagDataType) => void;
  deleteProjectETLTagCard: (_etlCardId: number) => void;
  resetProjectFormDataRera: () => void;
  resetAllProjectData: () => void;
}

const initialStateProjectData: ProjectTaggingTypeRera = {
  isRERAProject: true,
  district: null,
  mandal: null,
  mandalSuggestion: [],
  villageSuggestion: [],
  village: null,
  village_id: null,
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
  surveySuggestion: [],
  plotSuggestion: [],
  projectCoordinates: [],
  localities: [],
  keywordType: undefined,
  developerKeywords: [],
  landlordKeywords: [],
  reraProjectType: 'mixed',
  selectedProjectStatusTowers: [],
  selectedProjectStatusType: null,
};

const initialStateProjectETLTagData: FormProjectETLTagDataType[] = [
  {
    id: 1,
    village: undefined,
    surveyEquals: [],
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
    docIdNotEquals: [],
    singleUnit: false,
    etlPattern: '',
    localityContains: [],
    localityPlot: [],
    wardBlock: [],
  },
];

export const useProjectStoreRera = create<FormState>((set, get) => ({
  // Initial state
  projectFormDataRera: initialStateProjectData,
  projectFormETLTagData: initialStateProjectETLTagData,

  // Update functions
  updateProjectFormDataRera: (newDetails) =>
    set((state) => ({
      projectFormDataRera: { ...state.projectFormDataRera, ...newDetails },
    })),
  updateProjectETLTagData: (etlCardId, key, value) => {
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData.map((data) =>
        data.id === etlCardId ? { ...data, [key]: value } : data
      ),
    }));
  },
  addProjectETLTagCard: (newDetails) =>
    set((state) => ({
      projectFormETLTagData: [
        ...state.projectFormETLTagData,
        { ...newDetails },
      ],
    })),
  deleteProjectETLTagCard: (etlCardId) =>
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData.filter(
        (item) => item.id !== etlCardId
      ),
    })),
  resetProjectFormDataRera: () =>
    set({
      projectFormDataRera: {
        ...initialStateProjectData,
        reraProjectType: get().projectFormDataRera.reraProjectType,
      },
    }),
  resetAllProjectData: () => {
    set({
      projectFormDataRera: initialStateProjectData,
      projectFormETLTagData: initialStateProjectETLTagData,
    });
  },
}));

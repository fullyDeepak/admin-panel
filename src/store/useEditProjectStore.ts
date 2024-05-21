import { FormProjectDataType, FormProjectETLTagDataType } from '@/types/types';
import { create } from 'zustand';

export interface EditProjectTaggingType extends FormProjectDataType {
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
  projectFormETLTagData: FormProjectETLTagDataType[];
  updateProjectETLTagData: (etlCardId: number, key: string, value: any) => void;
  addProjectETLTagCard: (newDetails: FormProjectETLTagDataType) => void;
  deleteProjectETLTagCard: (etlCardId: number) => void;
  updateOldProjectFormData: (
    oldDetails: Partial<EditProjectTaggingType>
  ) => void;
  updateEditProjectFormData: (
    newDetails: Partial<EditProjectTaggingType>
  ) => void;
  loadEditProjectFormData?: (data: any) => void;
  resetEditProjectFormData: () => void;
}

const initialStateProjectData: EditProjectTaggingType = {
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
  localities: [],
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
    towerPattern: '',
    floorPattern: '',
    unitPattern: '',
    localityContains: [],
    localityPlot: [],
    wardBlock: [],
  },
];

export const useEditProjectStore = create<FormState>((set) => ({
  // Initial state
  editProjectFormData: initialStateProjectData,
  projectFormETLTagData: initialStateProjectETLTagData,
  oldProjectFormData: null,
  updateOldProjectFormData: (oldDetails) =>
    set((state) => ({
      oldProjectFormData: { ...state.editProjectFormData, ...oldDetails },
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

  updateEditProjectFormData: (newDetails) =>
    set((state) => ({
      editProjectFormData: { ...state.editProjectFormData, ...newDetails },
    })),

  resetEditProjectFormData: () => {
    set({ editProjectFormData: initialStateProjectData });
  },
}));

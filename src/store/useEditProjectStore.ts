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
  projectFormETLTagData: FormProjectETLTagDataType[] | null;
  oldProjectFormETLTagData: FormProjectETLTagDataType[] | null;
  updateProjectETLTagData: (etlCardId: number, key: string, value: any) => void;
  addProjectETLTagCard: (newDetails: FormProjectETLTagDataType) => void;
  deleteProjectETLTagCard: (etlCardId: number) => void;
  resetProjectETLTagCard: () => void;
  updateOldProjectFormData: (
    oldDetails: Partial<EditProjectTaggingType>
  ) => void;
  updateOldProjectFormETLTagData: (
    oldDetails: FormProjectETLTagDataType[]
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

export const useEditProjectStore = create<FormState>((set) => ({
  // Initial state
  editProjectFormData: initialStateProjectData,
  projectFormETLTagData: null,
  oldProjectFormData: null,
  oldProjectFormETLTagData: null,
  updateOldProjectFormData: (oldDetails) =>
    set((state) => ({
      oldProjectFormData: { ...state.editProjectFormData, ...oldDetails },
    })),
  updateOldProjectFormETLTagData: (oldDetails) =>
    set((state) => ({
      oldProjectFormETLTagData: oldDetails,
    })),
  updateProjectETLTagData: (etlCardId, key, value) => {
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData?.map((data) =>
        data.id === etlCardId ? { ...data, [key]: value } : data
      ),
    }));
  },
  addProjectETLTagCard: (newDetails) =>
    set((state) => ({
      projectFormETLTagData: [
        ...(state.projectFormETLTagData ?? []),
        { ...newDetails },
      ],
    })),
  deleteProjectETLTagCard: (etlCardId) =>
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData?.filter(
        (item) => item.id !== etlCardId
      ),
    })),
  resetProjectETLTagCard: () => {
    set({ projectFormETLTagData: null });
  },

  updateEditProjectFormData: (newDetails) =>
    set((state) => ({
      editProjectFormData: { ...state.editProjectFormData, ...newDetails },
    })),

  resetEditProjectFormData: () => {
    set({ editProjectFormData: initialStateProjectData });
  },
}));

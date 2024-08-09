import { FormProjectDataType, FormProjectETLTagDataType } from '@/types/types';
import { uniqBy } from 'lodash';
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
  reraId: string | null;
}

interface FormState {
  editProjectFormData: EditProjectTaggingType;
  oldProjectFormData: EditProjectTaggingType | null;
  projectFormETLTagData: FormProjectETLTagDataType[] | null;
  oldProjectFormETLTagData: FormProjectETLTagDataType[] | null;
  projectPricingStatus: {
    updated_at: string;
    project_id: number;
    tower_id: string;
    updated_field: 'price';
    updated_value: string;
  }[];
  projectBookingStatus: {
    updated_at: string;
    project_id: number;
    tower_id: string;
    updated_field: 'manual_bookings';
    updated_value: string;
  }[];
  projectConstructionStatus: {
    updated_at: string;
    project_id: number;
    tower_id: string;
    updated_field: 'display_construction_status';
    updated_value: string;
  }[];
  existingProjectStatusData: {
    id: string;
    updated_at: Date;
    project_id: string;
    tower_id: string;
    updated_field: string;
    updated_value: string;
  }[];
  updateProjectETLTagData: (
    _etlCardId: number,
    _key: string,
    _value: any
  ) => void;
  addProjectETLTagCard: (_newDetails: FormProjectETLTagDataType) => void;
  deleteProjectETLTagCard: (_etlCardId: number) => void;
  resetProjectETLTagCard: () => void;
  updateOldProjectFormData: (
    _oldDetails: Partial<EditProjectTaggingType>
  ) => void;
  updateOldProjectFormETLTagData: (
    _oldDetails: FormProjectETLTagDataType[]
  ) => void;
  updateEditProjectFormData: (
    _newDetails: Partial<EditProjectTaggingType>
  ) => void;
  loadEditProjectFormData?: (_data: any) => void;
  resetEditProjectFormData: () => void;
  updateProjectStatus: (
    _key: 'booking' | 'pricing' | 'display_construction_status',
    _newData: {
      updated_at: string;
      project_id: number;
      tower_id: string;
      updated_value: string;
      updated_field:
        | 'manual_bookings'
        | 'price'
        | 'display_construction_status';
    }[]
  ) => void;
  updateExistingProjectStatusData: (
    _data: FormState['existingProjectStatusData']
  ) => void;
  deleteProjectStatusData: (
    _key: 'pricing' | 'booking' | 'display_construction_status',
    _tower_id: string
  ) => void;
  resetAllProjectData: () => void;
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
  developerKeywords: [],
  landlordKeywords: [],
  keywordType: undefined,
  reraId: null,
  selectedProjectStatusTowers: [],
  selectedProjectStatusType: null,
};

export const useEditProjectStore = create<FormState>((set) => ({
  // Initial state
  editProjectFormData: initialStateProjectData,
  projectFormETLTagData: null,
  oldProjectFormData: null,
  oldProjectFormETLTagData: null,
  projectBookingStatus: [],
  projectPricingStatus: [],
  projectConstructionStatus: [],
  existingProjectStatusData: [],
  updateOldProjectFormData: (oldDetails) =>
    set((state) => ({
      oldProjectFormData: { ...state.editProjectFormData, ...oldDetails },
    })),
  updateOldProjectFormETLTagData: (oldDetails) =>
    set(() => ({
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
  updateProjectStatus: (key, newData) => {
    if (key === 'booking') {
      set((state) => ({
        projectBookingStatus: uniqBy(
          [
            ...state.projectBookingStatus,
            ...(newData as FormState['projectBookingStatus']),
          ],
          'tower_id'
        ),
      }));
    } else if (key === 'pricing') {
      set((state) => ({
        projectPricingStatus: uniqBy(
          [
            ...state.projectPricingStatus,
            ...(newData as FormState['projectPricingStatus']),
          ],
          'tower_id'
        ),
      }));
    } else if (key === 'display_construction_status') {
      set((state) => ({
        projectConstructionStatus: uniqBy(
          [
            ...state.projectConstructionStatus,
            ...(newData as FormState['projectConstructionStatus']),
          ],
          'tower_id'
        ),
      }));
    }
  },
  updateExistingProjectStatusData: (data) => {
    set({ existingProjectStatusData: data });
  },
  deleteProjectStatusData: (key, tower_id) => {
    if (key === 'booking') {
      set((state) => ({
        projectBookingStatus: state.projectBookingStatus.filter(
          (item) => item.tower_id != tower_id
        ),
      }));
    } else if (key === 'pricing') {
      set((state) => ({
        projectPricingStatus: state.projectPricingStatus.filter(
          (item) => item.tower_id != tower_id
        ),
      }));
    } else if (key === 'display_construction_status') {
      set((state) => ({
        projectConstructionStatus: state.projectConstructionStatus.filter(
          (item) => item.tower_id != tower_id
        ),
      }));
    }
  },
  resetAllProjectData: () => {
    set({
      editProjectFormData: initialStateProjectData,
      projectFormETLTagData: null,
      oldProjectFormData: null,
      oldProjectFormETLTagData: null,
      projectBookingStatus: [],
      projectPricingStatus: [],
      existingProjectStatusData: [],
    });
  },
}));

import axiosClient from '@/utils/AxiosClient';
import { startCase } from 'lodash';
import { SingleValue } from 'react-select';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Response {
  project_id: number;
  project_name: string;
  tower_id: number;
  tower_name: string;
  type: 'apartment' | 'villa' | 'apartmentSingle';
  floors_units: {
    floor_id: number;
    units: {
      unit_number: string;
      full_unit_name: string;
    }[];
  }[];
}

export type TowerFloorDataType = {
  towerId: number;
  towerName: string;
  towerType: string;
  floorsUnits: {
    floorId: number;
    units: {
      fullUnitName: string;
      unitNumber: string;
      color?: string;
      unitType: string | null;
    }[];
  }[];
};

export type SetSelectedUnitProps =
  | {
      towerId: number;
      floorId: number;
      unitName: string;
      unitType: number;
      selectColumn?: boolean;
    }
  | {
      towerId: number;
      floorId: number;
      unitName: number;
      unitType: number;
      selectColumn: boolean;
    };

export type SelectedTowerFloorUnitDataType = {
  [towerId: number]: {
    selectedUnits: {
      [unitName: string]: null | number;
    };
  };
};
interface State {
  selectedProject:
    | SingleValue<{
        value: number;
        label: string;
      }>
    | undefined;
  towerFloorFormData: TowerFloorDataType[];
  towerOptions: {
    value: number;
    label: string;
  }[];
  availableProjectData:
    | {
        project_id: number;
        tower_id?: number;
        doc_type: string;
        s3_path: string;
        preview_url: string;
        file_type: 'image' | 'pdf';
      }[]
    | [];
  selectedImageTaggingType: SingleValue<{
    label: string;
    value:
      | 'brochure'
      | 'project_master_plan'
      | 'project_image'
      | 'tower-fp'
      | 'unit-fp';
  } | null>;
  loadingTowerFloorData: 'idle' | 'loading' | 'complete' | 'error';
  uploadingStatus: 'idle' | 'running' | 'complete' | 'error';
  resultData:
    | {
        fileName: string;
        uploadStatus: 'Success' | 'Failure';
      }[]
    | null;
}

type Actions = {
  setSelectedProject: (selection: State['selectedProject']) => void;
  setTowerFloorFormData: (newData: TowerFloorDataType[]) => void;
  setSelectedImageTaggingType: (
    select: State['selectedImageTaggingType']
  ) => void;
  setAvailableProjectData: (
    newData: State['availableProjectData'] | []
  ) => void;
  setResultData: (newData: State['resultData']) => void;
  setUploadingStatus: (newStatus: State['uploadingStatus']) => void;
  fetchTowerFloorData: (projectId: number) => void;
  resetTowerFloorData: () => void;
};

export const useImageFormStore = create<State & Actions>()(
  immer((set, get) => ({
    // Initial state

    selectedProject: undefined,

    setSelectedProject: (select) => set({ selectedProject: select }),

    towerFloorFormData: [] as TowerFloorDataType[],

    towerOptions: [],

    selectedImageTaggingType: null,

    availableProjectData: [],

    resultData: null,

    setSelectedImageTaggingType: (select) =>
      set({ selectedImageTaggingType: select }),

    setAvailableProjectData: (newData) =>
      set({ availableProjectData: newData }),

    setTowerFloorFormData: (newData) => set({ towerFloorFormData: newData }),

    loadingTowerFloorData: 'idle',

    uploadingStatus: 'idle',

    setResultData: (newData) => set({ resultData: newData }),

    setUploadingStatus: (newStatus) => set({ uploadingStatus: newStatus }),

    fetchTowerFloorData: async (projectId) => {
      set({ loadingTowerFloorData: 'loading' });
      try {
        const response = await axiosClient.get<{
          data: Response[];
        }>('/forms/getUMUnitNames', {
          params: { project_id: projectId },
        });
        const units: TowerFloorDataType[] = [];
        const selectedUnits: SelectedTowerFloorUnitDataType = {};
        let options: {
          value: number;
          label: string;
        }[] = [];
        response.data.data?.map((towerFloorData) => {
          selectedUnits[towerFloorData.tower_id] = { selectedUnits: {} };
          units.push({
            towerId: towerFloorData.tower_id,
            towerName: towerFloorData.tower_name,
            towerType: startCase(towerFloorData.type),
            floorsUnits: towerFloorData.floors_units.map((floorUnits) => ({
              floorId: floorUnits.floor_id,
              units: floorUnits.units.map((unitItem) => ({
                fullUnitName: unitItem.full_unit_name,
                unitNumber: unitItem.unit_number,
                unitType: null,
              })),
              selectedUnits: [],
            })),
          });
          options = units.map((item) => ({
            value: item.towerId,
            label: `${item.towerId}: ${item.towerName}`,
          }));
        });
        set({ towerFloorFormData: units });
        set({ towerOptions: options });
        set({ loadingTowerFloorData: 'complete' });
      } catch (error) {
        set({ loadingTowerFloorData: 'error' });
        console.log(error);
      }
    },

    resetTowerFloorData: () =>
      set({ towerFloorFormData: [], loadingTowerFloorData: 'idle' }),
  }))
);

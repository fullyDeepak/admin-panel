import { IMAGE_PATH_PREFIX } from '@/data/CONSTANTS';
import { ImageStatsData } from '@/types/types';
import axiosClient from '@/utils/AxiosClient';
import { produce } from 'immer';
import { startCase } from 'lodash';
import { SingleValue } from 'react-select';
import { create } from 'zustand';

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

interface UnitResponse {
  project_id: number;
  tower_id: number;
  unit_type: number;
  s3_path: string;
  floor_units: {
    units: string[];
    floor_id: number;
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
      unitType: string | null;
      s3_path?: string;
      preview_url?: string;
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
        unitType?: string;
        fileName: string;
        uploadStatus: 'Success' | 'Failure';
      }[]
    | null;
  unitFPDataStore: { [key: string]: { tfu: string[][]; unitType: string } };
  showUnitModal: boolean;
  previewUnitDocsData: {
    tower_id: number;
    s3_path: string;
    preview_url: string;
    unitType: number | null;
    fName: string;
  } | null;
  unitFpTableData: { unit_type: number; s3_path: string }[] | null;
  statsData: ImageStatsData | null;
}

type Actions = {
  setSelectedProject: (_selection: State['selectedProject']) => void;
  setTowerFloorFormData: (_newData: TowerFloorDataType[]) => void;
  setSelectedImageTaggingType: (
    _select: State['selectedImageTaggingType']
  ) => void;
  setAvailableProjectData: (
    _newData: State['availableProjectData'] | []
  ) => void;
  setResultData: (_newData: State['resultData']) => void;
  setUploadingStatus: (_newStatus: State['uploadingStatus']) => void;
  fetchTowerFloorData: (_projectId: number) => void;
  resetTowerFloorData: () => void;
  setUnitFPDataStore: (
    _fileName: string,
    _newData: string[][],
    _unitType: string
  ) => void;
  setPreviewUnitDocsData: (_newData: State['previewUnitDocsData']) => void;
  setShowUnitModal: (_val: boolean) => void;
  resetAll: () => void;
  setStatsData: (_newData: ImageStatsData | null) => void;
};

export const useImageFormStore = create<State & Actions>()((set, get) => ({
  // Initial state

  selectedProject: undefined,
  towerFloorFormData: [] as TowerFloorDataType[],
  towerOptions: [],
  selectedImageTaggingType: null,
  availableProjectData: [],
  resultData: null,
  showUnitModal: false,
  previewUnitDocsData: null,
  unitFpTableData: null,
  loadingTowerFloorData: 'idle' as 'idle' | 'loading' | 'complete' | 'error',
  uploadingStatus: 'idle' as 'idle' | 'running' | 'complete' | 'error',
  unitFPDataStore: {},
  statsData: null,

  setSelectedProject: (select) => set({ selectedProject: select }),
  setSelectedImageTaggingType: (select) =>
    set({ selectedImageTaggingType: select }),

  setAvailableProjectData: (newData) => set({ availableProjectData: newData }),

  setTowerFloorFormData: (newData) => set({ towerFloorFormData: newData }),

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
      let units: TowerFloorDataType[] = [];
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
      if (get().selectedImageTaggingType?.value === 'unit-fp') {
        const unitResponse = await axiosClient.get<{
          data: UnitResponse[];
        }>('/forms/imgTag/unit', {
          params: { project_id: projectId },
        });

        set({ unitFpTableData: unitResponse.data.data });

        units = produce(units, (draft) => {
          draft.forEach((tfuData) => {
            unitResponse.data.data.forEach((unitRes) => {
              if (tfuData.towerId === unitRes.tower_id) {
                tfuData.floorsUnits.forEach((flUnit) => {
                  unitRes.floor_units.forEach((flUnitRes) => {
                    if (flUnitRes.floor_id === flUnit.floorId) {
                      flUnit.units.forEach((unitItem) => {
                        if (flUnitRes.units.includes(unitItem.unitNumber)) {
                          unitItem.unitType = unitRes.unit_type.toString();
                          unitItem.preview_url =
                            IMAGE_PATH_PREFIX + unitRes.s3_path;
                          unitItem.s3_path = unitRes.s3_path;
                        }
                      });
                    }
                  });
                });
              }
            });
          });
        });
      }

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
  setUnitFPDataStore: (fileName, newData, unitType) => {
    const prevData = get().unitFPDataStore;
    prevData[fileName] = { tfu: newData, unitType: unitType };
    set({ unitFPDataStore: prevData });
  },
  setPreviewUnitDocsData: (newData) => {
    set({ previewUnitDocsData: newData });
  },
  setShowUnitModal: (value) => {
    set({ showUnitModal: value });
  },
  resetAll: () => {
    set({
      selectedProject: undefined,
      towerFloorFormData: [] as TowerFloorDataType[],
      towerOptions: [],
      selectedImageTaggingType: null,
      availableProjectData: [],
      resultData: null,
      showUnitModal: false,
      previewUnitDocsData: null,
      unitFpTableData: null,
      loadingTowerFloorData: 'idle',
      uploadingStatus: 'idle',
      unitFPDataStore: {},
    });
  },
  setStatsData: (newData) => set({ statsData: newData }),
}));

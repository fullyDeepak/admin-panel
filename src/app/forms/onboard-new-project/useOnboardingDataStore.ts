import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { ProjectCordWithinVillage } from '../village-project-cleaner/MapUI';

export interface OnboardingDataType {
  selectedDistrict: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedMandal: SingleValue<{
    label: string;
    value: number;
  }> | null;
  selectedVillage: SingleValue<{
    label: string;
    value: number;
  }> | null;
  projectType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  projectSourceType: 'RERA' | 'TEMP' | 'HYBRID' | null;
  selectedTempProjects: {
    label: string;
    value: string;
  }[];
  selectedReraProjects: {
    label: string;
    value: string;
  }[];
  amenities: {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  mainProjectName: string;
  layoutTags: {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  colonyTags: {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  mapLayers: string[];
  isLuxuryProject: boolean;
  houseMasterLocalities: string[];
  core_door_number_string: string;
  keywordType: {
    label: string;
    value: string;
  } | null;
  landlordKeywords: string[];
  developerKeywords: string[];
  clubhouse_area: string;
  mapData: ProjectCordWithinVillage['data'] | null;
  mapInputValue: string;
}

export interface TempProjectSourceData {
  id: string;
  name: string;
  is_rera_approved: boolean;
  project_category: string;
  project_subtype: string;
  developer_id: any;
  village_id: number;
  land_area: any;
  total_unit_count: any;
  status: any;
  display_project_type: string;
  developers: Developer[];
  keywords: Keyword[];
  party_keywords: PartyKeyword[];
  root_docs: RootDoc[];
  municipal_door_numbers: MunicipalDoorNumber[];
  geojson_data: GeojsonDaum[];
}

export interface Developer {
  temp_project_id: string;
  developer_id: number;
  jv_id: any;
  is_jv: boolean;
}

export interface Keyword {
  project_id: string;
  keyword: string;
  keyword_type: string;
  attached: boolean;
}

export interface PartyKeyword {
  project_id: string;
  keyword_type: string;
  keywords: string[];
}

export interface RootDoc {
  project_id: string;
  doc_id: string;
  deed_type: string;
  occurrence_count: string;
  cp1: string;
  cp2: string;
  extent: string;
  area_attach: boolean;
  doc_id_schedule: string;
  project_attach: boolean;
}

export interface MunicipalDoorNumber {
  project_id: string;
  core_string: string;
  unit_numbers: string[];
  occurrence_count: number;
}

export interface GeojsonDaum {
  project_id: string;
  village_id: number;
  place_id: string;
  full_address: string;
  road: any;
  colony: any;
  locality: any;
  city: any;
  pin_code: number;
  geom_point: GeomPoint;
}

export interface GeomPoint {
  type: string;
  crs: Crs;
  coordinates: number[];
}

export interface Crs {
  type: string;
  properties: Properties;
}

export interface Properties {
  name: string;
}

interface Actions {
  updateOnboardingData: (_newDetails: Partial<OnboardingDataType>) => void;
  addTempProjectSourceData: (
    _projectId: string,
    _newData: TempProjectSourceData
  ) => void;
}

interface Store extends Actions {
  onboardingData: OnboardingDataType;
  formStepsList: ['Step 1', 'Step 2', 'Preview'];
  formSteps: 'Step 1' | 'Step 2' | 'Preview';
  tempProjectSourceData: { [temp_project_id: string]: TempProjectSourceData };
  setFormSteps: (_step: Store['formSteps']) => void;
}

const INITIAL_STATE: OnboardingDataType = {
  selectedDistrict: null,
  selectedMandal: null,
  selectedVillage: null,
  projectType: null,
  projectSubType: null,
  projectSourceType: null,
  selectedTempProjects: [],
  selectedReraProjects: [],
  mainProjectName: '',
  layoutTags: [],
  colonyTags: [],
  mapLayers: [],
  isLuxuryProject: false,
  houseMasterLocalities: [],
  core_door_number_string: '',
  keywordType: null,
  landlordKeywords: [],
  developerKeywords: [],
  amenities: [],
  clubhouse_area: '',
  mapData: [],
  mapInputValue: '',
};

export const useOnboardingDataStore = create<Store>()(
  immer((set) => ({
    onboardingData: INITIAL_STATE,
    formSteps: 'Step 1' as Store['formSteps'],
    formStepsList: ['Step 1', 'Step 2', 'Preview'] as Store['formStepsList'],
    tempProjectSourceData: {},
    addTempProjectSourceData: (project_id, newData) =>
      set((prev) => {
        prev.tempProjectSourceData = {
          ...prev.tempProjectSourceData,
          [project_id]: newData,
        };
      }),
    updateOnboardingData: (newDetails) =>
      set((prev) => {
        prev.onboardingData = { ...prev.onboardingData, ...newDetails };
      }),
    setFormSteps: (step) => set({ formSteps: step }),
  }))
);

import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';
import { ProjectCordWithinVillage } from '../village-project-cleaner/MapUI';
import { FeatureCollection } from 'geojson';

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
  selectedTempProject: {
    label: string;
    value: string;
  } | null;
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
  mapGeojsonData: FeatureCollection | null;
  coreDoorNumberString: string[];
  suggestedSurvey: string[];
  suggestedPlot: string[];
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
  raw_apartment_names: string[];
  developers?: Developer[];
  keywords?: Keyword[];
  party_keywords?: PartyKeyword[];
  root_docs?: RootDoc[];
  municipal_door_numbers?: MunicipalDoorNumber[];
  geojson_data?: GeojsonDaum[];
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
  is_attached: boolean;
}

export interface PartyKeyword {
  project_id: string;
  keyword_type: string;
  keywords: string[];
}

export interface RootDoc {
  doc_id: string;
  occurrence_count: string;
}

export interface MunicipalDoorNumber {
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
  formStepsList: [
    'Static Data',
    'Geo-Data',
    'Developer Tagging',
    'ETL For Project',
    'Tower - Unit',
    'HM Matcher',
    'Preview',
  ];
  currentFormStep: Store['formStepsList'][number];
  tempProjectSourceData: { [temp_project_id: string]: TempProjectSourceData };
  setFormSteps: (_step: Store['currentFormStep']) => void;
  resetData: () => void;
}

const INITIAL_STATE: OnboardingDataType = {
  selectedDistrict: null,
  selectedMandal: null,
  selectedVillage: null,
  projectType: null,
  projectSubType: null,
  projectSourceType: null,
  selectedTempProject: null,
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
  mapGeojsonData: null,
  coreDoorNumberString: [],
  suggestedSurvey: [],
  suggestedPlot: [],
};

export const useOnboardingDataStore = create<Store>()(
  immer((set) => ({
    onboardingData: INITIAL_STATE,
    currentFormStep: 'Static Data' as Store['currentFormStep'],
    formStepsList: [
      'Static Data',
      'Geo-Data',
      'Developer Tagging',
      'ETL For Project',
      'Tower - Unit',
      'HM Matcher',
      'Preview',
    ] as Store['formStepsList'],
    tempProjectSourceData: {},
    addTempProjectSourceData: (project_id, newData) =>
      set((prev) => {
        prev.tempProjectSourceData = {
          [project_id]: newData,
        };
      }),
    updateOnboardingData: (newDetails) =>
      set((prev) => {
        prev.onboardingData = { ...prev.onboardingData, ...newDetails };
      }),
    setFormSteps: (step) => set({ currentFormStep: step }),
    resetData: () =>
      set((prev) => ({
        onboardingData: {
          ...prev.onboardingData,
          projectType: null,
          projectSubType: null,
          projectSourceType: null,
          selectedTempProject: null,
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
        },
        tempProjectSourceData: {},
      })),
  }))
);

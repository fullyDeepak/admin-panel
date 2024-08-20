import { SingleValue } from 'react-select';

export interface GetTowerUnitConfigDetails {
  id: number;
  config: string;
  tower_id: number;
  max_built: number;
  min_built: number;
  project_id: number;
}

interface GetProjectETLTagDataType {
  village_id: number;
  doc_id: string[];
  doc_id_not_equals: string[];
  root_docs: string[];
  apartment_contains: string[];
  counterparty_contains: string[];
  aptSurveyPlotDetails: boolean;
  counterpartySurveyPlotDetails: boolean;
  locality_contains: string[];
  ward_block: string[];
  locality_plot: string[];
  survey_equals: string[];
  plot_equals: string[];
  survey_contains: string[];
  plot_contains: string[];
  door_no_start: string[];
  apt_name_not_contains: string[];
  single_unit: boolean;
  etl_pattern: string;
  locality_wb_plot: string;
}

export interface GetTowerDetails {
  etl_tower_name: string;
  tower_name_alias: string;
  type: string;
  display_tower_type: string;
  phase: string;
  rera_id: string;
  tower_id: number;
  max_floor: string;
  min_floor: string;
  unit_configs: GetTowerUnitConfigDetails[];
  tower_door_no: string;
  ground_floor_name: string;
  exception_unit_nos: string;
  delete_full_unit_nos: string;
  ground_floor_unit_no_max: string;
  ground_floor_unit_no_min: string;
  typical_floor_unit_no_max: string;
  typical_floor_unit_no_min: string;
}

export interface GetProjectDetails {
  project_id: number;
  project_name: string;
  project_category: string;
  project_subtype: string;
  project_layout: string;
  developer_id: number;
  developer_name: string;
  developer_group_name: string;
  village_id: number;
  st_asgeojson: string;
  project_description: string;
  localities: string;
  amenities: {
    id: number;
    amenity: string;
  }[];
  towers: GetTowerDetails[];
  ProjectETLTagDataType: GetProjectETLTagDataType[];
  rera_id: string | null;
  developer_keywords: string[];
  landlord_keywords: string[];
  display_project_type: string;
}

export interface FormProjectETLTagDataType {
  id: number;
  village:
    | {
        label: string;
        value: number;
      }
    | undefined;
  docId: string[];
  docIdNotEquals: string[];
  rootDocs: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  aptSurveyPlotDetails: boolean;
  counterpartySurveyPlotDetails: boolean;
  localityContains: string[];
  wardBlock: string[];
  localityPlot: string[];
  surveyEquals: string[];
  plotEquals: string[];
  surveyContains: string[];
  plotContains: string[];
  doorNoStartWith: string[];
  aptNameNotContains: string[];
  singleUnit: boolean;
  etlPattern: string;
}

export interface FormProjectDataType {
  projectName: string;
  layoutName: string;
  developer: string;
  developerGroup: string;
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
    | undefined;
  projectDesc: string;
  amenitiesTags: readonly {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  localities: { label: string; value: string }[];
  keywordType: SingleValue<{ label: string; value: string }> | undefined;
  landlordKeywords: string[];
  developerKeywords: string[];
  selectedProjectStatusTowers: {
    label: string;
    value: number;
  }[];
  selectedProjectStatusType: {
    label: string;
    value: string;
  } | null;
}
export interface FormEtlUnitConfigType {
  configName: string;
  minArea: number;
  maxArea: number;
}

export interface FormTowerDetailType {
  id: number;
  projectPhase: number;
  reraId: string;
  etlTowerName: string;
  towerNameAlias;
  towerDoorNo: string;
  minFloor: number | string;
  maxFloor: number | string;
  groundFloorName: string;
  groundFloorUnitNoMin: number | string;
  groundFloorUnitNoMax: number | string;
  typicalFloorUnitNoMin: number | string;
  typicalFloorUnitNoMax: number | string;
  deleteFullUnitNos: string;
  exceptionUnitNos: string;
  etlUnitConfigs: FormEtlUnitConfigType[];
  validTowerUnits: string[][] | null;
}

export type ReraDMLVTableData = {
  id: number;
  project_name: string;
  district_id: number;
  clean_district_name: string;
  mandal: string;
  mandal_id: string;
  clean_mandal_name: string;
  locality: string;
  village: string;
  village_id: string;
  clean_village_name: string;
  clean_survey_number: string;
  clean_plot_number: string;
};

export type ImageStatsData = {
  project_res: {
    project_id: number;
    project_docs: {
      brochure: {
        s3_path: string;
        preview_url: string;
        file_type: 'image' | 'pdf';
      }[];
      project_image: {
        s3_path: string;
        preview_url: string;
        file_type: 'image' | 'pdf';
      }[];
      project_master_plan: {
        s3_path: string;
        preview_url: string;
        file_type: 'image' | 'pdf';
      }[];
    };
  };
  tower_unit_res: {
    tower_id: number;
    tower_name: string;
    tower_docs:
      | {
          s3_path: string;
          preview_url: string;
          file_type: 'image' | 'pdf';
          doc_type: string;
        }[]
      | null;
    total_unit_count: number;
    tagged_unit_count: number;
  }[];
};

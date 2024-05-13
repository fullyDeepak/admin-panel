import { SingleValue } from 'react-select';

export interface GetProjectTowerUnitConfigDetails {
  id: number;
  config: string;
  tower_id: number;
  max_built: number;
  min_built: number;
  project_id: number;
}

export interface GetProjectTowerDetails {
  name: string;
  type: string;
  phase: string;
  rera_id: string;
  tower_id: number;
  max_floor: string;
  min_floor: string;
  unit_configs: GetProjectTowerUnitConfigDetails[];
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
  apartment_contains: string[];
  counterparty_contains: string[];
  plot_equals: string[];
  survey_contains: string[];
  survey_equals: string[];
  doc_id: string[];
  linked_doc: string[];
  door_no_start: string[];
  apt_name_not_contains: string[];
  locality_wb_plot: string[];
  amenities: {
    id: number;
    amenity: string;
  }[];
  surveys: string[];
  plots: string[];
  towers: GetProjectTowerDetails[];
  aptsurveyplotdetails: boolean;
  counterpartysurveyplotdetails: boolean;
  locality_wb_plot: string[];
  door_no_start: string[];
  apt_name_not_contains: string[];
  plot_contains: string[];
  single_unit: boolean;
  tower_pattern: string;
  floor_pattern: string;
  unit_pattern: string;
  localities: string;
}

export interface FormETLTagDataType {
  docId: string[];
  docIdNotContains: string[];
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
  towerPattern: string;
  floorPattern: string;
  unitPattern: string;
}

export interface FormProjectTaggingType extends FormETLTagDataType {
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
  amenitiesTags: {
    label: string;
    value: string | number;
    __isNew__?: boolean;
  }[];
  localities: { label: string; value: string }[];
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
  towerName: string;
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

export type reraDMLVTableData = {
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

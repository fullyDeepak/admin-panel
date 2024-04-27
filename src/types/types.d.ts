import { SingleValue } from 'react-select';

export interface ProjectTowerTagging {
  state_id: SingleValue<{
    label: string;
    value: number;
  }>;
  district_id: SingleValue<{
    label: string;
    value: number;
  }>;
  mandal_id: SingleValue<{
    label: string;
    value: number;
  }>;
  village_id: SingleValue<{
    label: string;
    value: number;
  }>;
  projectName: string;
  layoutName: string;
  reraId: string;
  developer: string;
  developerGroup: string;
  projectType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectSubType1: SingleValue<{
    label: string;
    value: string;
  }>;
  projectSubType2: SingleValue<{
    label: string;
    value: string;
  }>;
  status: SingleValue<{
    label: string;
    value: string;
  }>;
  preRera: string;
  projectBrief: string;
  numberOfUnits: string;
  projectSize_builtUp: string;
  avgFloorplate: string;
  avgFloorHeight: string;
  yearCompleted: string;
  micromarket: string;
  landArea: string;
  amenitiesTags: string;
  surveyEqual: string;
  surveyContains: string;
  plotEqual: string;
  apartmentContains: string;
  counterpartyContains: string;
  towers: string;
  towerCoordinates: string;
  studioMin: string;
  studioMax: string;
  oneBhkMin: string;
  oneBhkMax: string;
  onePtFiveBhkMin: string;
  onePtFiveBhkMax: string;
  twoBhkMin: string;
  twoBhkMax: string;
  twoPtFiveBhmMin: string;
  twoPtFiveBhmMax: string;
  threeBhkMin: string;
  threeBhkMax: string;
  threePtFiveBhkMin: string;
  threePtFiveBhkMax: string;
  fourBhkMin: string;
  fourBhkMax: string;
  fiveBhkPlusMin: string;
  fiveBhkPlusMax: string;
}

export class ProjectTowerTaggingData {
  state_id: SingleValue<{
    label: null;
    value: null;
  }>;
  district_id: SingleValue<{
    label: null;
    value: null;
  }>;
  mandal_id: SingleValue<{
    label: null;
    value: null;
  }>;
  village_id: SingleValue<{
    label: null;
    value: null;
  }>;
  projectName: null;
  layoutName: null;
  reraId: null;
  developer: null;
  developerGroup: null;
  projectType: SingleValue<{
    label: null;
    value: null;
  }>;
  projectSubType1: SingleValue<{
    label: null;
    value: null;
  }>;
  projectSubType2: SingleValue<{
    label: null;
    value: null;
  }>;
  status: SingleValue<{
    label: null;
    value: null;
  }>;
  preRera: null;
  projectBrief: null;
  nullOfUnits: null;
  projectSize_builtUp: null;
  avgFloorplate: null;
  avgFloorHeight: null;
  yearCompleted: null;
  micromarket: null;
  landArea: null;
  amenitiesTags: null;
  surveyEqual: null;
  surveyContains: null;
  plotEqual: null;
  apartmentContains: null;
  counterpartyContains: null;
  towers: null;
  towerCoordinates: null;
  studioMin: null;
  studioMax: null;
  oneBhkMin: null;
  oneBhkMax: null;
  onePtFiveBhkMin: null;
  onePtFiveBhkMax: null;
  twoBhkMin: null;
  twoBhkMax: null;
  twoPtFiveBhmMin: null;
  twoPtFiveBhmMax: null;
  threeBhkMin: null;
  threeBhkMax: null;
  threePtFiveBhkMin: null;
  threePtFiveBhkMax: null;
  fourBhkMin: null;
  fourBhkMax: null;
  fiveBhkPlusMin: null;
  fiveBhkPlusMax: null;
}

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
}

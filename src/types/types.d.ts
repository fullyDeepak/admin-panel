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
  localities: string[];
}

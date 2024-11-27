export interface ProjectOptionType {
  id: number;
  project_name: string;
  config_tagging: boolean;
}

export interface ErrorTypeCountRes {
  project_id: number;
  project_name: string;
  updated_value: string;
  total_generated_nits: string;
  matched_units: string;
  no_match: string;
  unit_count_manual: string;
  err_1: string;
  err_2: string;
  err_3: string;
  err_4: string;
}

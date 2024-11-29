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

export interface GET__RecordsByProjectResp {
  project_id: number;
  tower_id: number;
  floor_number: number;
  unit_number: string;
  full_unit_name: string;
  unit_type_id: string;
  generated_door_no: string;
  door_number_matched: boolean;
  ptin: string;
  master_house_number: string;
  door_number_type: string;
  first_um_hm_match_date: string;
  tm_matched: boolean;
  doc_id_schedule_list: string;
  last_ownership_change_doc: any;
  latest_owner_tm: string;
  name_matched: boolean;
  tm_hm_match_type: string;
  tm_hm_match_confidence: string;
  name_in_hm: boolean;
  error_type: string | null;
  match_source: any;
  verified: boolean;
  id: string;
  source: string;
  error_type_inferred: string;
}

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
  ptin: string;
  locality: string;
  house_no: string;
  current_owner: string | null;
  latest_owner_tm: string | null;
  generated_door_no: string;
  tm_matched: boolean;
  door_number_matched: boolean;
  name_in_hm: boolean;
  tm_records: GET__TMRecords[];
  error_type_inferred: string;
}

export interface GET__TMRecords {
  record_date: string | null;
  doc_id_schedule: string | null;
  deed_type: string | null;
  cp1_names: string | null;
  cp2_names: string | null;
}

export type ErrorTableDataType = {
  project_tower: string;
  full_unit_name: string;
  error_type: string;
  ptin: string;
  locality: string;
  door_no: string;
  current_owner: string;
  latest_tm_owner: string;
  generated_door_no: string;
  tm_count: string;
  record_date: string;
  doc_id_schedule: string;
  deed_type: string;
  cp1_names: string;
  cp2_names: string;
  subRows: {
    project_tower: string;
    full_unit_name: string;
    error_type: string;
    ptin: string;
    locality: string;
    door_no: string;
    current_owner: string;
    latest_tm_owner: string;
    generated_door_no: string;
    tm_count: string;
    record_date: string;
    doc_id_schedule: string;
    deed_type: string;
    cp1_names: string;
    cp2_names: string;
    subRows: ErrorTableDataType['subRows'];
  }[];
};

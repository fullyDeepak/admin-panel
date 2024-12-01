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

export type HMSearchResponseType = {
  ptin: string;
  source: string;
  district: string;
  ulb: string;
  locality: string;
  house_no: string;
  level_2_house_no: string;
  current_owner: string;
  phone_number: string;
  valid_pattern: boolean;
  h_no_project: string;
  h_no_tower: string;
  tower_string: string;
  unit_no: string;
  updated_at: string;
  updated_fields: string;
  email: string | null;
  project: string | null;
};

export type TMSearchResponseType = {
  doc_id: string;
  doc_id_schedule: string;
  village: string;
  clean_survey: string;
  clean_plot: any;
  project_id: number;
  extracted_apartment_name: string;
  tower_id: number;
  tower_type: string;
  extracted_tower: any;
  floor: string;
  unit_number: string;
  flat: string;
  municipal_door_number: any;
  asset_type: string;
  unit_configuration: string;
  facing: any;
  extent_raw: string;
  extent: number;
  salable_area_raw: string;
  salable_area: number;
  parking_area: any;
  linked_docs: string;
  registration_date: string;
  execution_date: string;
  presentation_date: string;
  deed_code: string;
  deed_type: string;
  internal_deed_code: string;
  internal_deed_type: string;
  market_value: number;
  consideration_value: number;
  party_details: string;
  sale_type: string;
  north: string;
  south: string;
  east: string;
  west: string;
  transaction_description: string;
  scraped_date: string;
  project_tag_type: string;
  tower_tag_type: string;
  record_source: string;
  broad_unit_type: string;
};

export interface NewProjectData {
  status: string;
  data: Data;
}

export interface Data {
  project_id: number;
  project_name: string;
  project_category: string;
  project_subtype: string;
  project_layout: any;
  developer:
    | {
        developer_master_id: number;
        jv_id: null;
        is_jv: false;
      }
    | {
        developer_master_id: null;
        jv_id: number;
        is_jv: true;
      };
  is_luxury_project: boolean;
  developer_name: any;
  st_asgeojson: any;
  project_description: any;
  display_project_type: any;
  rera_id: string[];
  localities: string[];
  landlord_keywords: string[];
  developer_keywords: string[];
  amenities: {
    id: number;
    amenity: string;
  }[];
  colonies: {
    id: number;
    colony: string;
  }[];
  micromarkets: {
    id: number;
    micromarket: string;
  }[];
  metadata: [
    {
      key: string;
      val: string;
      type: string;
    },
  ];
  towers: Tower[];
  root_docs: RootDoc[];
  ProjectETLTagDataType: ProjectEtlTagDataType[];
  geodata: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    geom_name: string | null;
    properties: {
      text: string | null;
      name: string | null;
    };
  }[];
}

export interface Tower {
  singleunit: boolean;
  type: string;
  phase: string;
  rera_id: string;
  tower_id: number;
  max_floor: any;
  min_floor: any;
  unit_configs: {
    id: number;
    config: string;
    tower_id: number;
    max_built: number;
    min_built: number;
    project_id: number;
  }[];
  rera_tower_id: string;
  tower_door_no: string;
  etl_tower_name: string;
  tower_name_alias: string;
  display_tower_type: string;
  ground_floor_name: string;
}

export interface RootDoc {
  execution_date: string;
  linked_docs: string;
  project_id: string;
  doc_id: string;
  doc_id_schedule: string;
  deed_type: string;
  occurrence_count: string;
  cp1: string;
  cp2: string;
  extent: string;
  project_attached: boolean;
  area_attached: boolean;
}

export interface ProjectEtlTagDataType {
  village: {
    id: number;
    name: string;
  };
  aptSurveyPlotDetails: boolean;
  counterpartySurveyPlotDetails: boolean;
  apartment_contains: string[];
  counterparty_contains: any[];
  plot_equals: string[];
  plot_contains: any[];
  survey_contains: any[];
  survey_equals: string[];
  doc_id: any[];
  root_docs: string[];
  linked_doc: any[];
  door_no_start: string[];
  apt_name_not_contains: any[];
  doc_id_not_equals: any[];
  locality_wb_plot: LocalityWbPlot[];
  single_unit: boolean;
  etl_pattern: EtlPattern | null;
}

export interface LocalityWbPlot {
  locality_contains: string[];
  ward_block: string[];
  locality_plot: string[];
}

export interface EtlPattern {
  pattern: string;
  flags: Flags;
}

export interface Flags {
  newLang?: boolean;
  singleUnit: boolean;
}

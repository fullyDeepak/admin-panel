export interface UnitCardDataToPost {
  unit_type_id: string;
  project_id: number;
  tower_id: string;
  rera_type: string | null;
  tower_type: string | null;
  unit_type: string | null;
  saleable_area: string | null;
  parking: string | null;
  extent: string | null;
  config: string | null;
  confident: boolean;
  wc_count: string | null;
  other_features: string | null;
  unit_floors: string;
  door_no_override: string | null;
  type_floors: string;
  type_units: string;
  facing: string | null;
  is_corner: boolean;
  s3_path: string;
}

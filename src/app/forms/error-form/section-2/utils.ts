import { ErrorTableDataType, GET__RecordsByProjectResp } from '../types';

export function makeErrorTableData(data: GET__RecordsByProjectResp[]) {
  const errorTableData: ErrorTableDataType[] = [];
  data.forEach((record) => {
    errorTableData.push({
      project_tower: record.project_id + '-' + record.tower_id,
      full_unit_name: record.full_unit_name,
      error_type: record.error_type_inferred,
      ptin: record.ptin,
      locality: record.locality,
      door_no: record.house_no,
      current_owner: record.current_owner,
      latest_tm_owner: record.latest_owner_tm,
      generated_door_no: record.generated_door_no,
      // dates: record.dates,
      // doc_ids: record.doc_id_schedule_list,
      // deed_type: record.deed_type,
      // cp1: record.cp1,
      // cp2: record.cp2,
    });
  });
  return errorTableData;
}

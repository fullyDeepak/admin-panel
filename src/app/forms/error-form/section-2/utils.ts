import { ErrorTableDataType, GET__RecordsByProjectResp } from '../types';

export function makeErrorTableData(data: GET__RecordsByProjectResp[]) {
  const errorTableData: ErrorTableDataType[] = [];
  data.forEach((record) => {
    const tmRecords = record.tm_records
      .filter(
        (tm) =>
          tm.record_date !== null &&
          tm.doc_id_schedule !== null &&
          tm.deed_type !== null &&
          tm.cp1_names !== null &&
          tm.cp2_names !== null
      )
      .map((item) => ({
        project_tower: '',
        full_unit_name: '',
        error_type: '',
        ptin: '',
        locality: '',
        door_no: '',
        current_owner: '',
        latest_tm_owner: '',
        generated_door_no: '',
        doc_id_schedule: item.doc_id_schedule!,
        record_date: item.record_date!.substring(0, 10),
        deed_type: item.deed_type!,
        cp1_names: item.cp1_names!,
        cp2_names: item.cp2_names!,
        tm_records: [],
      }));
    if (tmRecords.length === 1) {
      tmRecords[0].project_tower = record.project_id + '-' + record.tower_id;
      tmRecords[0].full_unit_name = record.full_unit_name;
      tmRecords[0].error_type = record.error_type_inferred;
      tmRecords[0].ptin = record.ptin;
      tmRecords[0].locality = record.locality;
      tmRecords[0].door_no = record.house_no;
      tmRecords[0].current_owner = record.current_owner || 'N/A';
      tmRecords[0].latest_tm_owner = record.latest_owner_tm || 'N/A';
      tmRecords[0].generated_door_no = record.generated_door_no;

      errorTableData.push(tmRecords[0]);
    } else if (tmRecords.length > 1 || tmRecords.length === 0) {
      errorTableData.push({
        project_tower: record.project_id + '-' + record.tower_id,
        full_unit_name: record.full_unit_name,
        error_type: record.error_type_inferred,
        ptin: record.ptin,
        locality: record.locality,
        door_no: record.house_no,
        current_owner: record.current_owner || 'N/A',
        latest_tm_owner: record.latest_owner_tm || 'N/A',
        generated_door_no: record.generated_door_no,
        tm_records: tmRecords,
      });
    }
  });
  return errorTableData;
}

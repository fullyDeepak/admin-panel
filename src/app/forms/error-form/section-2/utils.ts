import { ErrorTableDataType, GET__RecordsByProjectUnit } from '../types';

export function makeErrorTableData(data: GET__RecordsByProjectUnit[]) {
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
        tm_count: '',
        record_date: item.record_date!.substring(0, 10),
        doc_id_schedule: item.doc_id_schedule!,
        deed_type: item.deed_type!,
        cp1_names: item.cp1_names!,
        cp2_names: item.cp2_names!,
        subRows: [],
      }));

    if (tmRecords.length === 0) {
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
        tm_count: '0',
        record_date: '',
        doc_id_schedule: '',
        deed_type: '',
        cp1_names: '',
        cp2_names: '',
        subRows: [],
      });
    } else if (tmRecords.length > 0) {
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
        tm_count: tmRecords.length.toString(),
        record_date: tmRecords[0].record_date!.substring(0, 10),
        doc_id_schedule: tmRecords[0].doc_id_schedule!,
        deed_type: tmRecords[0].deed_type!,
        cp1_names: tmRecords[0].cp1_names!,
        cp2_names: tmRecords[0].cp2_names!,
        subRows: tmRecords.splice(1, tmRecords.length),
      });
    }
  });
  return errorTableData;
}

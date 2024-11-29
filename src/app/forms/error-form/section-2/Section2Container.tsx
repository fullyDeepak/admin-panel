'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { useEffect } from 'react';
import { GET__RecordsByProjectResp } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import FormControls from './FormControls';
import { uniqBy } from 'lodash';
import { Option, OptionValNum } from '@/types/types';
import { makeErrorTableData } from './utils';

export default function Section2Container() {
  const {
    errorFormData,
    setRecordsByProjectResp,
    updateErrorFormData,
    setErrorTableData,
  } = useErrorFormStore();

  const { data: recordsByProjectId } = useFetchData<
    GET__RecordsByProjectResp[]
  >(
    errorFormData.selectedMainProject?.value
      ? `error-correction/get-records-by-project-id?project_id=${errorFormData.selectedMainProject?.value}`
      : null
  );

  useEffect(() => {
    if (recordsByProjectId) {
      setRecordsByProjectResp(recordsByProjectId);
      const errorOptions: Option[] = [];
      const towerOptions: OptionValNum[] = [];
      const floorOptions: OptionValNum[] = [];
      const unitOptions: Option[] = [];
      recordsByProjectId.map((item) => {
        errorOptions.push({
          value: item.error_type_inferred,
          label: item.error_type_inferred,
        });
        towerOptions.push({
          value: item.tower_id,
          label: item.tower_id.toString(),
        });
        floorOptions.push({
          value: item.floor_number,
          label: item.floor_number.toString(),
        });
        unitOptions.push({
          value: item.unit_number,
          label: item.unit_number,
        });
      });
      updateErrorFormData({
        towerOptions: uniqBy(towerOptions, 'value'),
        floorOptions: uniqBy(floorOptions, 'value'),
        unitOptions: uniqBy(unitOptions, 'value'),
        errorOptions: uniqBy(errorOptions, 'value').sort((a, b) =>
          a.label.localeCompare(b.label)
        ),
      });
      setErrorTableData(makeErrorTableData(recordsByProjectId));
    }
  }, [recordsByProjectId]);

  return (
    <div className='w-full'>
      <FormControls />
    </div>
  );
}

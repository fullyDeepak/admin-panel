'use client';

import useFetchData from '@/app/hooks/useFetchData';
import { useEffect } from 'react';
import { GET__RecordsByProjectResp } from '../types';
import { useErrorFormStore } from '../useErrorFormStore';
import FormControls from './FormControls';
import { uniqBy } from 'lodash';

export default function Section2Container() {
  const {
    errorFormData,
    setRecordsByProjectResp,
    updateErrorFormData,
    setFilteredRecordsByProjectResp,
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
      setFilteredRecordsByProjectResp(recordsByProjectId);
      const towerOptions = uniqBy(
        recordsByProjectId.map((item) => ({
          value: item.tower_id,
          label: item.tower_id.toString(),
        })),
        'value'
      );
      const floorOptions = uniqBy(
        recordsByProjectId.map((item) => ({
          value: item.floor_number,
          label: item.floor_number.toString(),
        })),
        'value'
      );
      const unitOptions = uniqBy(
        recordsByProjectId.map((item) => ({
          value: item.unit_number,
          label: item.unit_number,
        })),
        'value'
      );
      const errorOptions = uniqBy(
        recordsByProjectId.map((item) => ({
          value: item.error_type_inferred,
          label: item.error_type_inferred,
        })),
        'value'
      ).sort((a, b) => a.label.localeCompare(b.label));
      updateErrorFormData({
        towerOptions: towerOptions,
        floorOptions: floorOptions,
        unitOptions: unitOptions,
        errorOptions: errorOptions,
      });
    }
  }, [recordsByProjectId]);

  return (
    <div className='w-full'>
      <FormControls />
    </div>
  );
}

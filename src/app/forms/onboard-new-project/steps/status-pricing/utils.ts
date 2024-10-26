import { getCurrentDate } from '@/lib/utils';
import { SingleValue } from 'react-select';
import { useTowerUnitStore } from '../../useTowerUnitStore';

export function handleProjectStatusSave(
  updateKey: 'booking' | 'pricing' | 'display_construction_status',
  selectedProjectStatusTowers: {
    label: string;
    value: number;
  }[],
  isAllSelected: boolean,
  value?: string,
  setValue?: React.Dispatch<React.SetStateAction<string>>,
  selectedDisplayStatus?: SingleValue<{
    label: string;
    value: string;
  }>
) {
  const { updateProjectStatus } = useTowerUnitStore.getState();
  const towers = isAllSelected
    ? ['0']
    : selectedProjectStatusTowers.map((item) => item.value.toString());
  if (updateKey === 'booking' && value && setValue) {
    const data: {
      updated_at: string;
      tower_id: string;
      updated_field: 'manual_bookings';
      updated_value: string;
    }[] = towers.map((item) => ({
      tower_id: item,
      updated_at: getCurrentDate(),
      updated_value: value,
      updated_field: 'manual_bookings',
    }));
    updateProjectStatus(updateKey, data);
    setValue('');
  } else if (updateKey === 'pricing' && value && setValue) {
    const data: {
      updated_at: string;
      tower_id: string;
      updated_field: 'price';
      updated_value: string;
    }[] = towers.map((item) => ({
      tower_id: item,
      updated_at: getCurrentDate(),
      updated_value: value,
      updated_field: 'price',
    }));
    updateProjectStatus(updateKey, data);
    setValue('');
  } else if (
    updateKey === 'display_construction_status' &&
    selectedDisplayStatus
  ) {
    const data: {
      updated_at: string;
      tower_id: string;
      updated_field: 'display_construction_status';
      updated_value: string;
    }[] = towers.map((item) => ({
      tower_id: item,
      updated_at: getCurrentDate(),
      updated_value: selectedDisplayStatus.value,
      updated_field: 'display_construction_status',
    }));
    console.log({ data });
    updateProjectStatus(updateKey, data);
  }
}

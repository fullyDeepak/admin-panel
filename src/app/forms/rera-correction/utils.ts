import { FilterFn } from '@tanstack/react-table';

export const sroTableColumns = [
  {
    header: 'Mandal ID',
    accessorKey: 'mandal_id',
  },
  {
    header: 'Mandal Name',
    accessorKey: 'mandal_name',
  },
  {
    header: 'Village ID',
    accessorKey: 'village_id',
  },
  {
    header: 'Village Name',
    accessorKey: 'village_name',
  },
];

export const dateRangeFilterFn: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  const rowValue = row.getValue(columnId);

  if (!filterValue || !filterValue.startDate || !filterValue.endDate) {
    return true; // If no filter is set, show all rows.
  }

  const rowDate = new Date(rowValue as string);
  const { startDate, endDate } = filterValue;

  return (
    (!startDate || rowDate >= new Date(startDate)) &&
    (!endDate || rowDate <= new Date(endDate))
  );
};

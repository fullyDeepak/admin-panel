import { ReraDMLVTableData } from '@/types/types';
import axiosClient from '@/utils/AxiosClient';
import { FilterFn } from '@tanstack/react-table';
import axios from 'axios';
import { uniqBy } from 'lodash';
import toast from 'react-hot-toast';

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

export function generateOptions(data: ReraDMLVTableData[]) {
  type OptionType = {
    label: string;
    value: string;
  };
  const optionsForProjects: {
    label: string;
    value: number;
  }[] = [];
  const cleanMandalOptions: OptionType[] = [];
  const rawMandalOptions: OptionType[] = [];
  const cleanVillageOptions: OptionType[] = [];
  const rawVillageOptions: OptionType[] = [];
  const localityOption: OptionType[] = [];
  const developerOption: OptionType[] = [];
  data.map((item) => {
    cleanMandalOptions.push({
      label: `${item.mandal_id}:${item.clean_mandal_name}`,
      value: `${item.mandal_id}:${item.clean_mandal_name}`,
    });
    optionsForProjects.push({
      label: `${item.id}:${item.project_name}`,
      value: item.id,
    });
    rawMandalOptions.push({
      label: item.mandal === '' ? 'BLANK' : item.mandal,
      value: item.mandal === '' ? 'BLANK' : item.mandal,
    });
    cleanVillageOptions.push({
      label: `${item.village_id}:${item.clean_village_name}`,
      value: `${item.village_id}:${item.clean_village_name}`,
    });
    rawVillageOptions.push({
      label: item.village === '' ? 'BLANK' : item.village,
      value: item.village === '' ? 'BLANK' : item.village,
    });
    localityOption.push({
      label: item.locality,
      value: item.locality,
    });
    developerOption.push({
      label: item.dev_name,
      value: item.dev_name,
    });
  });

  return {
    cleanMandalOptions: uniqBy(cleanMandalOptions, 'value'),
    rawMandalOptions: uniqBy(rawMandalOptions, 'value'),
    cleanVillageOptions: uniqBy(cleanVillageOptions, 'value'),
    rawVillageOptions: uniqBy(rawVillageOptions, 'value'),
    localityOption: uniqBy(localityOption, 'value'),
    optionsForProjects: uniqBy([], 'value'),
    developerOption: uniqBy(developerOption, 'value'),
  };
}

export async function postReraCleanData(data: ReraDMLVTableData[]) {
  const dataToPost: {
    projectId: number;
    mandalId: number | null;
    locality: string;
    devMid: number | null;
    devGid: number | null;
  }[] = [];

  data.map((item) => {
    dataToPost.push({
      projectId: item.id,
      mandalId: +item.mandal_id,
      locality: item.locality,
      devMid: +item.developer_master_id,
      devGid: item.dev_group_id,
    });
  });
  toast.promise(
    axiosClient.post('/forms/rera/clean-rera-data', { data: dataToPost }),
    {
      loading: 'Cleaning...',
      success: () => {
        return 'Data Cleaned ✨';
      },
      error: (err) => {
        console.log({ err });
        if (axios.isAxiosError(err)) {
          return (
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
          );
        }
        return JSON.stringify(err);
      },
    }
  );
}

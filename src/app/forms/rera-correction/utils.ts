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
  type OptionType = { label: string; value: string };
  type TempOptionType = { label: string; value: string; count: number };
  type FrequencyMap = Record<string, number>;
  type Frequencies = {
    dev: FrequencyMap;
    cleanMandal: FrequencyMap;
    rawMandal: FrequencyMap;
    cleanVillage: FrequencyMap;
    rawVillage: FrequencyMap;
    locality: FrequencyMap;
  };

  const tempCleanMandalOptions: Record<string, TempOptionType> = {};
  const tempRawMandalOptions: Record<string, TempOptionType> = {};
  const tempCleanVillageOptions: Record<string, TempOptionType> = {};
  const tempRawVillageOptions: Record<string, TempOptionType> = {};
  const tempLocalityOptions: Record<string, TempOptionType> = {};
  const tempDeveloperOptions: Record<string, TempOptionType> = {};
  const optionsForProjects: OptionType[] = [];

  const frequencies = data.reduce<Frequencies>(
    (acc, item) => {
      acc.dev[item.dev_name] = (acc.dev[item.dev_name] || 0) + 1;
      acc.cleanMandal[item.clean_mandal_name] =
        (acc.cleanMandal[item.clean_mandal_name] || 0) + 1;
      acc.rawMandal[item.mandal] = (acc.rawMandal[item.mandal] || 0) + 1;
      acc.cleanVillage[item.clean_village_name] =
        (acc.cleanVillage[item.clean_village_name] || 0) + 1;
      acc.rawVillage[item.village] = (acc.rawVillage[item.village] || 0) + 1;
      acc.locality[item.locality] = (acc.locality[item.locality] || 0) + 1;
      return acc;
    },
    {
      dev: {},
      cleanMandal: {},
      rawMandal: {},
      cleanVillage: {},
      rawVillage: {},
      locality: {},
    }
  );

  data.forEach((item) => {
    tempCleanMandalOptions[item.clean_mandal_name] = {
      label: `${item.mandal_id}:${item.clean_mandal_name}:(${frequencies.cleanMandal[item.clean_mandal_name]})`,
      value: `${item.mandal_id}:${item.clean_mandal_name}`,
      count: frequencies.cleanMandal[item.clean_mandal_name],
    };
    tempRawMandalOptions[item.mandal || 'BLANK'] = {
      label: item.mandal
        ? `${item.mandal}:(${frequencies.rawMandal[item.mandal]})`
        : `BLANK:(${frequencies.rawMandal['']})`,
      value: item.mandal || 'BLANK',
      count: frequencies.rawMandal[item.mandal],
    };
    tempCleanVillageOptions[item.clean_village_name] = {
      label: `${item.village_id}:${item.clean_village_name}:(${frequencies.cleanVillage[item.clean_village_name]})`,
      value: `${item.village_id}:${item.clean_village_name}`,
      count: frequencies.cleanVillage[item.clean_village_name],
    };
    tempRawVillageOptions[item.village || 'BLANK'] = {
      label: item.village
        ? `${item.village}:(${frequencies.rawVillage[item.village]})`
        : 'BLANK',
      value: item.village || 'BLANK',
      count: frequencies.rawVillage[item.village],
    };
    tempLocalityOptions[item.locality] = {
      label: `${item.locality}:(${frequencies.locality[item.locality]})`,
      value: item.locality,
      count: frequencies.locality[item.locality],
    };
    tempDeveloperOptions[item.dev_name] = {
      label: `${item.dev_name}:(${frequencies.dev[item.dev_name]})`,
      value: item.dev_name,
      count: frequencies.dev[item.dev_name],
    };
    optionsForProjects.push({
      label: `${item.id}:${item.project_name}`,
      value: item.id,
    });
  });

  const toSortedArray = (tempOptions: Record<string, TempOptionType>) =>
    Object.values(tempOptions).sort((a, b) => b.count - a.count);

  const results = {
    cleanMandalOptions: toSortedArray(tempCleanMandalOptions),
    rawMandalOptions: toSortedArray(tempRawMandalOptions),
    cleanVillageOptions: toSortedArray(tempCleanVillageOptions),
    rawVillageOptions: toSortedArray(tempRawVillageOptions),
    localityOption: toSortedArray(tempLocalityOptions),
    optionsForProjects: uniqBy(optionsForProjects, 'value'),
    developerOption: toSortedArray(tempDeveloperOptions),
  };

  return results;
}

export async function postReraCleanData(data: ReraDMLVTableData[]) {
  const dataToPost: {
    projectId: string;
    mandalId: number | null;
    villageId: number | null;
    locality: string;
    devMid: number | null;
    devGid: number | null;
  }[] = [];

  data.map((item) => {
    dataToPost.push({
      projectId: item.id.replace('T', '').replace('R', ''),
      mandalId: +item.mandal_id,
      villageId: +item.village_id,
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

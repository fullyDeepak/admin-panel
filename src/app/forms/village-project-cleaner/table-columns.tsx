import { createColumnHelper } from '@tanstack/react-table';
import _ from 'lodash';
import Select, { SingleValue } from 'react-select';
export type RawAptDataRow = {
  district_name: string;
  district_id: string;
  mandal_name: string;
  mandal_id: string;
  village_name: string;
  village_id: string;
  raw_apt_name: string;
  clean_survey: string;
  plot_count: string;
  occurrence_count: string;
  plots: string;
  temp_project_id: string;
};

const columnHelper = createColumnHelper<RawAptDataRow>();
const cleaningColumnHelper = createColumnHelper<
  RawAptDataRow & {
    clean_apt_name: string;
    selected_project_id: string;
    project_category: string;
    project_subtype: string;
  }
>();

export const rawAptSelectionColumns = [
  columnHelper.accessor('raw_apt_name', {
    header: 'Raw Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('raw_apt_name')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
    filterFn: (row, columnId, filter: string) => {
      const negativeSearchTerm = filter.startsWith('!');
      const searchTerm = negativeSearchTerm ? filter.slice(1) : filter;
      if (searchTerm) {
        const match = (row.getValue(columnId) as string)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return negativeSearchTerm ? !match : match;
      }
      return true;
    },
  }),
  columnHelper.accessor('clean_survey', {
    header: 'Clean Survey',
    cell: ({ row }) => (
      <p className='break min-w-48 max-w-7xl text-pretty break-all'>
        {row.getValue('clean_survey')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
    filterFn: 'includesString',
  }),
  columnHelper.accessor('occurrence_count', {
    header: 'Occurrence Count',
    cell: ({ row }: any) => (
      <p className='min-w-48 max-w-7xl text-pretty break-all'>
        {row.original.occurrence_count.toString()}
      </p>
    ),
    meta: {
      filterVariant: 'range',
    },
    filterFn: 'inNumberRange',
  }),
  columnHelper.accessor('plots', {
    header: 'Plots',
    cell: ({ row }) => (
      <p className='break min-w-48 max-w-7xl text-pretty break-all'>
        {row.getValue('plots')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
    filterFn: 'includesString',
  }),
  columnHelper.accessor('plot_count', {
    header: 'Plot Count',
    cell: ({ row }) => (
      <p className='min-w-48 max-w-7xl text-pretty break-all'>
        {row.getValue('plot_count')}
      </p>
    ),
    meta: {
      filterVariant: 'range',
    },
    filterFn: 'inNumberRange',
  }),
];

export const cleanedRowsColumns = [
  cleaningColumnHelper.accessor('raw_apt_name', {
    header: 'Raw Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('raw_apt_name')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('plot_count', {
    header: 'Plot Count',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('plot_count')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('occurrence_count', {
    cell: ({ row }: any) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.original.occurrence_count.toString()}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('clean_apt_name', {
    header: 'Clean Apartment Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('clean_apt_name')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('selected_project_id', {
    header: 'Selected Project Id',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('selected_project_id')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('project_category', {
    header: 'Project Category',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('project_category')}
      </p>
    ),
  }),
  cleaningColumnHelper.accessor('project_subtype', {
    header: 'Project Sub-Type',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('project_subtype')}
      </p>
    ),
  }),
];

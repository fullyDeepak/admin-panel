'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useState } from 'react';
import useETLDataStore from '../../useETLDataStore';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import TanstackReactTable from './Table';
const columnHelper = createColumnHelper<{
  execution_date: Date;
  linked_docs: string;
  project_id: string;
  doc_id: string;
  deed_type: string;
  occurrence_count: string;
  cp1: string;
  cp2: string;
  extent: string;
  area_attached: boolean;
  doc_id_schedule: string;
  project_attached: boolean;
}>();

export default function DeveloperTagging() {
  // 3 queries
  useState(0);
  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();
  const { projectFormETLTagData, updateProjectETLTagData } = useETLDataStore();

  const docColumns = [
    columnHelper.accessor('doc_id', {
      header: 'Doc Id',
      cell: ({ row }) => <p className='w-[80px]'>{row.getValue('doc_id')}</p>,
      meta: {
        filterVariant: 'text',
      },
    }),
    columnHelper.accessor('deed_type', {
      header: 'Deed Type',
      cell: ({ row }) => (
        <p className='whitespace-break-spacestext-pretty w-full text-xs'>
          {row.getValue('deed_type')}
        </p>
      ),
      meta: {
        filterVariant: 'text',
      },
    }),
    columnHelper.accessor('cp1', {
      header: 'CP1',
      cell: ({ row }) => (
        <p className='whitespace-break-spacestext-pretty w-full text-xs'>
          {row.getValue('cp1')}
        </p>
      ),
      meta: {
        filterVariant: 'text',
      },
    }),
    columnHelper.accessor('cp2', {
      header: 'CP2',
      cell: ({ row }) => (
        <p className='w-full whitespace-break-spaces text-pretty text-xs'>
          {row.getValue('cp2')}
        </p>
      ),
      meta: {
        filterVariant: 'text',
      },
    }),
    columnHelper.accessor('extent', {
      header: 'Extent',
      cell: ({ row }) => (
        <p className='whitespace-break-spacestext-pretty w-[80px] text-xs'>
          {row.getValue('extent')}
        </p>
      ),
      meta: {
        filterVariant: 'range',
      },
    }),
    columnHelper.accessor('occurrence_count', {
      header: 'Freq',
      cell: ({ row }) => (
        <p className='whitespace-break-spacestext-pretty w-[80px] text-xs'>
          {row.getValue('occurrence_count')}
        </p>
      ),
      meta: {
        filterVariant: 'range',
      },
    }),
    columnHelper.accessor('project_attached', {
      header: 'Project',
      cell: ({ row }) => (
        <input
          onChange={(e) => {
            updateOnboardingData({
              developmentAgreements: onboardingData.developmentAgreements.map(
                (ele) => {
                  if (ele.doc_id_schedule === row.getValue('doc_id_schedule')) {
                    return {
                      ...ele,
                      project_attached: !ele.project_attached,
                    };
                  }
                  return ele;
                }
              ),
            });
            e.target.checked
              ? updateProjectETLTagData(1, 'rootDocs', [
                  ...projectFormETLTagData.find((item) => item.id === 1)!
                    .rootDocs,
                  row.getValue('doc_id'),
                ])
              : updateProjectETLTagData(
                  1,
                  'rootDocs',
                  projectFormETLTagData
                    .find((item) => item.id === 1)!
                    .rootDocs.filter((item) => item !== row.getValue('doc_id'))
                );
          }}
          type='checkbox'
          className='checkbox no-animation cursor-pointer'
          checked={row.getValue('project_attached')}
        />
      ),
      meta: {
        filterVariant: 'boolean',
      },
    }),
    columnHelper.accessor('area_attached', {
      header: 'Area ',
      cell: ({ row }) => (
        <input
          onChange={(e) => {
            updateOnboardingData({
              developmentAgreements: onboardingData.developmentAgreements.map(
                (ele) => {
                  if (ele.doc_id_schedule === row.getValue('doc_id_schedule')) {
                    return {
                      ...ele,
                      area_attached: !ele.area_attached,
                    };
                  }
                  return ele;
                }
              ),
            });
            if (e.target.checked) {
              updateOnboardingData({
                rootDocArea:
                  onboardingData.rootDocArea +
                  +(row.getValue('extent') as number),
              });
            } else {
              updateOnboardingData({
                rootDocArea:
                  onboardingData.rootDocArea -
                  +(row.getValue('extent') as number),
              });
            }
          }}
          type='checkbox'
          className='checkbox no-animation cursor-pointer'
          checked={row.getValue('area_attached')}
        />
      ),
      meta: {
        filterVariant: 'boolean',
      },
    }),
    columnHelper.accessor('linked_docs', {
      header: 'Linked Docs',
      cell: ({ row }) => (
        <p className='w-[80px]'>{row.getValue('linked_docs')}</p>
      ),
      meta: {
        filterVariant: 'text',
      },
    }),
    columnHelper.accessor('execution_date', {
      header: 'Execution Date',
      cell: ({ row }) => (
        <p className='w-[80px]'>
          {format(row.getValue('execution_date') as Date, 'dd/MM/yyyy')}
        </p>
      ),
      meta: {
        filterVariant: 'text',
      },
      filterFn: (row, columnId, filterValue) => {
        const negativeSearchTerm = filterValue.includes('!');
        const searchTerm = negativeSearchTerm
          ? filterValue.slice(1)
          : filterValue;
        if (searchTerm) {
          const match = format(row.getValue(columnId) as Date, 'dd/MM/yyyy')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          return negativeSearchTerm ? !match : match;
        }
        return true;
      },
      sortingFn: 'datetime',
    }),
    columnHelper.accessor('doc_id_schedule', {
      header: 'Doc Id SCH',
      cell: ({ row }) => (
        <p className='w-[80px]'>{row.getValue('doc_id_schedule')}</p>
      ),
      meta: {
        filterVariant: 'text',
      },
    }),
  ];
  return (
    <>
      <div className='mt-10 flex w-full flex-col'>
        <h2 className='mt-10 self-center text-2xl md:text-3xl'>
          Tag Root Docs
        </h2>
        <div className=''>
          {/* Developemnt aggreements : /onboarding/root_docs/development-agreements */}
          <h2 className='mt-10 self-center text-xl md:text-2xl'>
            Development Agreements
          </h2>
          <div className='flex items-center justify-between'>
            <p>
              ROOT DOC AREA: {onboardingData.rootDocArea.toFixed(2)} SQ Yds
              (approx. {(onboardingData.rootDocArea / 4840).toFixed(2)} Acres)
            </p>
            <div className='flex flex-col gap-2'>
              <span>
                RERA Net Land Area:{' '}
                {(onboardingData.reraTotalLandArea * 1.196).toFixed(2)} SQ yds
                (approx. {(onboardingData.reraTotalLandArea / 4047).toFixed(2)}{' '}
                Acres)
              </span>
              <span>
                RERA Calculated Net Land Area:{' '}
                {(onboardingData.reraCalcNetLandArea * 1.196).toFixed(2)} SQ yds
                (approx.{' '}
                {(onboardingData.reraCalcNetLandArea / 4047).toFixed(2)} Acres)
              </span>
              <span>
                Map Calculated Land Area: {onboardingData.polygonArea} SQ Yds
                (approx. {(onboardingData.polygonArea / 4840).toFixed(2)} Acres)
              </span>
            </div>
          </div>
          <div>
            <TanstackReactTable
              data={onboardingData.developmentAgreements}
              columns={docColumns}
              showPagination={true}
            />
          </div>
          {/* Free From attacher based on village/survey/plot input : /onboarding/root_docs/free-doc-search */}
        </div>
      </div>
    </>
  );
}
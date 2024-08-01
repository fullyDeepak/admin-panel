'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { isEqual, uniqWith } from 'lodash';
import FetchDocs from './FetchDocs';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import ChipInput from '@/components/ui/Chip';
import {
  useCorrectionStore,
  useCorrectionStoreState,
} from './useCorrectionStore';
import { sroTableColumns } from './utils';
import ReraDropdown from './ReraDropdown';
import toast from 'react-hot-toast';
import axios from 'axios';

type SroResponse = {
  district_id: number;
  district_name: string;
  mandal_id: number;
  mandal_name: string;
  village_id: number;
  village_name: string;
};
const inputBoxClass =
  'w-full rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 ';
export default function ReraCorrectionPage() {
  const [pdfPreviewDivs, setPdfPreviewDivs] = useState<React.JSX.Element[]>([]);
  const { selectedProjects } = useReraCorrectionStore();

  const {
    selectedSroDistrict,
    selectedReraDistrict,
    selectedSroMandal,
    selectedReraMandal,
    selectedReraVillage,
    reraTableData,
    sroTableData,
    districtIdValue,
    mandalIdValue,
    villageIdValue,
  } = useCorrectionStoreState();

  const { setFormData } = useCorrectionStore();
  const queryClient = useQueryClient();

  const reraTableColumns = useMemo(
    () => [
      {
        header: 'Project ID',
        accessorKey: 'id',
      },
      {
        header: 'Project Name',
        accessorKey: 'project_name',
      },
      {
        header: 'District ID',
        accessorKey: 'district_id',
      },
      {
        header: 'Clean District',
        accessorKey: 'clean_district_name',
      },
      {
        header: 'Mandal',
        accessorKey: 'mandal',
      },
      {
        header: 'Mandal ID',
        accessorKey: 'mandal_id',
      },
      {
        header: 'Clean Mandal',
        accessorKey: 'clean_mandal_name',
      },
      {
        header: 'Locality',
        accessorKey: 'locality',
      },
      {
        header: 'Village',
        accessorKey: 'village',
      },
      {
        header: 'Village ID',
        accessorKey: 'village_id',
      },
      {
        header: 'Clean Village',
        accessorKey: 'clean_village_name',
      },
      {
        header: 'Clean Survey',
        accessorKey: 'clean_survey_number',
      },
      {
        header: 'Clean Plot',
        accessorKey: 'clean_plot_number',
      },
      {
        header: 'RERA Docs',
        cell: ({ row }: any) => (
          <FetchDocs
            projectIds={[row.original?.id]}
            pdfPreviewDivs={pdfPreviewDivs}
            setPdfPreviewDivs={setPdfPreviewDivs}
          />
        ),
      },
    ],
    []
  );

  const [surveyValue, setSurveyValue] = useState<string[]>([]);
  const [plotValue, setPlotValue] = useState<string[]>([]);

  // populate sro district dropdown
  const { isPending: loadingSroDistricts, data: sroDistrictOptions } = useQuery(
    {
      queryKey: ['sro-districts', selectedSroMandal],
      queryFn: async () => {
        const options = await fetchDropdownOption('districts', 'state', 36);
        return options.map((item) => ({
          label: `${item.value}:${item.label}`,
          value: item.value,
        }));
      },
      // staleTime: Infinity,
    }
  );

  // populate sro mandal dropdown on sro district selection
  const {
    isPending: loadingSroMandals,
    data: sroMandalOptions,
    refetch: refetchSroMandalOption,
  } = useQuery({
    queryKey: ['sro-mandals', selectedSroDistrict],
    queryFn: async () => {
      if (selectedSroDistrict !== undefined && selectedSroDistrict !== null) {
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: { district_id: selectedSroDistrict.value },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: -1 }];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.mandal_name}`,
            value: item.mandal_id,
          });
        });
        // setSroTableData(data);
        setFormData('sroTableData', data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  // populated sro village dropdown on sro mandal selection
  useQuery({
    queryKey: ['sro-villages', selectedSroMandal?.value],
    queryFn: async () => {
      if (selectedSroMandal !== undefined && selectedSroMandal !== null) {
        if (selectedSroMandal.value === -1) {
          refetchSroMandalOption();
          return true;
        }
        const response = await axiosClient.get<{ data: SroResponse[] }>(
          '/sro/getSroDMVById',
          {
            params: {
              district_id: selectedSroDistrict?.value,
              mandal_id: selectedSroMandal.value,
            },
          }
        );
        const data = response.data?.data;
        const options = data.map((item) => ({
          label: `${item.mandal_id}:${item.mandal_name}`,
          value: item.mandal_id,
        }));
        // setSroTableData(data);
        setFormData('sroTableData', data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  async function setReraDMVLId(
    type: 'DISTRICT' | 'MANDAL' | 'VILLAGE' | 'SURVEY'
  ) {
    const projectIds = selectedProjects.map((item) => item.value);
    if (type === 'DISTRICT' && districtIdValue && districtIdValue.trim()) {
      console.log('updaing district.........');
      try {
        const response = axiosClient.put('/forms/rera/district', {
          project_ids: projectIds,
          district_id: +districtIdValue,
        });
        await toast.promise(
          response,
          {
            loading: `Saving district id to database.`,
            success: 'District ID updated',
            error: `Couldn't save district id.`,
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
        setFormData('districtIdValue', '');
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response?.status >= 400
        ) {
          const errMsg =
            error.response.data?.message || error.response.data?.error;
          toast.error(`Error: ${errMsg}`, {
            duration: 3000,
          });
        } else {
          toast.error("Couldn't send data to server.", {
            duration: 3000,
          });
        }
      }
    } else if (type === 'MANDAL' && mandalIdValue && mandalIdValue.trim()) {
      try {
        const response = axiosClient.put('/forms/rera/mandal', {
          project_ids: projectIds,
          mandal_id: +mandalIdValue,
        });
        await toast.promise(
          response,
          {
            loading: `Saving mandal id to database.`,
            success: 'Mandal ID updated',
            error: `Couldn't save mandal id.`,
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
        setFormData('mandalIdValue', '');
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response?.status >= 400
        ) {
          const errMsg =
            error.response.data?.message || error.response.data?.error;
          toast.error(`Error: ${errMsg}`, {
            duration: 3000,
          });
        } else {
          toast.error("Couldn't send data to server.", {
            duration: 3000,
          });
        }
      }
    } else if (type === 'VILLAGE' && villageIdValue && villageIdValue.trim()) {
      try {
        const response = axiosClient.put('/forms/rera/village', {
          project_ids: projectIds,
          village_id: +villageIdValue,
        });
        await toast.promise(
          response,
          {
            loading: `Saving village id to database.`,
            success: 'Village ID updated',
            error: `Couldn't save village id.`,
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
        setFormData('villageIdValue', '');
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response?.status >= 400
        ) {
          const errMsg =
            error.response.data?.message || error.response.data?.error;
          toast.error(`Error: ${errMsg}`, {
            duration: 3000,
          });
        } else {
          toast.error("Couldn't send data to server.", {
            duration: 3000,
          });
        }
      }
    }
  }

  async function setSurveyPlot(type: 'SURVEY' | 'PLOT', value: string[]) {
    if (selectedProjects.length === 1) {
      const projectId = selectedProjects[0].value;
      if (type === 'SURVEY' && value && value.length > 0) {
        try {
          const response = axiosClient.put('/forms/rera/survey', {
            project_id: projectId,
            surveys: value,
          });
          await toast.promise(
            response,
            {
              loading: `Saving surveys id to database.`,
              success: 'Surveys cleaned ✨',
              error: `CCouldn't save survey to DB.`,
            },
            {
              success: {
                duration: 10000,
              },
            }
          );
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            error.response?.status &&
            error.response?.status >= 400
          ) {
            const errMsg =
              error.response.data?.message || error.response.data?.error;
            toast.error(`Error: ${errMsg}`, {
              duration: 3000,
            });
          } else {
            toast.error("Couldn't send data to server.", {
              duration: 3000,
            });
          }
        }
      } else if (type === 'PLOT' && value && value.length > 0) {
        try {
          const response = axiosClient.put('/forms/rera/plot', {
            project_id: projectId,
            plots: value,
          });
          await toast.promise(
            response,
            {
              loading: `Saving plots id to database.`,
              success: 'Plots cleaned ✨',
              error: `CCouldn't save plots to DB.`,
            },
            {
              success: {
                duration: 10000,
              },
            }
          );
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            error.response?.status &&
            error.response?.status >= 400
          ) {
            const errMsg =
              error.response.data?.message || error.response.data?.error;
            toast.error(`Error: ${errMsg}`, {
              duration: 3000,
            });
          } else {
            toast.error("Couldn't send data to server.", {
              duration: 3000,
            });
          }
        }
      }
    }
  }

  useEffect(() => {
    // setSelectedReraLocality(null);
    setFormData('selectedReraLocality', null);
  }, [selectedReraMandal?.value]);

  useEffect(() => {
    // setSelectedReraLocality(null);
    setFormData('selectedReraLocality', null);
  }, [selectedReraVillage?.value]);

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: RERA Correction</h1>
      <div className='flex justify-start gap-5'>
        <div className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>SRO DMVs</h3>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={sroDistrictOptions || undefined}
              isLoading={loadingSroDistricts}
              value={selectedSroDistrict}
              instanceId={useId()}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setFormData('selectedSroDistrict', e);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={sroMandalOptions || undefined}
              isLoading={loadingSroMandals}
              value={selectedSroMandal}
              instanceId={useId()}
              onChange={(e) => {
                setFormData('selectedSroMandal', e);
              }}
              isDisabled={Boolean(!selectedSroDistrict)}
            />
          </label>
        </div>

        <form className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>RERA DMVLs</h3>
          <ReraDropdown />
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Assign District ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='district_id'
                placeholder='Enter ID here'
                type='number'
                value={districtIdValue}
                onChange={(e) => setFormData('districtIdValue', e.target.value)}
              />
              <button
                className='btn-rezy max-h-10'
                type='button'
                onClick={() => {
                  if (
                    confirm(
                      `You are updating district id for total ${selectedProjects.length} RERA Projects.\nAre you sure?`
                    )
                  ) {
                    setReraDMVLId('DISTRICT');
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Assign Mandal ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='mandal_id'
                placeholder='Enter ID here'
                type='number'
                value={mandalIdValue}
                onChange={(e) => setFormData('mandalIdValue', e.target.value)}
              />
              <button
                className='btn-rezy max-h-10'
                type='button'
                onClick={() => setReraDMVLId('MANDAL')}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Assign Village ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='village_id'
                placeholder='Enter ID here'
                value={villageIdValue}
                onChange={(e) => setFormData('villageIdValue', e.target.value)}
              />
              <button
                className='btn-rezy max-h-10'
                type='button'
                onClick={() => setReraDMVLId('VILLAGE')}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>Assign Survey:</span>
            <div className='flex flex-[5] gap-4'>
              <ChipInput
                updateChipsFn={setSurveyValue}
                chips={surveyValue}
                addTWClass='!ml-0'
              />
              <button
                className='btn-rezy max-h-10'
                disabled={selectedProjects.length === 1 ? false : true}
                type='button'
                onClick={() => {
                  setSurveyPlot('SURVEY', surveyValue);
                  setSurveyValue([]);
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2] text-xl'>Assign Plot:</span>
            <div className='flex flex-[5] gap-4'>
              <ChipInput
                updateChipsFn={setPlotValue}
                chips={plotValue}
                addTWClass='!ml-0'
              />
              <button
                className='btn-rezy max-h-10'
                disabled={selectedProjects.length === 1 ? false : true}
                type='button'
                onClick={() => {
                  setSurveyPlot('PLOT', surveyValue);
                  setSurveyValue([]);
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <button
              className='btn btn-outline btn-sm max-h-10 w-full border-none bg-violet-500 text-white hover:border-none hover:bg-violet-600'
              type='button'
              onClick={() => {
                queryClient.refetchQueries({
                  queryKey: ['rera-district', selectedReraDistrict],
                });
                setFormData('selectedReraMandal', null);
                setFormData('selectedReraVillage', null);
                setFormData('selectedReraLocality', null);
              }}
            >
              Refresh All
            </button>
          </div>
        </form>
      </div>
      <div className='my-5 flex w-full gap-5'>
        <div className='max-w-[49%] flex-1 rounded-lg border-2 p-2'>
          <h3 className='mt-5 text-center text-2xl font-semibold underline'>
            SRO Data
          </h3>
          {sroTableData && sroTableData?.length > 0 && (
            <div className='overflow-x-auto'>
              <TanstackReactTable
                columns={sroTableColumns}
                data={sroTableData}
              />
            </div>
          )}
        </div>
        <div className='max-w-[49%] flex-1 rounded-lg border-2 p-2'>
          <h3 className='mt-5 text-center text-2xl font-semibold underline'>
            RERA Data
          </h3>
          {reraTableData && reraTableData?.length > 0 && (
            <div className='overflow-x-auto'>
              {pdfPreviewDivs}
              <TanstackReactTable
                columns={reraTableColumns}
                data={reraTableData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

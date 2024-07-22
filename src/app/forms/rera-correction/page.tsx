'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import toast, { Toaster } from 'react-hot-toast';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { isEqual, uniqWith } from 'lodash';
import { MultiSelect } from 'react-multi-select-component';
import FetchDocs from './FetchDocs';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import ChipInput from '@/components/ui/Chip';
import { ReraDMLVTableData } from '@/types/types';

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
  const {
    projectOption,
    selectedProjects,
    setProjectOptions,
    setSelectedProjects,
    reraTableDataStore,
    setRERATableDataStore,
  } = useReraCorrectionStore();

  const sroTableColumns = [
    {
      header: 'District ID',
      accessorKey: 'district_id',
    },
    {
      header: 'District Name',
      accessorKey: 'district_name',
    },
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

  const [selectedSroDistrict, setSelectedSroDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedReraDistrict, setSelectedReraDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedSroMandal, setSelectedSroMandal] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedReraMandal, setSelectedReraMandal] = useState<{
    label: string;
    value: string;
  } | null>();
  const [selectedReraVillage, setSelectedReraVillage] = useState<{
    label: string;
    value: string;
  } | null>();
  const [selectedReraLocality, setSelectedReraLocality] = useState<{
    label: string;
    value: string;
  } | null>();
  const [reraTableData, setReraTableData] = useState<
    ReraDMLVTableData[] | null
  >();
  const [sroTableData, setSroTableData] = useState<SroResponse[] | null>();
  const [districtIdValue, setDistrictIdValue] = useState<string | undefined>(
    undefined
  );
  const [mandalIdValue, setMandalIdValue] = useState<string | undefined>(
    undefined
  );
  const [villageIdValue, setVillageIdValue] = useState<string | undefined>(
    undefined
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

  // populate rera district dropdown
  const { isPending: loadingReraDistricts, data: reraDistrictOptions } =
    useQuery({
      queryKey: ['rera-districts', selectedReraMandal],
      queryFn: async () => {
        const options = await fetchDropdownOption('districts', 'state', 36);
        return options.map((item) => ({
          label: `${item.value}:${item.label}`,
          value: item.value,
        }));
      },
      // staleTime: Infinity,
    });

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
        setSroTableData(data);
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
        setSroTableData(data);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  // populate rera mandal dropdown on rera district selection
  const {
    isPending: loadingReraMandals,
    data: reraMandalOptions,
    refetch: refetchReraMandalOptions,
  } = useQuery({
    queryKey: ['rera-district', selectedReraDistrict],
    queryFn: async () => {
      if (selectedReraDistrict !== undefined && selectedReraDistrict !== null) {
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: { district_id: selectedReraDistrict.value },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        data.map((item) => {
          options.push({
            label: `${item.mandal_id}:${item.clean_mandal_name}`,
            value: `${item.mandal_id}:${item.clean_mandal_name}`,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setReraTableData(data);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  //  populate rera village dropdown on rera mandal selection
  const {
    isPending: loadingReraVillages,
    data: reraVillageOptions,
    refetch: refetchReraVillageOptions,
  } = useQuery({
    queryKey: ['rera-mandal', selectedReraMandal],
    queryFn: async () => {
      if (selectedReraMandal !== undefined && selectedReraMandal !== null) {
        if (selectedReraMandal?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              village: selectedReraVillage?.value.split(':')[1],
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        data.map((item) => {
          options.push({
            label: `${item.village_id}:${item.clean_village_name}`,
            value: `${item.village_id}:${item.clean_village_name}`,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setReraTableData(data);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  //  populate rera locality dropdown on rera village selection
  const {
    isPending: loadingReraLocality,
    data: reraLocalityOptions,
    refetch: refetchReraLocalityOptions,
  } = useQuery({
    queryKey: ['rera-village', selectedReraVillage],
    queryFn: async () => {
      if (selectedReraVillage !== undefined && selectedReraVillage !== null) {
        if (selectedReraVillage?.value === '-1') {
          refetchReraMandalOptions();
          return null;
        }
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              village: selectedReraVillage?.value.split(':')[1],
            },
          }
        );
        const data = response.data?.data;
        const options = [{ label: 'ALL', value: '-1' }];
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        data.map((item) => {
          options.push({
            label: item.locality,
            value: item.locality,
          });
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setReraTableData(data);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        return uniqWith(options, isEqual);
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  //  filter rera table data on rera locality selection
  useQuery({
    queryKey: ['rera-mandal', selectedReraLocality],
    queryFn: async () => {
      if (selectedReraMandal !== undefined && selectedReraMandal !== null) {
        if (selectedReraLocality?.value === '-1') {
          refetchReraLocalityOptions();
          return null;
        }
        const response = await axiosClient.get<{ data: ReraDMLVTableData[] }>(
          '/forms/rera/getReraProjectsByDMLVId',
          {
            params: {
              district_id: selectedReraDistrict?.value,
              mandalId: selectedReraMandal?.value.split(':')[0],
              mandal: selectedReraMandal?.value.split(':')[1],
              villageId: selectedReraVillage?.value.split(':')[0],
              village: selectedReraVillage?.value.split(':')[1],
              locality: selectedReraLocality?.value,
            },
          }
        );
        const data = response.data?.data;
        const optionsForProjects: {
          label: string;
          value: number;
        }[] = [];
        data.map((item) => {
          optionsForProjects.push({
            label: `${item.id}:${item.project_name}`,
            value: item.id,
          });
        });
        setReraTableData(data);
        setRERATableDataStore(data);
        setProjectOptions(optionsForProjects);
        setSelectedProjects(optionsForProjects);
        // return true ;
      }
    },
    refetchOnWindowFocus: false,
    // staleTime: Infinity,
  });

  useEffect(() => {
    setSelectedReraLocality(null);
  }, [selectedReraMandal?.value]);

  useEffect(() => {
    setSelectedReraLocality(null);
  }, [selectedReraVillage?.value]);

  let loadingToastId: string;

  async function setReraDMVLId(
    type: 'DISTRICT' | 'MANDAL' | 'VILLAGE' | 'SURVEY'
  ) {
    const projectIds = selectedProjects.map((item) => item.value);
    if (type === 'DISTRICT' && districtIdValue && districtIdValue.trim()) {
      toast.loading(`Saving district id to database.`, {
        id: loadingToastId,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await axiosClient.put('/forms/rera/district', {
          project_ids: projectIds,
          district_id: +districtIdValue,
        });
        if (response.status === 200) {
          toast.dismiss(loadingToastId);
          toast.success('District ID updated', {
            id: loadingToastId,
            duration: 3000,
          });
          setDistrictIdValue('');
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't save district id.`, {
          id: loadingToastId,
          duration: 3000,
        });
      }
    } else if (type === 'MANDAL' && mandalIdValue && mandalIdValue.trim()) {
      toast.loading(`Saving mandal id to database.`, {
        id: loadingToastId,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await axiosClient.put('/forms/rera/mandal', {
          project_ids: projectIds,
          mandal_id: +mandalIdValue,
        });
        if (response.status === 200) {
          toast.dismiss(loadingToastId);
          toast.success('Mandal ID updated', {
            id: loadingToastId,
            duration: 3000,
          });
          setMandalIdValue('');
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't save mandal id.`, {
          id: loadingToastId,
          duration: 3000,
        });
      }
    } else if (type === 'VILLAGE' && villageIdValue && villageIdValue.trim()) {
      toast.loading(`Saving village id to database.`, {
        id: loadingToastId,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await axiosClient.put('/forms/rera/village', {
          project_ids: projectIds,
          village_id: +villageIdValue,
        });
        if (response.status === 200) {
          toast.dismiss(loadingToastId);
          toast.success('Village ID updated', {
            id: loadingToastId,
            duration: 3000,
          });
          setVillageIdValue('');
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error(`Couldn't save village id.`, {
          id: loadingToastId,
          duration: 3000,
        });
      }
    }
  }

  async function setSurveyPlot(type: 'SURVEY' | 'PLOT') {
    if (selectedProjects.length === 1) {
      const projectId = selectedProjects[0].value;
      if (type === 'SURVEY' && surveyValue && surveyValue.length > 0) {
        toast.loading(`Saving surveys to database.`, {
          id: loadingToastId,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const response = await axiosClient.put('/forms/rera/survey', {
            project_id: projectId,
            surveys: surveyValue,
          });
          if (response.status === 200) {
            toast.dismiss(loadingToastId);
            toast.success('Surveys cleaned ✨', {
              id: loadingToastId,
              duration: 3000,
            });
            setSurveyValue([]);
          }
        } catch (error) {
          toast.dismiss(loadingToastId);
          toast.error(`Couldn't save survey to DB.`, {
            id: loadingToastId,
            duration: 3000,
          });
        }
      } else if (type === 'PLOT' && plotValue && plotValue.length > 0) {
        toast.loading(`Saving plots to database.`, {
          id: loadingToastId,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const response = await axiosClient.put('/forms/rera/plot', {
            project_id: projectId,
            plots: plotValue,
          });
          if (response.status === 200) {
            toast.dismiss(loadingToastId);
            toast.success('Plot cleaned ✨', {
              id: loadingToastId,
              duration: 3000,
            });
            setPlotValue([]);
          }
        } catch (error) {
          toast.dismiss(loadingToastId);
          toast.error(`Couldn't save plot to DB.`, {
            id: loadingToastId,
            duration: 3000,
          });
        }
      }
    }
  }

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: RERA Correction</h1>
      <Toaster />
      <div className='flex justify-start gap-5'>
        <div className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>SRO DMVs</h3>
          <label className='flex items-center justify-between gap-5 '>
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
                setSelectedSroDistrict(e);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={sroMandalOptions || undefined}
              isLoading={loadingSroMandals}
              value={selectedSroMandal}
              instanceId={useId()}
              onChange={(e) => {
                setSelectedSroMandal(e);
                // setSelectedSroVillage(null);
              }}
              isDisabled={Boolean(!selectedSroDistrict)}
            />
          </label>
        </div>

        <form className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <h3 className='text-center text-2xl font-semibold'>RERA DMLVs</h3>
          <div className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Projects:</span>
            <div className='flex flex-[5] items-center gap-3'>
              <MultiSelect
                options={projectOption}
                value={selectedProjects}
                className='w-full'
                labelledBy=''
                onChange={(
                  e: {
                    label: string;
                    value: number;
                  }[]
                ) => {
                  setSelectedProjects(e);
                  const selectedProjectId = e.map((item) => item.value);
                  const filteredTableData = reraTableDataStore?.filter((item) =>
                    selectedProjectId.includes(item.id)
                  );
                  setReraTableData(filteredTableData);
                }}
              />
              <span
                className={`badge aspect-square h-10 rounded-full bg-violet-200 ${selectedProjects.length > 100 ? 'text-base' : 'text-lg'} `}
              >
                {selectedProjects.length}
              </span>
            </div>
          </div>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={reraDistrictOptions || undefined}
              isLoading={loadingReraDistricts}
              value={selectedReraDistrict}
              instanceId={useId()}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedReraDistrict(e);
                setSelectedReraMandal(null);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={reraMandalOptions || undefined}
              isLoading={loadingReraMandals}
              value={selectedReraMandal}
              instanceId={useId()}
              onChange={(e) => {
                setSelectedReraMandal(e);
                setSelectedReraVillage(null);
              }}
              isDisabled={Boolean(!selectedReraDistrict)}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Village:</span>
            <Select
              className='w-full flex-[5]'
              key={'village'}
              instanceId={useId()}
              options={reraVillageOptions || undefined}
              isLoading={loadingReraVillages}
              value={selectedReraMandal ? selectedReraVillage : null}
              onChange={(e) => setSelectedReraVillage(e)}
              isDisabled={Boolean(!selectedReraMandal)}
            />
          </label>
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>Locality:</span>
            <Select
              className='w-full flex-[5]'
              instanceId={useId()}
              key={'locality'}
              options={reraLocalityOptions || undefined}
              isLoading={loadingReraLocality}
              value={selectedReraVillage ? selectedReraLocality : null}
              onChange={(e) => setSelectedReraLocality(e)}
              isDisabled={Boolean(!selectedReraVillage)}
            />
          </label>
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Assign District ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='district_id'
                placeholder='Enter ID here'
                type='number'
                value={districtIdValue}
                onChange={(e) => setDistrictIdValue(e.target.value)}
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
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Assign Mandal ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='mandal_id'
                placeholder='Enter ID here'
                type='number'
                value={mandalIdValue}
                onChange={(e) => setMandalIdValue(e.target.value)}
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
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Assign Village ID:</span>
            <div className='flex flex-[5] gap-4'>
              <input
                className={inputBoxClass}
                name='village_id'
                placeholder='Enter ID here'
                value={villageIdValue}
                onChange={(e) => setVillageIdValue(e.target.value)}
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
          <div className='flex flex-wrap items-center justify-between gap-5 '>
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
                onClick={() => setSurveyPlot('SURVEY')}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5 '>
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
                onClick={() => setSurveyPlot('PLOT')}
              >
                Save
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5 '>
            <button
              className='btn btn-outline btn-sm max-h-10 w-full border-none  bg-violet-500 text-white hover:border-none hover:bg-violet-600'
              type='button'
              onClick={() => {
                refetchReraMandalOptions();
                setSelectedReraMandal(null);
                setSelectedReraVillage(null);
                setSelectedReraLocality(null);
              }}
            >
              Refresh All
            </button>
          </div>
        </form>
      </div>
      <div className='my-5 flex w-full gap-5 '>
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

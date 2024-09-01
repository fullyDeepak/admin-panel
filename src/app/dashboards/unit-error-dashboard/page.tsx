'use client';

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import UnitCell from './UnitCell';
import { useSearchParams } from 'next/navigation';

const errorFilterOptions: {
  value: string;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'clean', label: 'Clean' },
  { value: 'verify_name', label: 'Verify Name' },
  { value: 'verify_ptin', label: 'Verify PTIN - Temp DNo' },
  { value: 'tag_hm', label: 'Tag HM' },
  { value: 'tag_tm', label: 'Tag TM' },
  { value: 'missing', label: 'Missing' },
];
export default function UnitErrorDashboardPage() {
  const params = useSearchParams();
  const projectId = params.get('project_id');
  const towerId = params.get('tower_id');
  const errorFilter = params.get('filter');

  console.dir({ projectId, towerId, errorFilter });

  const [autoset, setAutoset] = useState(false);
  // states
  const [selectedProject, setSelectedProject] = useState<
    SingleValue<{
      value: number;
      label: string;
    }>
  >({ value: -1, label: 'Select Project' });
  const [selectedTower, setSelectedTower] = useState<
    SingleValue<{
      value: number;
      label: string;
    }>
  >({ value: -1, label: 'Select Tower' });
  const [selectedErrorFilter, setSelectedErrorFilter] = useState<
    SingleValue<{
      value: string;
      label: string;
    }>
  >({ value: 'all', label: 'All' });
  const [umShell, setUmShell] = useState<{
    towerType: string;
    floors: {
      floor_number: number;
      units: {
        unit_number: string;
        unit_name: string;
        nameMismatch?: boolean;
        clean?: boolean;
        missing?: boolean;
        noHM?: boolean;
        noTM?: boolean;
        verifyPTIN?: boolean;
      }[];
    }[];
  } | null>(null);
  // fetchers
  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get<{
          data: { id: number; project_name: string }[];
        }>('/projects');
        const options = res.data.data.map((item) => ({
          value: item.id,
          label: `${item.id}:${item.project_name}`,
        }));
        return options.sort((a, b) => a.value - b.value);
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: towerOptions, isLoading: loadingTowerOptions } = useQuery({
    queryKey: ['towers', selectedProject],
    queryFn: async () => {
      if (!selectedProject || selectedProject.value === -1) return [];
      try {
        const res = await axiosClient.get<{
          data: { id: string; tower_name: string }[];
        }>('/projects/towers', {
          params: { project_id: selectedProject.value },
        });
        const options = res.data.data.map((item) => ({
          value: parseInt(item.id),
          label: `${item.id}:${item.tower_name}`,
        }));
        return options;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: umShellData,
    isLoading: loadingUMShell,
    isError: UmLoadError,
    error: UMError,
  } = useQuery({
    queryKey: ['um-shell', selectedTower],
    queryFn: async () => {
      if (!selectedTower || selectedTower.value === -1) return null;
      try {
        const umRes = await axiosClient.get<{
          data: {
            tower_type: string;
            floors: {
              floor_number: number;
              units: {
                unit_number: string;
                unit_name: string;
              }[];
            }[];
          }[];
        }>('/unitmaster/shell', {
          params: { tower_id: selectedTower.value },
        });
        const verifyPTINUnitsRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/verify-ptin', {
          params: { tower_id: selectedTower.value },
        });
        const nameMismatchRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/name-mismatch', {
          params: { tower_id: selectedTower.value },
        });
        const noHMRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/no-hm', {
          params: { tower_id: selectedTower.value },
        });
        const noTMRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/no-tm', {
          params: { tower_id: selectedTower.value },
        });
        const cleanUnitsRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/clean', {
          params: { tower_id: selectedTower.value },
        });
        const missingUnitsRes = await axiosClient.get<{
          data: {
            floor_number: number;
            units: {
              unit_number: string;
              unit_name: string;
            }[];
          }[];
        }>('/unitmaster/missing', {
          params: { tower_id: selectedTower.value },
        });
        const umShell = umRes.data.data;
        const nameMismatchShell = nameMismatchRes.data.data;
        const missingShell = missingUnitsRes.data.data;
        const noHMShell = noHMRes.data.data;
        const noTMShell = noTMRes.data.data;
        const verifyPTINUnitsShell = verifyPTINUnitsRes.data.data;
        const cleanUnitsShell = cleanUnitsRes.data.data;
        // add attribute nameMismatch to units that are present in nameMismatchShell
        const mergedUM = {
          towerType: umShell[0].tower_type,
          floors: umShell[0].floors.map((floor) => {
            return {
              floor_number: floor.floor_number,
              units: floor.units
                .sort(
                  (a, b) => parseInt(a.unit_number) - parseInt(b.unit_number)
                )
                .map((unit) => {
                  return {
                    unit_number: unit.unit_number,
                    unit_name: unit.unit_name,
                    verifyPTIN: verifyPTINUnitsShell.some(
                      (vp) =>
                        vp.floor_number === floor.floor_number &&
                        vp.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                    nameMismatch: nameMismatchShell.some(
                      (nm) =>
                        nm.floor_number === floor.floor_number &&
                        nm.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                    clean: cleanUnitsShell.some(
                      (nm) =>
                        nm.floor_number === floor.floor_number &&
                        nm.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                    missing: missingShell.some(
                      (nm) =>
                        nm.floor_number === floor.floor_number &&
                        nm.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                    noHM: noHMShell.some(
                      (nm) =>
                        nm.floor_number === floor.floor_number &&
                        nm.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                    noTM: noTMShell.some(
                      (nm) =>
                        nm.floor_number === floor.floor_number &&
                        nm.units.find((u) => u.unit_number === unit.unit_number)
                    ),
                  };
                }),
            };
          }),
        };
        return mergedUM;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });

  // effects
  // reset dropdown on project change
  useEffect(() => {
    setSelectedTower({ value: -1, label: 'Select Tower' });
  }, [selectedProject]);

  // set selected project == project_id on page load
  useEffect(() => {
    if (projectId) {
      setSelectedProject({ value: +projectId, label: projectId });
    }
  }, [projectOptions]);
  // set selected tower == tower_id on page load
  useEffect(() => {
    console.log('Autosetting');
    if (autoset) return;
    if (towerId) {
      console.log(towerOptions);
      const filtered_tower = towerOptions?.find(
        (item) => item?.value === parseInt(towerId)
      );
      if (filtered_tower) {
        setSelectedTower(filtered_tower);
        setAutoset(true);
      }
    }
    const filtered_error = errorFilterOptions.find(
      (item) => item?.value === errorFilter
    );
    if (errorFilter && filtered_error) {
      setSelectedErrorFilter(filtered_error);
    }
  }, [selectedProject, towerOptions]);

  // set UMShell on new UMShell data
  useEffect(() => {
    if (umShellData) {
      setUmShell(umShellData);
    }
  }, [umShellData]);
  // render
  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <h1 className='mb-4 text-center text-3xl font-semibold underline'>
        Tower Unit Error Dashboard
      </h1>
      <p className='mb-4 text-center text-xl font-semibold'>
        This dashboard shows the unit error stats for each tower. TASK LIST
        Item#4
      </p>

      {/* 3 dropdowns 
      1. project: project selector dropdown that has `${id}:${project_name}` as labels and sets project_id state
      2. tower: tower selector for the set project, dropdown is disabled unless project is selected. populates tower names for selected project and sets tower_id state.
      3. error_filter: filter out rendered units based on selected error or all, sets error_filter state.*/}
      <div className='mb-5 flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Project:</span>
        <Select
          className='w-full flex-[5]'
          key={'projectOptions'}
          isClearable
          value={selectedProject}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setSelectedProject(e);
          }}
          options={projectOptions}
          isLoading={loadingProjectOptions}
        />
      </div>
      <div className='mb-5 flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Tower:</span>
        <Select
          className='w-full flex-[5]'
          key={'towerOptions'}
          isClearable
          value={selectedTower}
          onChange={(
            e: SingleValue<{
              value: number;
              label: string;
            }>
          ) => {
            setSelectedTower(e);
          }}
          options={towerOptions}
          isLoading={loadingTowerOptions}
        />
      </div>
      {/* filters */}
      <div className='mb-5 flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Error Filter:</span>
        <Select
          className='w-full flex-[5]'
          key={'errorFilter'}
          isClearable
          value={selectedErrorFilter}
          onChange={(
            e: SingleValue<{
              value: string;
              label: string;
            }>
          ) => {
            setSelectedErrorFilter(e);
          }}
          options={errorFilterOptions}
          isDisabled={!selectedTower || Boolean(selectedTower.value === -1)}
        />
      </div>
      {selectedTower?.value !== -1 ? (
        loadingUMShell ? (
          <div className='my-10'>
            <p className='text-center text-2xl font-semibold'>Loading...</p>
          </div>
        ) : UmLoadError ? (
          <div className='my-10'>
            <p className='text-center text-2xl font-semibold'>
              Error: {UMError.message}
            </p>
          </div>
        ) : umShell && umShell.floors.length > 0 ? (
          // display as a grid where each row is a floor and each column is a unit
          <div className='my-5 rounded-2xl border-4 p-5'>
            <div className='custom-scrollbar relative flex flex-col-reverse justify-between gap-2 overflow-x-auto p-5'>
              {umShell.floors.map((floor) => (
                <div
                  key={floor.floor_number}
                  className={`flex ${umShell.towerType === 'VILLA' ? 'flex-col' : 'flex-row'} items-start gap-2 tabular-nums`}
                >
                  {floor.units
                    .map((unit) => {
                      if (!selectedErrorFilter)
                        return { ...unit, not_filtered: true };
                      switch (selectedErrorFilter.value) {
                        case 'all':
                          return { ...unit, not_filtered: true };
                        case 'clean':
                          return { ...unit, not_filtered: unit.clean };
                        case 'verify_ptin':
                          return { ...unit, not_filtered: unit.verifyPTIN };
                        case 'verify_name':
                          return { ...unit, not_filtered: unit.nameMismatch };
                        case 'tag_hm':
                          return { ...unit, not_filtered: unit.noHM };
                        case 'tag_tm':
                          return { ...unit, not_filtered: unit.noTM };
                        case 'missing':
                          return { ...unit, not_filtered: unit.missing };
                        default:
                          return { ...unit, not_filtered: true };
                      }
                    })
                    .map((unitItem, unitNameIndex) => (
                      <UnitCell
                        floorNumber={floor.floor_number}
                        fullUnitName={unitItem.unit_name}
                        unitNumber={unitItem.unit_number}
                        key={
                          floor.floor_number.toString() + '|' + unitNameIndex
                        }
                        shouldColor={unitItem.not_filtered}
                        unitType={
                          unitItem.clean
                            ? 1
                            : unitItem.nameMismatch
                              ? 2
                              : unitItem.verifyPTIN
                                ? 3
                                : unitItem.noHM
                                  ? 4
                                  : unitItem.noTM
                                    ? 5
                                    : unitItem.missing
                                      ? 6
                                      : null
                        }
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='my-10'>
            <p className='text-center text-2xl font-semibold'>
              No data available {JSON.stringify(umShell)} {selectedTower?.value}
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}

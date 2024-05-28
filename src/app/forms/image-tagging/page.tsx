'use client';

import Select, { SingleValue } from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { HiOutlineSelector } from 'react-icons/hi';
import { nanoid } from 'nanoid';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { produce } from 'immer';

export default function ImageTaggingPage() {
  const [selectedProject, setSelectedProject] = useState<SingleValue<{
    value: Number;
    label: string;
  }> | null>(null);

  const [selectedImageTaggingType, setSelectedImageTaggingType] = useState<
    SingleValue<{
      label: string;
      value: 'brochure' | 'project-mp' | 'project-img' | 'tower-fp' | 'unit-fp';
    } | null>
  >(null);

  const [towerFloorFormData, setTowerFloorFormData] = useState<
    | {
        tower_id: number;
        tower_name: string;
        floorsUnits: {
          floorId: number;
          units: string[];
          selectedUnits: string[];
        }[];
      }[]
    | []
  >([]);

  const [loadingTowerFloorData, setLoadingTowerFloorData] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');

  const [selectedUnits, setSelectedUnits] = useState<
    {
      floorId: number;
      selectedUnits: string[];
    }[]
  >([]);

  // populate project dropdown
  const { data: projectOptions, isLoading: loadingProjectOptions } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get<{
          data: { id: Number; project_name: String }[];
        }>('/projects');
        const options = res.data.data.map((item) => ({
          value: item.id,
          label: `${item.id}:${item.project_name}`,
        }));
        return options;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  // populate tower floor dropdown
  const { data: towerFloorData } = useQuery({
    queryKey: [
      'getUMUnitNames',
      selectedProject?.value,
      selectedImageTaggingType,
    ],
    queryFn: async () => {
      if (
        selectedImageTaggingType?.value === 'tower-fp' &&
        selectedProject?.value
      ) {
        try {
          setLoadingTowerFloorData('loading');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const res = await axiosClient.get<{
            data: {
              project_id: number;
              project_name: string;
              tower_id: number;
              tower_name: string;
              floors_units: {
                floor_id: number;
                unit_names: string[];
              }[];
            }[];
          }>('/forms/getUMUnitNames', {
            params: { project_id: selectedProject.value },
          });
          const towersFloorData = res.data.data;
          const units: {
            tower_id: number;
            tower_name: string;
            floorsUnits: {
              floorId: number;
              units: string[];
              selectedUnits: string[];
            }[];
          }[] = towersFloorData?.map((towerFloorData) => ({
            tower_id: towerFloorData.tower_id,
            tower_name: towerFloorData.tower_name,
            floorsUnits: towerFloorData.floors_units.map((floorUnits) => ({
              floorId: floorUnits.floor_id,
              units: floorUnits.unit_names,
              selectedUnits: [],
            })),
          }));
          setTowerFloorFormData(units);
          setLoadingTowerFloorData('complete');
          return units;
        } catch (error) {
          console.log(error);
        }
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Image Tagging
      </h1>
      <form
        className='mt-5 flex w-full max-w-full  flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[60%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerImageTagging'
        // onSubmit={submitForm}
      >
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[3] text-xl'>Select Project:</span>
          <Select
            className='w-full flex-[5]'
            key={'projectOptions'}
            isClearable
            instanceId={useId()}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e)}
            options={projectOptions}
            isLoading={loadingProjectOptions}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[3] text-xl'>Tagging Type:</span>
          <Select
            className='w-full flex-[5]'
            key={'district'}
            isClearable
            instanceId={useId()}
            value={selectedImageTaggingType}
            onChange={(e) => setSelectedImageTaggingType(e)}
            options={[
              { label: 'Brochure', value: 'brochure' },
              { label: 'Project Master Plan', value: 'project-mp' },
              { label: 'Project Images', value: 'project-img' },
              { label: 'Tower Floor Plan', value: 'tower-fp' },
              { label: 'Unit Floor Plan', value: 'unit-fp' },
            ]}
          />
        </label>
        {loadingTowerFloorData === 'loading' && (
          <span className='text-center'>
            <LoadingCircle circleColor='black' size='large' />
          </span>
        )}
        {loadingTowerFloorData === 'complete' &&
          towerFloorData &&
          towerFloorData?.length > 0 &&
          towerFloorData?.map((tower, towerIndex) => (
            <div
              className='tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(0,60,255,0.5)]'
              key={nanoid()}
              id={nanoid()}
            >
              <p className='flex justify-evenly text-center font-semibold'>
                <span>Tower ID: {tower.tower_id}</span>{' '}
                <span>Tower Name:{tower.tower_name}</span>
              </p>
              <div className='flex flex-col justify-between gap-2 overflow-x-auto p-5'>
                {tower.floorsUnits?.slice(0, 1).map((floorUnits, index) => (
                  <div
                    key={nanoid()}
                    className='flex flex-row items-start gap-2 tabular-nums'
                  >
                    {floorUnits.units.map((unit_name, towerIndex) => (
                      <button
                        key={nanoid()}
                        className='btn btn-error btn-xs min-w-32 rounded-full text-white'
                        onClick={() => {
                          console.log(`clicked ${towerIndex}`);
                          setTowerFloorFormData(
                            produce((draft) => {
                              const towerData = draft?.find(
                                (towerFloorData) =>
                                  towerFloorData.tower_id === tower.tower_id
                              );
                              towerData?.floorsUnits.map((item) => {
                                item.selectedUnits.push(item.units[towerIndex]);
                              });
                            })
                          );
                        }}
                        type='button'
                      >
                        <HiOutlineSelector size={25} />
                      </button>
                    ))}
                  </div>
                ))}
                {tower.floorsUnits?.map((floorUnits, floorsUnitsIndex) => (
                  <div
                    key={nanoid()}
                    className='flex flex-row items-start gap-2 tabular-nums'
                  >
                    {floorUnits.units.map((unitName, unitNameIndex) => (
                      <label key={nanoid()} className='swap'>
                        <input
                          type='checkbox'
                          key={nanoid()}
                          checked={Boolean(
                            towerFloorFormData[towerIndex]?.floorsUnits[
                              floorsUnitsIndex
                            ]?.selectedUnits.includes(unitName)
                          )}
                          onChange={(e) => {
                            console.log(
                              towerFloorFormData[towerIndex]?.floorsUnits[
                                floorsUnitsIndex
                              ],
                              { checked: e.target.checked }
                            );
                            setTowerFloorFormData(
                              produce((draft) => {
                                const towerData = draft?.find(
                                  (towerFloorData) =>
                                    towerFloorData.tower_id === tower.tower_id
                                );
                                const floorUnitsData =
                                  towerData?.floorsUnits.find(
                                    (flrUnit) =>
                                      flrUnit.floorId === floorUnits.floorId
                                  );
                                console.log(
                                  'if avail->',
                                  floorUnitsData?.selectedUnits.includes(
                                    unitName
                                  ),
                                  unitName,
                                  floorUnitsData?.selectedUnits.indexOf(
                                    unitName
                                  )
                                );
                                if (
                                  floorUnitsData?.selectedUnits.includes(
                                    unitName
                                  )
                                ) {
                                  const unitNameIndex =
                                    floorUnitsData?.selectedUnits.indexOf(
                                      unitName
                                    );
                                  floorUnitsData?.selectedUnits?.splice(
                                    unitNameIndex,
                                    1
                                  );
                                } else {
                                  floorUnitsData?.selectedUnits.push(unitName);
                                }
                              })
                            );
                          }}
                        />
                        <p
                          key={nanoid()}
                          className='swap-on min-w-32 rounded-full border bg-green-200 px-4 py-2 text-center'
                        >
                          {floorUnits.floorId}-{unitName}
                        </p>
                        <p
                          key={nanoid()}
                          className='swap-off min-w-32 rounded-full border px-4 py-2 text-center'
                        >
                          {floorUnits.floorId}-{unitName}
                        </p>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <label className='relative flex flex-wrap items-center justify-between gap-5 '>
                <span className='flex-[3] text-xl'>Select File:</span>
                <input
                  type='file'
                  className='file-input file-input-bordered flex-[5]'
                />
              </label>
              <button
                className='btn btn-warning max-w-32 rounded-full text-white'
                type='button'
                onClick={() => {
                  const tempSelectedUnits: {
                    floorId: number;
                    selectedUnits: string[];
                  }[] = [];
                  towerFloorFormData[towerIndex].floorsUnits.map((ele) => {
                    let temp: {
                      floorId: number;
                      selectedUnits: string[];
                    } = { floorId: ele.floorId, selectedUnits: [] };
                    ele.selectedUnits.map((unit) => {
                      temp.selectedUnits.push(unit);
                    });
                    temp.selectedUnits.length > 0
                      ? tempSelectedUnits.push(temp)
                      : null;
                  });
                  console.log(tempSelectedUnits);
                  setSelectedUnits(tempSelectedUnits);
                  towerFloorFormData[towerIndex].floorsUnits.map(
                    (ele) => ele.selectedUnits
                  );
                }}
              >
                Preview
              </button>
              <pre className='max-h-60 resize-none overflow-y-auto bg-slate-100 p-5 font-mono text-sm'>
                {JSON.stringify(selectedUnits, null, 2)}
              </pre>
            </div>
          ))}
        {towerFloorData &&
          towerFloorData.length === 0 &&
          selectedProject?.value &&
          selectedImageTaggingType?.value === 'tower-fp' && (
            <span className='text-center font-semibold text-error'>
              Error: Units not available.
            </span>
          )}

        {selectedImageTaggingType &&
          selectedImageTaggingType.value !== 'tower-fp' && (
            <label className='relative flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[3] text-xl'>Select File:</span>
              <input
                type='file'
                className='file-input file-input-bordered flex-[5]'
              />
            </label>
          )}
      </form>
    </div>
  );
}

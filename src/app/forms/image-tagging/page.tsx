'use client';

import Select, { SingleValue } from 'react-select';
import { useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import LoadingCircle from '@/components/ui/LoadingCircle';
import UnitFP from './UnitFP';
import TowerFP from './TowerFP';
import { startCase } from 'lodash';
import { useImageFormStore } from '@/store/useImageFormStore';

export type TowerFloorDataType = {
  towerId: number;
  towerName: string;
  towerType: string;
  floorsUnits: {
    floorId: number;
    units: string[];
    selectedUnits: string[];
  }[];
};

export default function ImageTaggingPage() {
  const {
    fetchTowerFloorData,
    loadingTowerFloorData,
    resetTowerFloorData,
    setLoadingTowerFloorData,
    towerFloorFormData,
    setTowerFloorFormData,
    setSelectedUnit,
  } = useImageFormStore();

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
        (selectedImageTaggingType?.value === 'tower-fp' ||
          selectedImageTaggingType?.value === 'unit-fp') &&
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
              type: 'apartment' | 'villa' | 'apartmentSingle';
              floors_units: {
                floor_id: number;
                unit_names: string[];
              }[];
            }[];
          }>('/forms/getUMUnitNames', {
            params: { project_id: selectedProject.value },
          });
          const towersFloorData = res.data.data;
          const units: TowerFloorDataType[] = towersFloorData?.map(
            (towerFloorData) => ({
              towerId: towerFloorData.tower_id,
              towerName: towerFloorData.tower_name,
              towerType: startCase(towerFloorData.type),
              floorsUnits: towerFloorData.floors_units.map((floorUnits) => ({
                floorId: floorUnits.floor_id,
                units: floorUnits.unit_names,
                selectedUnits: [],
              })),
            })
          );
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
        className='my-60 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[60%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
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
          selectedImageTaggingType?.value === 'unit-fp' &&
          towerFloorData &&
          towerFloorData?.length > 0 && (
            <UnitFP
              setSelectedUnit={setSelectedUnit}
              towerFloorData={towerFloorData}
              towerFloorFormData={towerFloorFormData}
            />
          )}
        {towerFloorData &&
          towerFloorData.length === 0 &&
          selectedProject?.value &&
          selectedImageTaggingType?.value === 'unit-fp' && (
            <span className='text-center font-semibold text-error'>
              Error: Units not available.
            </span>
          )}
        {loadingTowerFloorData === 'complete' &&
          selectedImageTaggingType?.value === 'tower-fp' &&
          towerFloorData &&
          towerFloorData?.length > 0 && (
            <TowerFP towerFloorData={towerFloorData} />
          )}
        {selectedImageTaggingType &&
          selectedImageTaggingType?.value !== 'unit-fp' &&
          selectedImageTaggingType?.value !== 'tower-fp' && (
            <label className='relative flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex-[3] text-xl'>Select File:</span>
              <input
                type='file'
                className='file-input file-input-bordered flex-[5]'
              />
            </label>
          )}
        {selectedImageTaggingType && selectedImageTaggingType?.value && (
          <button className='btn-rezy btn mx-auto min-w-40'>Submit</button>
        )}
      </form>
    </div>
  );
}

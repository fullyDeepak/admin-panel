'use client';

import dynamic from 'next/dynamic';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';
const MapInterface = dynamic(() => import('./MapInterface'), {
  ssr: false,
});

type Location = {
  lat: number;
  lng: number;
};

export type ProjectCordWithinVillage = {
  message: string;
  data: {
    name: string;
    description: string;
    place_id: string;
    types: string;
    pincode: string;
    geometry: {
      location: Location;
      viewport: {
        northeast: Location;
        southwest: Location;
      };
    };
  }[];
};

export default function MapUI() {
  const {
    mapData,
    selectedMapProject,
    selectedDMV,
    setSelectedMapProject,
    selectedCleanProjectId,
    attachedMapData,
    setAttachedMapData,
  } = useVillageProjectCleanerStore();

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='w-full flex-[3]'>
          <MapInterface />
        </div>
        <div className='flex w-full flex-[2] flex-col gap-2'>
          <p className='mb-5 text-center text-2xl font-semibold'>
            Select Project
          </p>
          <div className='flex flex-col gap-2 text-xs'>
            {mapData?.map((project) => (
              <label
                key={project.place_id}
                className='flex cursor-pointer items-center gap-2 pl-2'
              >
                <input
                  type='radio'
                  className='radio checked:bg-violet-600'
                  name='project-checkbox'
                  value={project.place_id}
                  checked={selectedMapProject?.place_id === project.place_id}
                  onChange={() => {
                    setSelectedMapProject(project);
                    if (
                      selectedCleanProjectId.startsWith('T') ||
                      selectedCleanProjectId.startsWith('R')
                    ) {
                      setAttachedMapData(selectedCleanProjectId, {
                        village_id: selectedDMV.village?.value,
                        place_id: project.place_id,
                        full_address: project.description,
                        pincode: project.pincode,
                        lng: project.geometry.location.lng,
                        lat: project.geometry.location.lat,
                      });
                    }
                  }}
                />
                <span>
                  {project.name}, {project.description}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <div>Project Ids of selected Map Data:</div>
        <div>{Object.keys(attachedMapData).join(', ')}</div>
      </div>
    </div>
  );
}

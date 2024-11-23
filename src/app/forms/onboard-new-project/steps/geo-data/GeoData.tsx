'use client';

import { inputBoxClass } from '@/app/constants/tw-class';
import { cn } from '@/lib/utils';
import { kml } from '@tmcw/togeojson';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import dynamic from 'next/dynamic';
import { ChangeEvent, useMemo } from 'react';
import { ProjectCordWithinVillage } from '@/app/forms/village-project-cleaner/MapUI';
import axiosClient from '@/utils/AxiosClient';
import toast from 'react-hot-toast';
import { SingleValue } from 'react-select';

type Props<T> = {
  onboardingData: T;
  updateOnboardingData: (_newDetails: Partial<T>) => void;
};

export default function GeoData<
  T extends {
    mapGeojsonData?: FeatureCollection<Geometry, GeoJsonProperties> | null;
    geoData?: any[];
    mapInputValue: string;
    mapData: ProjectCordWithinVillage['data'] | null;
    selectedVillage?: SingleValue<{ value: number; label: string }>;
  },
>({ onboardingData, updateOnboardingData }: Props<T>) {
  const MapInterface = useMemo(
    () =>
      dynamic(() => import('./../geo-data/MapInterface'), {
        ssr: false,
      }),
    [onboardingData.mapGeojsonData]
  );

  async function extractKMLCoordinates(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<
    FeatureCollection<Geometry | null, GeoJsonProperties> | undefined
  > {
    event.preventDefault();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const text = e.target.result as string;
          const geojson = kml(
            new DOMParser().parseFromString(text, 'text/xml')
          );

          resolve(geojson);
        } else {
          resolve(undefined);
        }
      };
      reader.onerror = () => {
        reject(new Error('Error reading file.'));
      };
      if (event.target && event.target.files && event.target.files[0]) {
        reader.readAsText(event.target.files[0]);
      } else {
        resolve(undefined);
      }
    });
  }

  return (
    <div className='flex flex-col items-start justify-between gap-5'>
      {onboardingData?.selectedVillage && (
        <div className='flex w-full items-center justify-center gap-5'>
          <span>Search: </span>
          <input
            type='text'
            className={cn(inputBoxClass, 'max-w-96')}
            placeholder='Search within selected village'
            value={onboardingData.mapInputValue}
            onChange={(e) =>
              updateOnboardingData({
                mapInputValue: e.target.value,
              } as Partial<T>)
            }
          />
          <button
            className='btn btn-neutral'
            onClick={async () => {
              if (!onboardingData.selectedVillage) return;
              updateOnboardingData({ mapData: null } as Partial<T>);
              const res = axiosClient.get<ProjectCordWithinVillage>(
                '/map/project-cord-within-village',
                {
                  params: {
                    village_id: onboardingData.selectedVillage.value,
                    query: `${onboardingData.mapInputValue} ${onboardingData.selectedVillage.label.split(':')[1]}`,
                  },
                }
              );
              toast.promise(
                res,
                {
                  loading: 'Loading...',
                  success: (data) => {
                    updateOnboardingData({
                      mapData: data.data.data,
                    } as Partial<T>);
                    return `Successfully loaded ${data.data.data.length} projects.`;
                  },
                  error: 'Error',
                },
                { duration: 5000 }
              );
            }}
          >
            Search
          </button>
        </div>
      )}
      <MapInterface
        onboardingData={onboardingData}
        updateOnboardingData={updateOnboardingData as any}
      />
      <div>
        <label className='flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[2]'>Upload KML File:</span>
          <input
            type='file'
            name='kmlFile'
            accept='.kml'
            className='file-input input-bordered ml-[6px] w-full flex-[5]'
            onChange={async (e) => {
              const geometry = await extractKMLCoordinates(e);
              if (geometry) {
                updateOnboardingData({
                  mapGeojsonData: geometry as FeatureCollection,
                  geoData: onboardingData.geoData
                    ? [
                        ...(onboardingData.geoData as unknown as any[]),
                        geometry,
                      ]
                    : [geometry],
                } as unknown as Partial<T>);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

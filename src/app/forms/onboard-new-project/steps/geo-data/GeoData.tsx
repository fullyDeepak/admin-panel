'use client';

import { inputBoxClass } from '@/app/constants/tw-class';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { ChangeEvent, useMemo } from 'react';
import { handleShowOnMap } from './utils';
import { kml } from '@tmcw/togeojson';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { computeArea } from 'spherical-geometry-js';

export default function GeoData() {
  const MapInterface = useMemo(
    () =>
      dynamic(() => import('./../geo-data/MapInterface'), {
        ssr: false,
      }),
    []
  );

  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();

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
      <div className='flex w-full items-center justify-center gap-5'>
        <span>Search: </span>
        <input
          type='text'
          className={cn(inputBoxClass, 'max-w-96')}
          placeholder='Search within selected village'
          value={onboardingData.mapInputValue}
          onChange={(e) =>
            updateOnboardingData({ mapInputValue: e.target.value })
          }
        />
        <button
          className='btn btn-neutral'
          onClick={() => {
            handleShowOnMap();
          }}
        >
          Search
        </button>
      </div>
      <MapInterface />
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
              console.log(geometry);
              if (geometry) {
                updateOnboardingData({
                  mapGeojsonData: geometry as FeatureCollection,
                });
              }
            }}
          />
        </label>
      </div>
      {onboardingData.geoData.map((geo) => {
        if (geo.geometry.type !== 'Polygon') return null;
        const latlongs = geo.geometry.coordinates[0];
        console.log(latlongs);
        const computedArea = computeArea(latlongs);
        return (
          <div key={geo.properties.name} className='flex w-full justify-around'>
            <span className='py-3 text-center text-2xl font-semibold'>
              Area: {(computedArea * 1.196).toFixed(2)} yd<sup>2</sup>
            </span>
          </div>
        );
      })}
    </div>
  );
}

'use client';
import {
  Icon,
  LatLngBounds,
  LatLngBoundsExpression,
  LatLngTuple,
  Layer,
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  GeoJSON,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { ProjectCordWithinVillage } from '../../../village-project-cleaner/MapUI';
import selectPin from '../../../village-project-cleaner/select-pin.png';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import GeomanDrawer from './GeomanDrawer';
import bboxCalculator from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import * as geojson from 'geojson';

export default function MapInterface() {
  const center: LatLngTuple = [17.418136769166217, 78.33019660095187];
  const { mapData, mapGeojsonData } = useOnboardingDataStore((state) => ({
    mapData: state.onboardingData.mapData,
    mapGeojsonData: state.onboardingData.mapGeojsonData,
  }));

  const mapLayer = [
    {
      name: 'Google Terrain',
      url: 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    },
    {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    {
      name: 'Google Hybrid',
      url: 'http://{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}',
    },
    {
      name: 'Google Satellite',
      url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    },
    {
      name: 'Google Street with Traffic',
      url: 'http://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}',
    },
    {
      name: 'ArcGIS',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
  ];

  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();
  const selectIcon = new Icon({
    iconUrl: selectPin.src,
    iconSize: [28, 38],
  });
  const FitBounds = ({
    mapData,
  }: {
    mapData: ProjectCordWithinVillage['data'] | null;
  }) => {
    const map = useMap();

    useEffect(() => {
      if (!mapData?.length) return;
      const bounds = new LatLngBounds(
        mapData.map((location) => [
          location.geometry.location.lat,
          location.geometry.location.lng,
        ])
      );

      // Fly to the bounds of the markers
      map.flyToBounds(bounds, { duration: 1.9 });
    }, [mapData, map]);

    useEffect(() => {
      if (!mapGeojsonData) return;
      if (mapGeojsonData) {
        const bbox = bboxCalculator(mapGeojsonData as AllGeoJSON);
        const boundArea: LatLngBoundsExpression = [
          [bbox[1], bbox[2]],
          [bbox[3], bbox[0]],
        ];
        map.flyToBounds(boundArea, {
          duration: 1.9,
        });
      }
    }, [mapGeojsonData, map]);
    return null;
  };

  function renderLabel(
    feature: geojson.Feature<
      {
        type: 'Polygon';
        coordinates: [number, number][][];
      },
      {
        id: number;
        name: string;
      }
    >,
    layer: Layer
  ) {
    layer.bindPopup(feature.properties?.name);
  }

  return (
    <div className='mb-5 flex w-full flex-col items-center justify-center'>
      <div className='mx-auto flex h-[70vh] w-full max-w-[100%] gap-2'>
        <MapContainer
          center={center}
          zoom={12}
          maxZoom={18}
          scrollWheelZoom={true}
          className='h-full min-h-[100px] w-full min-w-[200px] flex-[4] rounded-2xl border-[3px] border-[#9CAA71] shadow-[0px_0px_6px_2px_#00000024]'
        >
          <GeomanDrawer
            setGeoJsonData={(d) =>
              updateOnboardingData({
                geoData: d,
              })
            }
          />
          <FitBounds mapData={mapData} />
          {mapData?.map((project) => (
            <>
              <Marker
                position={[
                  project.geometry.location.lat,
                  project.geometry.location.lng,
                ]}
                icon={selectIcon}
                key={'marker' + project.place_id}
                // eventHandlers={{
                //   mouseover: (event) => event.target.openPopup(),
                //   mouseout: (event) => event.target.closePopup(),
                // }}
              >
                <Popup>
                  <div className='flex flex-col gap-2'>
                    <span>Name: {project.name}</span>
                    <span>Address: {project.description}</span>
                    <span>Pincode: {project.pincode}</span>
                    <span className='break-all'>
                      Place Id: {project.place_id}
                    </span>
                    <span>Type: {project.types}</span>
                  </div>
                </Popup>
              </Marker>
            </>
          ))}
          {mapGeojsonData &&
            mapGeojsonData?.features?.map((feature, index) => (
              <GeoJSON
                data={feature}
                key={index}
                style={{ color: 'dodgerblue' }}
                onEachFeature={renderLabel}
              />
            ))}
          <LayersControl>
            {mapLayer?.map((item, i) => (
              <LayersControl.BaseLayer
                name={item.name}
                key={i}
                checked={i === 0}
              >
                <TileLayer
                  url={item.url}
                  maxZoom={18}
                  minZoom={2}
                  subdomains={
                    item.url.includes('google')
                      ? ['mt0', 'mt1', 'mt2', 'mt3']
                      : ['a', 'b', 'c']
                  }
                  attribution="Here we'll give credit and attribution"
                  // detectRetina={retina}
                />
              </LayersControl.BaseLayer>
            ))}
          </LayersControl>
        </MapContainer>
        <div className='mx-auto flex w-full flex-1 flex-col justify-start gap-4'>
          <button
            className='btn btn-error max-w-min self-center text-white'
            onClick={() => updateOnboardingData({ geoData: [] })}
          >
            Clear
          </button>
          <pre className='max-h-[500px] overflow-y-auto bg-gray-200 font-mono text-sm'>
            {JSON.stringify(onboardingData.geoData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

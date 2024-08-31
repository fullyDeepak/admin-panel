'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  GeoJSONProps,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  GeoJSON as LeafletGeoJSON,
  Icon,
  LatLngTuple,
  LatLngBoundsExpression,
  Layer,
  LatLngBounds,
} from 'leaflet';
import pinIcon from './pin.png';
import { ghmcArea, ghmcWardsCircle, ghmcZones } from '@/data/data';
import './leaflet.css';
import * as geojson from 'geojson';
import bboxCalculator from '@turf/bbox';
import { AllGeoJSON } from '@turf/helpers';
import MapBounds from './MapBound';

type Props = {
  mapGeoJson: {
    type: 'FeatureCollection';
    features: {
      type: 'Feature';
      geometry: object;
      properties: {
        id: number;
        name: string;
      };
    }[];
  } | null;
  selectionType: 'DIST' | 'MNDL' | 'VILG' | 'SRVY';
  setSelection: (_value: number) => void;
};

export default function DMVSmap({
  mapGeoJson,
  selectionType: _,
  setSelection,
}: Props) {
  const center: LatLngTuple = [22, 75];
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
  const _customIcon = new Icon({
    iconUrl: pinIcon.src,
    iconSize: [32, 32],
  });

  function onEachFeature(feature: geojson.Feature, layer: Layer) {
    if (
      feature.properties &&
      feature.properties.name &&
      feature.properties.circle
    ) {
      layer.bindPopup(
        feature.properties.circle + '<br>' + feature.properties.name
      );
    } else if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  }

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
    layer.bindTooltip(feature.properties?.name, {
      permanent: true,
      direction: 'center',
      className: 'leaflet-labels',
    });
    layer.on('click', function (e) {
      setSelection(feature.properties.id);
      console.log(
        `Clicked on name:${e.target.feature.properties.name} id:${e.target.feature.properties.id}`
      );
    });
    layer.bindPopup(feature.properties?.name);
  }

  const [currentBoundArea, setCurrentBoundArea] = useState<LatLngBounds | null>(
    null
  );
  const [newMapGeoJson, setNewMapGeoJson] = useState(mapGeoJson);

  const _geoJSONLayer = useRef<LeafletGeoJSON | null>(null);

  //   useEffect(() => {
  //     if (geoJSONLayer.current) {
  //       geoJSONLayer.current.clearLayers();
  //       console.dir(mapGeoJson);
  //       geoJSONLayer.current.addData(mapGeoJson);
  //     }
  //     // handleFlyToBound(mapGeoJson.bbox);
  //   }, [mapGeoJson]);
  function FlyMapTo() {
    const map = useMap();
    useEffect(() => {
      if (mapGeoJson && newMapGeoJson !== mapGeoJson) {
        const bbox = bboxCalculator(mapGeoJson as AllGeoJSON);
        const boundArea: LatLngBoundsExpression = [
          [bbox[1], bbox[2]],
          [bbox[3], bbox[0]],
        ];
        map.flyToBounds(boundArea, {
          duration: 1.9,
        });
        setNewMapGeoJson(mapGeoJson);
      }
    }, [mapGeoJson]);
    return null;
  }
  return (
    <div className='mb-40 flex w-full flex-col items-center justify-center'>
      <span className='py-3 text-center text-2xl font-semibold'>Maps View</span>
      <div className='mx-auto h-[70vh] w-[93%]'>
        <MapContainer center={center} zoom={4} scrollWheelZoom={true}>
          <FlyMapTo />
          <MapBounds setArea={setCurrentBoundArea} />
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
                  // detectRetina={true}
                />
              </LayersControl.BaseLayer>
            ))}
            {mapGeoJson && (
              <GeoJSON
                //   ref={geoJSONLayer}
                key={JSON.stringify(mapGeoJson)}
                data={mapGeoJson}
                style={{ color: 'dodgerblue' }}
                onEachFeature={renderLabel}
              />
            )}

            <LayersControl.Overlay name='Markers'>
              <LayerGroup>marker</LayerGroup>
              <LayersControl.Overlay name='GHMC Area'>
                <GeoJSON
                  data={ghmcArea as GeoJSONProps['data']} // ghmcArea
                  style={{ color: 'red' }}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name='GHMC Circle & Wards'>
                <GeoJSON
                  data={ghmcWardsCircle as GeoJSONProps['data']}
                  style={{ color: 'green' }}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name='GHMC Zones'>
                <GeoJSON
                  data={ghmcZones as GeoJSONProps['data']}
                  style={{ color: 'black' }}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
      <div className='mx-auto p-5'>
        <p>Current Bound box</p>
        {currentBoundArea && (
          <p className='w-full bg-slate-200 p-2 text-xs [font-family:monospace]'>
            {JSON.stringify(currentBoundArea, null, 2)}
          </p>
        )}
      </div>
    </div>
  );
}

// EPSG:32644
// 4326

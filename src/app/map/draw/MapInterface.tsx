'use client';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import { computeArea } from 'spherical-geometry-js';
import GeomanDrawer from './GeomanDrawer';
export default function MapInterface() {
  const center: LatLngTuple = [17.418136769166217, 78.33019660095187];
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

  const [geoJsonData, setGeoJsonData] = useState<any[]>([]);
  const [area, setArea] = useState<number[]>();

  useEffect(() => {
    const areas = geoJsonData.map((geo) => {
      if (geo.geometry.type === 'Polygon') {
        return computeArea(geo.geometry.coordinates[0]);
      } else {
        return 0;
      }
    });
    setArea(areas);
  }, [geoJsonData]);
  return (
    <div className='mb-40 flex w-full flex-col items-center justify-center'>
      <div className='flex w-full justify-around'>
        <span className='py-3 text-center text-2xl font-semibold'>
          Draw on Map
        </span>
      </div>
      {area?.map((item, index) => {
        return (
          <div key={index} className='flex w-full justify-around'>
            <span className='py-3 text-center text-2xl font-semibold'>
              Area: {(item * 1.196).toFixed(2)} yd<sup>2</sup>
            </span>
          </div>
        );
      })}
      <div className='mx-auto flex h-[70vh] w-full max-w-[90%] gap-2'>
        <MapContainer
          center={center}
          zoom={12}
          maxZoom={18}
          scrollWheelZoom={true}
          className='h-full min-h-[100px] w-full min-w-[200px] flex-[4] rounded-2xl border-[3px] border-[#9CAA71] shadow-[0px_0px_6px_2px_#00000024]'
        >
          <GeomanDrawer setGeoJsonData={setGeoJsonData} />
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
            onClick={() => setGeoJsonData([])}
          >
            Clear
          </button>
          <pre className='max-h-[500px] overflow-y-auto bg-gray-200 font-mono text-sm'>
            {JSON.stringify(geoJsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

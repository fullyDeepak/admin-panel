'use client';
import React from 'react';
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngTuple } from 'leaflet';
import './leaflet.css';

export default function MapInterface() {
  // 17.405554296679586, lng: 78.47234601561512
  const center: LatLngTuple = [17.4, 78.47];
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

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      className='h-full min-h-[400px] rounded-2xl border-[3px] border-[#9CAA71] shadow-[0px_0px_6px_2px_#00000024]'
    >
      <LayersControl>
        {mapLayer?.map((item, i) => (
          <LayersControl.BaseLayer name={item.name} key={i} checked={i === 0}>
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
  );
}

'use client';
import React, { useEffect } from 'react';
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds, LatLngTuple } from 'leaflet';
import './leaflet.css';
import { ProjectCordWithinVillage } from './MapUI';
import projectPin from './project-marker.png';
import selectPin from './select-pin.png';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';

export default function MapInterface() {
  const {
    mapData,
    setSelectedMapProject,
    selectedMapProject,
    setAttachedMapData,
    selectedDMV,
    selectedCleanProjectId,
  } = useVillageProjectCleanerStore();
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
  const projectIcon = new Icon({
    iconUrl: projectPin.src,
    iconSize: [38, 38],
  });

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

    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      className='h-full !min-h-[400px] rounded-2xl border-[3px] border-[#9CAA71] shadow-[0px_0px_6px_2px_#00000024]'
    >
      <FitBounds mapData={mapData} />
      {mapData?.map((project) => (
        <>
          <Marker
            position={[
              project.geometry.location.lat,
              project.geometry.location.lng,
            ]}
            icon={
              selectedMapProject?.place_id === project.place_id
                ? selectIcon
                : projectIcon
            }
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
                <span className='break-all'>Place Id: {project.place_id}</span>
                <span>Type: {project.types}</span>
                <button
                  className='btn btn-accent btn-sm max-w-fit'
                  onClick={() => {
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
                >
                  Select
                </button>
              </div>
            </Popup>
          </Marker>
        </>
      ))}
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

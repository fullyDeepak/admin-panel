'use client';
import React from 'react';
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  GeoJSONProps,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon, Icon, LatLngTuple } from 'leaflet';
import './leaflet.css';
import MapBound from './MapBound';
import { useProjectMapStore } from './useProjectMapStore';
import projectPin from './project-marker.png';
import villaPin from './villa-marker.png';
import CustomPopup from './CustomPopup';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { orrOutline } from '@/data/data';
import L, { MarkerCluster } from 'leaflet';

export default function MapInterface() {
  // 17.405554296679586, lng: 78.47234601561512
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

  const projectList = useProjectMapStore((state) => state.projectList);
  const projectIcon = divIcon({
    html: `<span></span>`,
    className:
      'bg-[#f9a898] pulse-dot hover:z-50 anim duration-300 transition-all shadow-[0px_0px_3px_0px_#00000024] hover:bg-[#a45e52] font-gsans border-2 border-[#a45e52] rounded-full',
    iconSize: L.point(16, 16),
  });
  const villaIcon = new Icon({
    iconUrl: villaPin.src,
    iconSize: [38, 38],
  });

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    const count = cluster.getChildCount();
    const newCount: string =
      count % 10 === 0 || count < 10
        ? count.toString()
        : `${Math.floor(count / 10) * 10}+`;
    return L.divIcon({
      html: `<span>${newCount}</span>`,
      className:
        'bg-[#a45e52]/70 duration-300 transition-all shadow-[0px_0px_3px_0px_#00000024] hover:bg-[#a45e52] leading-[45px] font-gsans border border-[#a45e52] rounded-full text-white text-lg text-center',
      iconSize: L.point(50, 50, true),
    });
  };

  return (
    <div className='mb-40 flex w-full flex-col items-center justify-center'>
      <div className='flex w-full justify-around'>
        <span className='py-3 text-center text-2xl font-semibold'>
          Maps View
        </span>
      </div>
      <div className=''></div>
      <div className='mx-auto h-[70vh] w-[93%]'>
        <MapContainer
          center={center}
          zoom={12}
          maxZoom={18}
          scrollWheelZoom={true}
          className='rounded-2xl border-[3px] border-[#9CAA71] shadow-[0px_0px_6px_2px_#00000024]'
        >
          <MapBound />
          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon}
            chunkedLoading
            showCoverageOnHover={false}
            removeOutsideVisibleBounds={true}
            disableClusteringAtZoom={14} //discuss this
          >
            {projectList.map((project, index) => (
              <Marker
                position={[project.lat, project.lng]}
                icon={
                  project.display_project_type === 'APARTMENT'
                    ? projectIcon
                    : divIcon({
                        html: `<span>&#8377;123k</span>`,
                        className:
                          'bg-[#a45e52] pulse-dot text-center text-white duration-300 transition-all shadow-[0px_0px_3px_0px_#00000024] hover:bg-[#a45e52] font-gsans border-2 border-[#a45e52] rounded-full',
                        iconSize: L.point(50, 20, true),
                      })
                }
                key={'marker' + index}
                eventHandlers={{
                  mouseover: (event) => event.target.openPopup(),
                  mouseout: (event) => event.target.closePopup(),
                }}
              >
                <Popup>
                  <CustomPopup
                    projectName={project.name}
                    projectType={project.display_project_type}
                  />
                </Popup>

                {/* <Tooltip permanent direction='center'>
                  TOOLTIP
                </Tooltip> */}
              </Marker>
            ))}
          </MarkerClusterGroup>
          {/* {projectList.map((project) => (
            <GeoJSON
              //   ref={geoJSONLayer}
              key={'geojson' + project.id}
              data={project.geojson}
              style={{
                color:
                  project.display_project_type === 'APARTMENT'
                    ? 'red'
                    : 'dodgerblue',
              }}
              // onEachFeature={renderLabel}
            />
          ))} */}
          <GeoJSON
            data={orrOutline as GeoJSONProps['data']}
            style={{ color: '#A45E52' }}
          />
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
      </div>
    </div>
  );
}

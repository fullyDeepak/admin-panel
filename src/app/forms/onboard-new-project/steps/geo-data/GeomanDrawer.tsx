// @ts-nocheck

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L, { Icon } from 'leaflet';
import png from 'leaflet/dist/images/marker-icon.png';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type Props = {
  setGeoJsonData: (_d) => void;
};
export default function GeomanDrawer({ setGeoJsonData }: Props) {
  const map = useMap();
  const markerIcon = new Icon({
    iconUrl: png.src,
    iconSize: [38, 38],
  });
  console.log(JSON.stringify(markerIcon));
  useEffect(() => {
    map?.pm?.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
      drawText: true,
      rotateMode: false,
    });
    map.on('pm:create', (e) => {
      const layer = e.layer;

      console.log('Created Layer', e);
      console.log('Adding Edit Listener');
      layer.on('pm:edit', (e) => {
        console.log('Edited');
        console.log(e);
        const toSet = map.pm.getGeomanLayers().map((layer) => {
          console.log('Layer', layer);
          let geojson = layer.toGeoJSON();
          if (layer.options.textMarker) {
            geojson = {
              ...geojson,
              properties: {
                ...geojson.properties,
                text: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        setGeoJsonData(toSet);
      });
      layer.on('pm:remove', (e) => {
        console.log('deleted');
        console.log(e);
        const toSet = map.pm.getGeomanLayers().map((layer) => {
          console.log('Layer', layer);
          let geojson = layer.toGeoJSON();
          if (layer.options.textMarker) {
            geojson = {
              ...geojson,
              properties: {
                ...geojson.properties,
                text: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        setGeoJsonData(toSet);
      });
      if (e.shape === 'marker') {
        const marker = layer as L.Marker;
        marker.setIcon(markerIcon);
      }
      const toSet = map.pm.getGeomanLayers().map((layer) => {
        console.log('Layer', layer.toGeoJSON());
        return layer.toGeoJSON();
      });
      console.log(toSet);
      setGeoJsonData(toSet);
      map.pm.getGeomanLayers().forEach((layer) => {
        console.log('Layer', layer.toGeoJSON());
      });
    });
    return () => {
      map.off('pm:create');
    };
  }, [map]);

  function clearMapData() {
    map.pm.getGeomanLayers().map((layer) => {
      map.removeLayer(layer);
    });
    setGeoJsonData([]);
  }

  return (
    <div className='relative left-[10px] top-20 z-[10000] w-fit'>
      <button
        className='flex size-8 items-center justify-center rounded bg-red-500 p-1 text-white'
        onClick={clearMapData}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

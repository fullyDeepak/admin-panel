// @ts-nocheck

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L, { Icon } from 'leaflet';
import png from 'leaflet/dist/images/marker-icon.png';
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
      drawMarker: true,
      drawCircleMarker: true,
      drawPolyline: true,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
      drawText: true,
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

  return null;
}

import { Dispatch, SetStateAction, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import markerPin from '../../map/project/project-marker.png';
import { Icon } from 'leaflet';
import L from 'leaflet';

type Props = {
  setGeoJsonData: Dispatch<SetStateAction<any[]>>;
};

export default function GeomanDrawer({ setGeoJsonData }: Props) {
  const map = useMap();
  const markerIcon = new Icon({
    iconUrl: markerPin.src,
    iconSize: [38, 38],
  });

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
    });

    map.on('pm:create', (e) => {
      const layer = e.layer;
      if (layer instanceof L.Marker) {
        const marker = layer as L.Marker;
        marker.setIcon(markerIcon);
      }
      //@ts-expect-error
      const geoJsonData = layer?.toGeoJSON();
      console.log('GeoJSON Data:', geoJsonData);
      setGeoJsonData((prev) => [...prev, geoJsonData]);
    });
    return () => {
      map.off('pm:create');
    };
  }, [map]);

  return null;
}

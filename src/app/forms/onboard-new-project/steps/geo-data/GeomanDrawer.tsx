//@ts-nocheck

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L, { Icon } from 'leaflet';
import png from 'leaflet/dist/images/marker-icon.png';
import _ from 'lodash';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { computeArea } from 'spherical-geometry-js';

type Props = {
  geoJsonData: any[];
  setGeoJsonData: (_d) => void;
  setArea: (_d: number) => void;
};
export default function GeomanDrawer({
  setGeoJsonData,
  geoJsonData,
  setArea,
}: Props) {
  const map = useMap();
  const markerIcon = new Icon({
    iconUrl: png.src,
    iconSize: [38, 38],
  });
  useEffect(() => {
    console.log(map);
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
    for (const geoJson of geoJsonData) {
      console.log('Adding geojson', geoJson);
      const layer_to_add = L.geoJSON(geoJson);
      if (geoJson.properties?.name) {
        layer_to_add.bindPopup(geoJson.properties.name);
      }
      layer_to_add.on('pm:edit', (e) => {
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
                name: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        const totalArea = _.sum(
          toSet.map((geo) => {
            if (geo.geometry.type !== 'Polygon') return null;
            const latlongs = geo.geometry.coordinates[0];
            console.log(latlongs);
            const computedArea = computeArea(latlongs);
            return parseFloat((computedArea * 1.196).toFixed(2));
          })
        );
        setArea(totalArea);
        setGeoJsonData(toSet);
      });
      layer_to_add.on('pm:remove', (e) => {
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
                name: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        const totalArea = _.sum(
          toSet.map((geo) => {
            if (geo.geometry.type !== 'Polygon') return null;
            const latlongs = geo.geometry.coordinates[0];
            console.log(latlongs);
            const computedArea = computeArea(latlongs);
            return parseFloat((computedArea * 1.196).toFixed(2));
          })
        );
        setArea(totalArea);
        setGeoJsonData(toSet);
      });
      layer_to_add.addTo(map);
    }
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
                name: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        const totalArea = _.sum(
          toSet.map((geo) => {
            if (geo.geometry.type !== 'Polygon') return null;
            const latlongs = geo.geometry.coordinates[0];
            console.log(latlongs);
            const computedArea = computeArea(latlongs);
            return parseFloat((computedArea * 1.196).toFixed(2));
          })
        );
        setArea(totalArea);
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
                name: layer.options.text,
              },
            };
          }
          return geojson;
        });
        console.log(toSet);
        const totalArea = _.sum(
          toSet.map((geo) => {
            if (geo.geometry.type !== 'Polygon') return null;
            const latlongs = geo.geometry.coordinates[0];
            console.log(latlongs);
            const computedArea = computeArea(latlongs);
            return parseFloat((computedArea * 1.196).toFixed(2));
          })
        );
        setArea(totalArea);
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
      const totalArea = _.sum(
        toSet.map((geo) => {
          if (geo.geometry.type !== 'Polygon') return null;
          const latlongs = geo.geometry.coordinates[0];
          console.log(latlongs);
          const computedArea = computeArea(latlongs);
          return parseFloat((computedArea * 1.196).toFixed(2));
        })
      );
      setArea(totalArea);
      setGeoJsonData(toSet);
      map.pm.getGeomanLayers().forEach((layer) => {
        console.log('Layer', layer.toGeoJSON());
      });
    });
    return () => {
      map.off('pm:create');
      map.off('pm:remove');
      map.eachLayer((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [map._leaflet_id]);

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

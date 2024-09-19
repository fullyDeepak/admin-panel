import { useMapEvents } from 'react-leaflet';
import { useProjectMapStore } from './useProjectMapStore';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';

export default function MapBound() {
  const setCurrentBoundArea = useProjectMapStore(
    (state) => state.setCurrentBoundArea
  );
  const updateBoundArea = useCallback(
    debounce((bound) => {
      setCurrentBoundArea({
        sw_lng: bound.getSouthWest().lng,
        sw_lat: bound.getSouthWest().lat,
        ne_lng: bound.getNorthEast().lng,
        ne_lat: bound.getNorthEast().lat,
      });
    }, 300),
    [setCurrentBoundArea]
  );
  const map = useMapEvents({
    moveend: () => {
      const bound = map.getBounds();
      updateBoundArea(bound);
    },
  });
  console.log({
    center: map.getCenter().toString(),
    zoom: map.getZoom(),
    size: map.getSize(),
    bound: {
      sw_lng: map.getBounds().getSouthWest().lng,
      sw_lat: map.getBounds().getSouthWest().lat,
      ne_lng: map.getBounds().getNorthEast().lng,
      ne_lat: map.getBounds().getNorthEast().lat,
    },
  });
  useEffect(() => {
    return () => updateBoundArea.cancel();
  }, [updateBoundArea]);
  return null;
}

import { useMapEvents } from 'react-leaflet';
import { useProjectMapStore } from './useProjectMapStore';

export default function MapBound() {
  const { setCurrentBoundArea } = useProjectMapStore();
  const map = useMapEvents({
    moveend: () => {
      const _timeoutId = setTimeout(() => {
        const bound = map.getBounds();
        bound.getSouthWest().lng;
        bound.getSouthWest().lat;
        bound.getNorthEast().lng;
        bound.getNorthEast().lat;
        setCurrentBoundArea({
          sw_lng: bound.getSouthWest().lng,
          sw_lat: bound.getSouthWest().lat,
          ne_lng: bound.getNorthEast().lng,
          ne_lat: bound.getNorthEast().lat,
        });
        console.log({
          sw_lng: bound.getSouthWest().lng,
          sw_lat: bound.getSouthWest().lat,
          ne_lng: bound.getNorthEast().lng,
          ne_lat: bound.getNorthEast().lat,
        });
      }, 500);
      // clearTimeout(timeoutId);
    },
  });
  return null;
}

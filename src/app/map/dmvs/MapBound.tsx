import { LatLngBounds } from 'leaflet';
import React from 'react';
import { useMapEvents } from 'react-leaflet';

export default function MapBound({
  setArea,
}: {
  setArea: React.Dispatch<React.SetStateAction<LatLngBounds | null>>;
}) {
  const map = useMapEvents({
    moveend: () => {
      const bound = map.getBounds();
      setArea(bound);
    },
  });
  return null;
}

'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Page() {
  const MapInterface = useMemo(
    () =>
      dynamic(() => import('./MapInterface'), {
        ssr: false,
      }),
    []
  );
  return (
    <div>
      <MapInterface />
    </div>
  );
}

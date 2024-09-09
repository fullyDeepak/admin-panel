'use client';

import dynamic from 'next/dynamic';
const MapInterface = dynamic(() => import('./MapInterface'), {
  ssr: false,
});

export default function MapUI() {
  return (
    <div className='w-full'>
      <MapInterface />
    </div>
  );
}

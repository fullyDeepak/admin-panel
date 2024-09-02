import Link from 'next/link';
import React from 'react';

export default function MapPage() {
  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <h1 className='mb-4 text-center text-3xl font-semibold underline'>
        Select Map
      </h1>

      <div className='mt-5 flex flex-wrap justify-evenly gap-10'>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <Link
            href={'/map/dmvs'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            DMVS Map
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <Link
            href={'/map/project'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Project Map
          </Link>
        </div>
      </div>
    </div>
  );
}

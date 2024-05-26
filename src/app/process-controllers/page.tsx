import Link from 'next/link';
import React from 'react';

export default function ProcessControllers() {
  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <h1 className='mb-4 text-center text-3xl font-semibold underline'>
        Select Controller
      </h1>

      <div className='mt-5 flex flex-wrap justify-evenly gap-10'>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>TM Controller</h2>
          <Link
            href={'/process-controllers/start-etl'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            ETL Process
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>UM Controller</h2>
          <Link
            href={'/process-controllers/um-generator'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            UM Generator
          </Link>
        </div>
      </div>
    </div>
  );
}

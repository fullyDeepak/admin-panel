'use client';

import React from 'react';
import StaticDataForm from './StaticDataForm';

export default function Page() {
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h1 className='self-center text-2xl md:text-3xl'>
          Onboard New Project
        </h1>
        <form
          className='mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
          id='projectTowerForm'
        >
          <StaticDataForm />
        </form>
      </div>
    </>
  );
}

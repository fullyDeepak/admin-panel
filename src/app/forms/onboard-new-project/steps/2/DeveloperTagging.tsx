'use client';

import { MasterDevelopers } from '@/components/dropdowns/MasterDevelopers';
import React from 'react';
import Keywords from './Keywords';

export default function DeveloperTagging() {
  // 3 queries
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h2 className='self-center text-2xl md:text-3xl'>Keyword Tagger</h2>
        <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          {/* 1 Keyword Tagger to Tag Landlord and Developer Keywords*/}
          {/* Show Keywords from TM | RERA || mapped */}
          <Keywords />
        </div>
        <h2 className='self-center text-2xl md:text-3xl'>
          Tag Developer To Project
        </h2>
        <div className='z-10 mt-5 flex min-h-60 w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          {/* 2  Developer Id Assigner, show only master developers and JVs to directly tag to this project, prepopulate from temp_developers if already assigned, else ask to select */}
          <MasterDevelopers className='w-full' />
        </div>
      </div>
    </>
  );
}

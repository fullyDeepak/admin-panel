import Link from 'next/link';
import React from 'react';

export default function page() {
  return (
    <div className='mx-auto mt-10 flex w-[90%] flex-col'>
      <h1 className='mb-4 text-3xl'>Select Forms</h1>
      <div className='flex flex-wrap justify-evenly gap-10'>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-xl font-semibold'>Village & SRO Forms</h2>
          <Link
            href={'/forms/village-replacement'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            Village Replacement
          </Link>
          <Link
            href={'/forms/village-onboarding'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            Village Onboarding
          </Link>
          <Link
            href={'/forms/sro-scraper'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            SRO Scraper
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-xl font-semibold'>Project Tower Forms</h2>
          <Link
            href={'/forms/project-tower'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            Onboard New Project Tower
          </Link>
          <Link
            href={'/forms/project-tower-edit'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            Update Project Tower Data
          </Link>
          <Link
            href={'/forms/project-tower-add-survey'}
            className='link-hover btn link flex items-center active:btn-success hover:text-black active:text-white'
          >
            Add Survey to Existing Project
          </Link>
        </div>
      </div>
    </div>
  );
}

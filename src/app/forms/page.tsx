import Link from 'next/link';
import React from 'react';

export default function page() {
  return (
    <div className='mx-auto mt-10 flex w-[90%] flex-col'>
      <h1 className='mb-4 text-3xl'>Select Forms</h1>
      <div className='flex w-fit flex-col gap-2 text-gray-500'>
        <Link
          href={'/forms/village-replacement'}
          className='link-hover btn link flex items-center active:btn-success hover:text-black'
        >
          Village Replacement
        </Link>
        <Link
          href={'/forms/village-onboarding'}
          className='link-hover btn link flex items-center active:btn-success hover:text-black'
        >
          Village Onboarding
        </Link>
        <Link
          href={'/forms/sro-scraper'}
          className='link-hover btn link flex items-center active:btn-success hover:text-black'
        >
          SRO Scraper
        </Link>
        <Link
          href={'/forms/project-tower'}
          className='link-hover btn link flex items-center active:btn-success hover:text-black'
        >
          Project Tower Tagging
        </Link>
        <Link
          href={'/forms/project-tower-edit'}
          className='link-hover btn link flex items-center bg-red-300  active:btn-error hover:text-black'
        >
          Edit Project Tower Tagging
        </Link>
      </div>
    </div>
  );
}

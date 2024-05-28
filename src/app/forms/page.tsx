import Link from 'next/link';
import React from 'react';

export default function FormHomePage() {
  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <h1 className='mb-4 text-center text-3xl font-semibold underline'>
        Select Form
      </h1>
      <div className='mt-5 flex flex-wrap justify-evenly gap-10'>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Village & SRO Forms
          </h2>
          <Link
            href={'/forms/village-replacement'}
            className=' btn flex items-center active:btn-success hover:text-black active:text-white'
          >
            Village Replacement
          </Link>
          <Link
            href={'/forms/village-onboarding'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            Village Onboarding
          </Link>
          <Link
            href={'/forms/sro-scraper'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            SRO Scraper
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>RERA</h2>
          <Link
            href={'/forms/rera-correction'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            DMV Correction Form
          </Link>
          <Link
            href={'/forms/rera-project-status'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            Project Status
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Project Tower Forms
          </h2>
          <Link
            href={'/forms/project-tower-rera'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            Onboard Project
          </Link>
          <Link
            href={'/forms/project-tower-edit'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            Update Project
          </Link>
          <Link
            href={'/forms/image-tagging'}
            className='btn  flex items-center active:btn-success hover:text-black active:text-white'
          >
            Image Tagging
          </Link>
        </div>
      </div>
    </div>
  );
}

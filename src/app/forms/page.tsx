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
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Village Replacement
          </Link>
          <Link
            href={'/forms/village-onboarding'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Village Onboarding
          </Link>
          <Link
            href={'/forms/sro-scraper'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            SRO Scraper
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Correction Forms
          </h2>
          <Link
            href={'/forms/rera-correction'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            RERA DMV
          </Link>
          <Link
            href={'/forms/unit-master-correction'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            UM Manual
          </Link>
          <Link
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
            href={'/forms/village-project-cleaner'}
          >
            Village Project Cleaner
          </Link>
          <Link
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
            href={'/forms/dev-tagger'}
          >
            Developer Tagger
          </Link>
          <Link
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
            href={'/forms/root-doc-verification'}
          >
            Root Doc Verification
          </Link>
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Project Tower Forms
          </h2>
          <Link
            href={'/forms/onboard-new-project'}
            className='btn relative flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            <span className='absolute -right-2 -top-1 rotate-45 rounded-full bg-violet-600 px-1 text-[8px] text-white'>
              NEW
            </span>
            Onboard Project Part - I
          </Link>
          <Link
            href={'/forms/onboard-new-project-part-ii'}
            className='btn relative flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            <span className='absolute -right-2 -top-1 rotate-45 rounded-full bg-violet-600 px-1 text-[8px] text-white'>
              NEW
            </span>
            Onboard Project Part - II
          </Link>
          <Link
            href={'/forms/update-project'}
            className='btn relative flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            <span className='absolute -right-2 -top-1 rotate-45 rounded-full bg-violet-600 px-1 text-[8px] text-white'>
              NEW
            </span>
            Update Project Part - I
          </Link>
          <Link
            href={'/forms/project-tower-rera'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Onboard Project
          </Link>
          <Link
            href={'/forms/project-tower-edit'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Update Project
          </Link>
          <Link
            href={'/forms/image-tagging'}
            className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
          >
            Image Tagging
          </Link>
        </div>
      </div>
    </div>
  );
}

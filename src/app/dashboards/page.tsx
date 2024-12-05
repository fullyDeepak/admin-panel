import Link from 'next/link';
import React from 'react';

export default function FormHomePage() {
  const errorLinks = [
    {
      label: 'Error Stat',
      href: '/dashboards/error-stats-table',
    },
    {
      label: 'Tower Unit',
      href: '/dashboards/unit-error-dashboard',
    },
  ];
  const otherLinks = [
    {
      label: 'Village',
      href: '/dashboards/village',
    },
  ];
  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <h1 className='mb-4 text-center text-3xl font-semibold underline'>
        Dashboards
      </h1>
      <div className='mt-5 flex flex-wrap justify-evenly gap-10'>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Error Dashboards
          </h2>
          {errorLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex w-fit flex-col gap-4 text-gray-500'>
          <h2 className='text-center text-xl font-semibold'>
            Other Dashboards
          </h2>
          {otherLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='btn flex items-center hover:text-black active:border-none active:bg-violet-600 active:text-white'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

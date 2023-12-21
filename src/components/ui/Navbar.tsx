'use client';

import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

const hamburger = (
  <svg
    className='swap-off fill-current'
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    viewBox='0 0 512 512'
  >
    <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
  </svg>
);

const close = (
  <svg
    className='swap-on fill-current'
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    viewBox='0 0 512 512'
  >
    <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
  </svg>
);

const deskIconCss =
  'md:relative md:active:bg-transparent md:after:absolute md:after:bg-rose-500 md:after:bottom-2 md:after:left-0 md:after:h-[2px] md:after:w-full md:after:origin-bottom-right md:after:scale-x-0 md:hover:after:origin-bottom-left md:hover:after:scale-x-100 md:after:transition-transform md:after:ease-in-out md:after:duration-300';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleBurger = (e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(e.target.checked);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    // document.body.style.position = isOpen ? 'static' : 'fixed';
  };

  return (
    <div className='z-10 flex items-center justify-between bg-rose-300 px-5 py-5 md:px-10'>
      <div className='text-xl font-bold text-rose-700'>
        Rezy Admin Dashboard
      </div>
      <div className='flex uppercase'>
        <label className='btn btn-circle swap swap-rotate z-50 border-none bg-white/25 text-gray-600 hover:bg-white/25 md:hidden md:bg-transparent'>
          <input type='checkbox' checked={isOpen} onChange={handleBurger} />
          {hamburger}
          {close}
        </label>
        <div
          onClick={() => {
            setIsOpen(false);
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
          }}
          className={`fixed right-0 top-[88px] z-10 flex h-full w-full items-end md:static md:w-full md:translate-x-0 md:bg-transparent ${
            isOpen
              ? 'translate-x-[0%] bg-black/50 '
              : 'translate-x-[200%] bg-transparent'
          }`}
        >
          <div className='ml-auto flex h-full w-3/4 flex-col items-center gap-5 bg-rose-200 p-10 md:w-full md:flex-row md:bg-inherit md:p-0'>
            <Link
              className={`${deskIconCss} btn w-full bg-rose-800 text-base text-white md:btn-link hover:bg-rose-500 md:w-min md:text-gray-700 md:no-underline md:hover:bg-transparent md:hover:text-black md:hover:no-underline `}
              href='/'
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              className={`${deskIconCss} btn w-full bg-rose-800 text-base text-white md:btn-link hover:bg-rose-500 md:w-min md:text-gray-700 md:no-underline md:hover:bg-transparent md:hover:text-black md:hover:no-underline `}
              href='/forms'
              onClick={() => setIsOpen(false)}
            >
              Forms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

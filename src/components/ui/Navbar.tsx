'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { PiUserCircleDuotone } from 'react-icons/pi';
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
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const handleBurger = (e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(e.target.checked);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    // document.body.style.position = isOpen ? 'static' : 'fixed';
  };

  const menus: {
    label: string;
    href: string;
  }[] = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Forms',
      href: '/forms',
    },
    // {
    //   label: 'SQL Editor',
    //   href: '/sql-editor',
    // },
  ];

  return (
    <div className='z-10 flex items-center justify-between bg-rose-300 px-5 py-5 md:px-10'>
      <div className='order-1 flex-1 text-sm font-bold text-rose-700 lg:text-xl'>
        Rezy Admin Dashboard
      </div>
      <div className='order-3 flex flex-[0] justify-between uppercase lg:order-2 lg:flex-1'>
        <label className='btn btn-circle swap swap-rotate z-50 border-none bg-white/25 text-gray-600 hover:bg-white/25 md:bg-transparent lg:hidden'>
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
          className={`fixed right-0 top-[88px] z-10 flex h-full w-full items-end lg:static lg:w-full lg:translate-x-0 lg:bg-transparent ${
            isOpen
              ? 'translate-x-[0%] bg-black/50 '
              : 'translate-x-[200%] bg-transparent'
          }`}
        >
          <div className='ml-auto flex h-full flex-col items-center gap-5 bg-rose-200 p-10 lg:mx-auto lg:flex-row lg:bg-inherit lg:p-0'>
            {menus.map((item) => (
              <Link
                key={item.label}
                className={`${deskIconCss} btn w-full text-nowrap bg-rose-800 text-base text-white lg:btn-link hover:bg-rose-500 lg:w-min lg:text-gray-700 lg:no-underline lg:hover:bg-transparent lg:hover:text-black lg:hover:no-underline `}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className='order-2 mr-5 flex place-content-end self-end lg:order-3 lg:mr-0 lg:flex-1'>
        <div className='dropdown z-10'>
          <div tabIndex={0} role='button' className='avatar placeholder'>
            <div className='flex items-center justify-center'>
              <PiUserCircleDuotone className='mt-2 h-12 w-12 text-gray-700 lg:mt-0 lg:h-10 lg:w-10' />
            </div>
          </div>
          <ul
            tabIndex={0}
            className=' dropdown-content right-0 z-[1] w-80 rounded-lg bg-base-100 p-2 shadow-c'
          >
            <li>
              <span className='block cursor-default px-5 pb-0 pt-5 text-xl font-semibold hover:bg-transparent active:!bg-transparent '>
                Hi, {data?.user?.name?.split(' ')[0]}
              </span>
            </li>
            <li>
              <span className='block cursor-default px-5 pb-10 pt-0 text-gray-400 hover:bg-transparent active:!bg-transparent'>
                {data?.user?.email}
              </span>
            </li>
            <li className='text-center'>
              <a
                className='btn-rezy btn btn-sm mb-5 !h-5 w-2/3 divide-x px-5'
                onClick={() => signOut()}
              >
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

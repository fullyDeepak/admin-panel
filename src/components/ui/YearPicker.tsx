'use client';

import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react';
import { Menu, MenuItem, MenuDivider, MenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

type YearPickerProps = {
  classNames: string;
  year: number | undefined;
  setYear: Dispatch<SetStateAction<number | undefined>>;
  yearArray: number;
  setYearArray: Dispatch<SetStateAction<number>>;
  inputName: string;
};

export default function YearPicker({
  classNames,
  setYear,
  setYearArray,
  year,
  yearArray,
  inputName,
}: YearPickerProps) {
  const thisYear = new Date().getFullYear();

  return (
    <Menu
      menuButton={
        <input
          type='number'
          name={inputName}
          className={classNames}
          value={year}
        />
      }
      transition
    >
      <div className='flex items-center justify-between px-3 '>
        <button
          type='button'
          className='btn btn-circle btn-ghost btn-sm disabled:bg-transparent'
          onClick={() => setYearArray(yearArray - 12)}
          disabled={yearArray <= 1950 ? true : false}
        >
          <GoChevronLeft size={20} />
        </button>
        <span>{`${yearArray}-${
          yearArray + 11 < thisYear ? yearArray + 11 : thisYear
        }`}</span>
        <button
          type='button'
          className='btn btn-circle btn-ghost btn-sm disabled:bg-transparent'
          onClick={() => setYearArray(yearArray + 12)}
          disabled={thisYear >= yearArray + 12 ? false : true}
        >
          <GoChevronRight size={20} />
        </button>
      </div>
      <MenuDivider />
      <div className='grid grid-cols-3 gap-4 px-3 py-2'>
        {Array.from({ length: 12 }, (_, i) => i + yearArray).map(
          (item) =>
            item <= thisYear && (
              <MenuItem key={item}>
                <span
                  className='btn btn-sm border-none bg-rose-300 hover:bg-rose-400'
                  onClick={(e: MouseEvent<HTMLSpanElement>) => {
                    setYear(+e.currentTarget.innerText);
                  }}
                >
                  {item}
                </span>
              </MenuItem>
            )
        )}
      </div>
    </Menu>
  );
}

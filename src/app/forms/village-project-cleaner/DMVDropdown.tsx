'use client';

// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';
import { SingleValue } from 'react-select';

export default function DMVDropdown() {
  const { dmvOptions, selectedDMV, setSelectedDMV } =
    useVillageProjectCleanerStore();
  return (
    <div className='z-10 mt-5 flex w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>District:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          options={dmvOptions.district || []}
          value={selectedDMV.district}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setSelectedDMV('district', e);
            setSelectedDMV('mandal', null);
          }}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
        <Select
          className='w-full flex-[5]'
          key={'mandal'}
          options={dmvOptions.mandal || []}
          value={selectedDMV.mandal}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setSelectedDMV('mandal', e);
            setSelectedDMV('village', null);
          }}
          isDisabled={Boolean(!selectedDMV.district)}
        />
      </label>
      <label className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-base md:text-xl'>Village:</span>
        <Select
          className='w-full flex-[5]'
          key={'village'}
          options={dmvOptions.village || []}
          value={selectedDMV.village}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => setSelectedDMV('village', e)}
          isDisabled={Boolean(!selectedDMV.mandal)}
        />
      </label>
    </div>
  );
}

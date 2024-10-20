'use client';

import React, { useEffect } from 'react';
import {
  useCorrectionStore,
  useCorrectionStoreState,
} from './useCorrectionStore';
import { usePathname } from 'next/navigation';
import SROSection from './SROSection';
import ReraFilterSection from './ReraFilterSection';
import ReraTableSection from './ReraTableSection';

export default function ReraCorrectionPage() {
  const { selectedReraMandal, selectedReraVillage } = useCorrectionStoreState();

  const { setFormData, resetAll } = useCorrectionStore();

  useEffect(() => {
    resetAll();
  }, [usePathname]);

  useEffect(() => {
    // setSelectedReraLocality(null);
    setFormData('selectedReraLocality', null);
  }, [selectedReraMandal?.value]);

  useEffect(() => {
    // setSelectedReraLocality(null);
    setFormData('selectedReraLocality', null);
  }, [selectedReraVillage?.value]);

  return (
    <div className='mx-auto mt-10 flex w-[90%] flex-col'>
      <h1 className='self-center text-3xl'>Form: RERA Correction</h1>
      <div className='flex justify-start gap-5'>
        <SROSection />
        <ReraFilterSection />
      </div>
      <ReraTableSection />
    </div>
  );
}

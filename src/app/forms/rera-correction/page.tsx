'use client';

import React, { useEffect } from 'react';
import { useCorrectionStore } from './useCorrectionStore';
import { usePathname } from 'next/navigation';
import SROSection from './SROSection';
import ReraFilterSection from './ReraFilterSection';
import ReraTableSection from './ReraTableSection';
import DevTaggerForm from './../dev-tagger/page';
import DevTaggerPanels from './DevTaggerPanels';

export default function ReraCorrectionPage() {
  const { updateCorrectionFormData, resetAll, correctionData } =
    useCorrectionStore();

  useEffect(() => {
    resetAll();
  }, [usePathname]);

  useEffect(() => {
    // setSelectedReraLocality(null);
    updateCorrectionFormData('selectedReraLocality', null);
  }, [correctionData.selectedReraMandal?.value]);

  useEffect(() => {
    // setSelectedReraLocality(null);
    updateCorrectionFormData('selectedReraLocality', null);
  }, [correctionData.selectedReraVillage?.value]);

  return (
    <div className='mx-auto mb-40 mt-10 flex w-[90%] flex-col'>
      <h1 className='self-center text-3xl'>Form: RERA Correction</h1>
      <div className='flex flex-col justify-start gap-5 xl:flex-row'>
        <SROSection />
        <ReraFilterSection />
      </div>
      <ReraTableSection />
      <div className='divider'></div>
      <DevTaggerPanels />
    </div>
  );
}

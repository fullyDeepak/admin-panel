'use client';

import { MasterDevelopers } from '@/components/dropdowns/MasterDevelopers';
import React, { useState } from 'react';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { DocAttachTable } from './DocAttachTable';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<
  {
    execution_date: string;
    project_id: string;
    doc_id: string;
    deed_type: string;
    occurrence_count: string;
    cp1: string;
    cp2: string;
    extent: string;
    area_attached: boolean;
    doc_id_schedule: string;
    project_attached: boolean;
  }[]
>();

const docColumns = [];
export default function DeveloperTagging() {
  // 3 queries
  const { onboardingData } = useOnboardingDataStore();
  const [developmentAgreements, setDevelopmentAgreements] = useState<
    {
      execution_date: string;
      project_id: string;
      doc_id: string;
      deed_type: string;
      occurrence_count: string;
      cp1: string;
      cp2: string;
      extent: string;
      area_attached: boolean;
      doc_id_schedule: string;
      project_attached: boolean;
    }[]
  >([]);
  const [linkedDocs, setLinkedDocs] = useState<
    {
      execution_date: string;
      project_id: string;
      doc_id: string;
      deed_type: string;
      occurrence_count: string;
      cp1: string;
      cp2: string;
      extent: string;
      area_attached: boolean;
      doc_id_schedule: string;
      project_attached: boolean;
    }[]
  >([]);
  useQuery({
    queryKey: ['development-agreements', onboardingData.selectedTempProject],
    queryFn: async () => {
      if (!onboardingData.selectedTempProject) return [];
      const res = await axiosClient.get<{
        data: {
          execution_date: string;
          project_id: string;
          doc_id: string;
          deed_type: string;
          occurrence_count: string;
          cp1: string;
          cp2: string;
          extent: string;
          area_attached: boolean;
          doc_id_schedule: string;
          project_attached: boolean;
        }[];
      }>('/onboarding/root_docs/development-agreements', {
        params: { project_id: onboardingData.selectedTempProject.value },
      });
      setDevelopmentAgreements(res.data.data);
      return res.data.data;
    },
  });
  useQuery({
    queryKey: ['linked-docs', onboardingData.selectedTempProject],
    queryFn: async () => {
      if (!onboardingData.selectedTempProject) return [];
      const res = await axiosClient.get<{
        data: {
          execution_date: string;
          project_id: string;
          doc_id: string;
          deed_type: string;
          occurrence_count: string;
          cp1: string;
          cp2: string;
          extent: string;
          area_attached: boolean;
          doc_id_schedule: string;
          project_attached: boolean;
        }[];
      }>('/onboarding/root_docs/linked-docs', {
        params: { project_id: onboardingData.selectedTempProject.value },
      });
      setLinkedDocs(res.data.data);
      return res.data.data;
    },
  });
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h2 className='mt-10 self-center text-2xl md:text-3xl'>
          Tag Root Docs
        </h2>
        <div className='z-10 mt-5 flex min-h-60 w-full max-w-full flex-col gap-3 self-center overflow-x-auto rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          {/* Developemnt aggreements : /onboarding/root_docs/development-agreements */}
          <h2 className='mt-10 self-center text-xl md:text-2xl'>
            Development Agreements
          </h2>
          <div className='max-h-[80dvh] overflow-y-auto'>
            <DocAttachTable
              data={developmentAgreements}
              setData={setDevelopmentAgreements}
            />
          </div>
          {/* Linked Docs : /onboarding/root_docs/linked-docs*/}
          <h2 className='mt-10 self-center text-xl md:text-2xl'>Linked Docs</h2>
          <div className='max-h-[80dvh] overflow-y-auto'>
            <DocAttachTable data={linkedDocs} setData={setLinkedDocs} />
          </div>

          {/* Free From attacher based on village/survey/plot input : /onboarding/root_docs/free-doc-search */}
          {/* 
          <input type='text' />
          <input type='text' /> */}
        </div>
      </div>
    </>
  );
}

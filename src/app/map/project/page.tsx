'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ProjectList, useProjectMapStore } from './useProjectMapStore';
import axiosClient from '@/utils/AxiosClient';
import ProjectListings from './ProjectListings';
import { useEffect } from 'react';
import { LuLoader } from 'react-icons/lu';

const MapInterface = dynamic(() => import('./MapInterface'), {
  ssr: false,
});

export default function Page() {
  const { currentBoundArea, setProjectList, projectList } =
    useProjectMapStore();
  const { data, isLoading } = useQuery({
    queryKey: [currentBoundArea],
    queryFn: async () => {
      try {
        const res = await axiosClient.post<{ data: ProjectList[] }>(
          '/map/projects',
          currentBoundArea
        );
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
  });

  useEffect(() => {
    if (data) {
      setProjectList(data);
    }
  }, [data]);

  return (
    <div className='mt-5 flex'>
      <div className='flex-1'>
        {isLoading ? (
          <div className='flex h-[50dvh] items-center justify-center'>
            <LuLoader size={40} className='animate-spin' />
          </div>
        ) : (
          <ProjectListings projectData={projectList} />
        )}
      </div>
      <div className='flex-1'>
        <MapInterface />
      </div>
    </div>
  );
}

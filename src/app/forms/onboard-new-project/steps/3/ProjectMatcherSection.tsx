import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';

export default function ProjectMatcherSection() {
  const { onboardingData, updateOnboardingData } = useOnboardingDataStore();
  const { data: localitiesOptions, isLoading: loadingLocalities } = useQuery({
    queryKey: ['localitiesOptions'],
    queryFn: async () => {
      const response = await axiosClient.get<{
        data: string[];
      }>('/forms/localities');
      const localities = response.data.data;
      const localitiesOptions: {
        label: string;
        value: string;
      }[] = [];
      localities.map((item) => {
        if (item.length > 2) {
          localitiesOptions.push({
            label: item,
            value: item,
          });
        }
      });
      return localitiesOptions;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Matcher Data</h3>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Localities:</span>
        <Select
          className='w-full flex-[5]'
          options={localitiesOptions || []}
          isLoading={loadingLocalities}
          onChange={(e: { label: string; value: string }) => {
            if (e) {
              updateOnboardingData({
                houseMasterLocalities: [
                  ...onboardingData.houseMasterLocalities,
                  e.value,
                ],
              });
            }
          }}
        />
      </div>
      <div className='flex flex-wrap gap-2'>
        Selected Localities:{' '}
        {onboardingData.houseMasterLocalities.map((item) => {
          return (
            <span
              className='btn btn-neutral btn-sm max-w-fit self-center text-white hover:bg-red-200 hover:text-black'
              key={item}
              onClick={() => {
                updateOnboardingData({
                  houseMasterLocalities:
                    onboardingData.houseMasterLocalities.filter(
                      (ele) => ele !== item
                    ),
                });
              }}
            >
              {item}
            </span>
          );
        })}
      </div>
      <div>
        Core Door Number String:{' '}
        <input type='text' className='input input-bordered' />
      </div>
    </>
  );
}

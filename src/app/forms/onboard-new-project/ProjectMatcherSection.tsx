import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from 'react-multi-select-component';

export default function ProjectMatcherSection() {
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
        <MultiSelect
          className='w-full flex-[5]'
          options={localitiesOptions || []}
          isLoading={loadingLocalities}
          value={[]}
          // onChange={(
          //   e: {
          //     label: string;
          //     value: string;
          //   }[]
          // ) => {

          // }}
          labelledBy={'amenitiesTags'}
          isCreatable={false}
          hasSelectAll={false}
        />
      </div>
      <div>
        Core Door Number String:{' '}
        <input type='text' className='input input-bordered' />
      </div>
    </>
  );
}

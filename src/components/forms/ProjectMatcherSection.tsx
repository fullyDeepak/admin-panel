import { FormProjectDataType } from '@/types/types';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from 'react-multi-select-component';

type ProjectMatcherProps = {
  formData: FormProjectDataType;
  updateFormData: (newDetails: Partial<FormProjectDataType>) => void;
};

export default function ProjectMatcherSection({
  formData,
  updateFormData,
}: ProjectMatcherProps) {
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
      <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Localities:</span>
        <MultiSelect
          className='w-full flex-[5]'
          options={localitiesOptions || []}
          isLoading={loadingLocalities}
          value={formData.localities}
          onChange={(
            e: {
              label: string;
              value: string;
            }[]
          ) => {
            updateFormData({
              localities: e,
            });
          }}
          labelledBy={'amenitiesTags'}
          isCreatable={false}
          hasSelectAll={false}
        />
      </div>
    </>
  );
}

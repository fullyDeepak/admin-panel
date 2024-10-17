import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import ChipInput from '@/components/ui/Chip';
import _ from 'lodash';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import useETLDataStore from '../../useETLDataStore';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import { inputBoxClass } from '@/app/constants/tw-class';

export default function ProjectMatcherSection() {
  const { projectFormETLTagData: formProjectETLTagData } = useETLDataStore();
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
      {formProjectETLTagData[0].suggestedDoorNumberStartsWith.length > 0 && (
        <div className='flex flex-col gap-5'>
          <span className='flex flex-[2] items-center'>
            <span>Recommended Municipal Door Numbers:</span>
          </span>
          <table>
            <thead>
              <tr>
                <th className='border border-solid border-slate-400'>
                  Door No.
                </th>
                <th className='border border-solid border-slate-400'>
                  Unit Numbers
                </th>
                <th className='border border-solid border-slate-400'>
                  Occurrence
                </th>
              </tr>
            </thead>
            <tbody>
              {formProjectETLTagData[0]?.suggestedDoorNumberStartsWith
                .sort(
                  (a, b) =>
                    -(parseInt(a.split(':')[2]) - parseInt(b.split(':')[2]))
                )
                .map((item, index) => (
                  <tr className='border-collapse hover:bg-slate-50' key={index}>
                    <td className='border border-solid border-slate-400'>
                      {item.split(':')[0]}
                    </td>
                    <td className='border border-solid border-slate-400'>
                      {item.split(':')[1]}
                    </td>
                    <td className='border border-solid border-slate-400'>
                      {item.split(':')[2]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Core Door Number String:{' '}
        </span>
        <input
          type='text'
          className={inputBoxClass}
          value={onboardingData.coreDoorNumberString}
          onChange={(e) =>
            updateOnboardingData({ coreDoorNumberString: e.target.value })
          }
        />
      </div>
    </>
  );
}

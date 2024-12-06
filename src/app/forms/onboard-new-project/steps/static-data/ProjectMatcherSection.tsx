import ChipInput from '@/components/ui/Chip';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import useETLDataStore from '../../useETLDataStore';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';

export default function ProjectMatcherSection() {
  const {
    projectFormETLTagData: formProjectETLTagData,
    updateProjectETLTagData,
  } = useETLDataStore();
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
  const { data: localitiesHouseNumbersData } = useQuery({
    queryKey: ['localitiesHouseNumbers', onboardingData.selectedTempProject],
    queryFn: async () => {
      if (!onboardingData.selectedTempProject?.value) return [];
      const res = await axiosClient.get<{
        data: {
          locality: string;
          house_nos: string[];
          count: number;
        }[];
      }>('/onboarding/suggested-locality-door-number', {
        params: {
          temp_project_id: onboardingData.selectedTempProject.value,
        },
      });
      return res.data.data;
    },
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
                houseMasterLocalities: _.uniq([
                  ...onboardingData.houseMasterLocalities,
                  e.value,
                ]),
              });
            }
          }}
          value={null}
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
      <div className='flex items-center justify-between gap-5'>
        <span className='flex-[2] text-wrap break-words md:text-xl'>
          Core Door Number String:{' '}
        </span>
        <ChipInput
          chips={onboardingData.coreDoorNumberStrings}
          updateFormData={(id, key, val) => {
            updateOnboardingData({
              coreDoorNumberStrings: val,
            });
            console.log(id, key, val);
            updateProjectETLTagData(id, key, val);
          }}
          updateId={1}
          updateKey='doorNoStartWith'
        />
      </div>
      <div className='flex select-none flex-col gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Recommended Localities And Door Numbers:</span>
        </span>

        <div className='max-h-[500px] overflow-y-scroll'>
          <table className='relative w-full border-collapse bg-white text-gray-700'>
            <thead className='sticky top-0 text-nowrap bg-gray-50 ring-1 ring-slate-200'>
              <tr>
                <th className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Door No.
                </th>
                <th className='select-text text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Unit Numbers
                </th>
                <th className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Occurrence
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
              {localitiesHouseNumbersData?.map((item, index) => (
                <tr
                  className='border-collapse cursor-pointer hover:bg-slate-50'
                  key={index}
                >
                  <td className='border border-solid border-slate-400 px-6 py-4'>
                    {item.locality}
                  </td>
                  <td className='select-text border border-solid border-slate-400 px-6 py-4'>
                    {_.truncate(item.house_nos.join(', '), {
                      length: 80,
                    })}
                  </td>
                  <td className='border border-solid border-slate-400 px-6 py-4'>
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex select-none flex-col gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Recommended Municipal Door Numbers:</span>
        </span>

        <div className='max-h-[500px] overflow-y-auto'>
          <table className='relative w-full border-collapse bg-white text-gray-700'>
            <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50 ring-1 ring-slate-200'>
              <tr>
                <th className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Door No.
                </th>
                <th className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Unit Numbers
                </th>
                <th className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'>
                  Occurrence
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
              {formProjectETLTagData
                .reduce((acc: string[], cur) => {
                  return [...acc, ...cur.suggestedDoorNumberStartsWith];
                }, [])
                ?.sort(
                  (a, b) =>
                    -(parseInt(a.split(':')[2]) - parseInt(b.split(':')[2]))
                )
                .map((item, index) => (
                  <tr
                    className='border-collapse cursor-pointer hover:bg-slate-50'
                    key={index}
                    onClick={() => {
                      updateOnboardingData({
                        coreDoorNumberStrings: _.uniq([
                          ...onboardingData.coreDoorNumberStrings,
                          item.split(':')[0],
                        ]),
                      });
                      updateProjectETLTagData(
                        1,
                        'doorNoStartWith',
                        _.uniq([
                          ...onboardingData.coreDoorNumberStrings,
                          item.split(':')[0],
                        ])
                      );
                    }}
                  >
                    <td className='border border-solid border-slate-400 px-6 py-4'>
                      {item.split(':')[0]}
                    </td>
                    <td className='border border-solid border-slate-400 px-6 py-4'>
                      {item.split(':')[1]}
                    </td>
                    <td className='border border-solid border-slate-400 px-6 py-4'>
                      {item.split(':')[2]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

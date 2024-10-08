import Select from 'react-select';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { startCase } from 'lodash';
import EditableList from './EditableList';
import { useOnboardingDataStore } from './useOnboardingDataStore';

export default function Keywords() {
  // const { updateProjectFormDataRera, projectFormDataRera } =
  // useProjectStoreRera();
  const { updateOnboardingData, onboardingData } = useOnboardingDataStore();
  const { data: keywordList, isLoading: loadingKeywords } = useQuery({
    queryKey: [
      'keywords',
      onboardingData.keywordType,
      onboardingData.selectedTempProject,
    ],
    queryFn: async () => {
      if (!onboardingData.keywordType || onboardingData.selectedTempProject) {
        return undefined;
      }
      const data = {
        project_ids: JSON.stringify(onboardingData.selectedTempProject),
        type: onboardingData.keywordType.value,
      };

      const response = await axiosClient.get<{
        data: { project_id: string; keyword_list: string[] }[];
      }>('/forms/rera/getReraKeywords', {
        params: data,
      });

      return {
        rera: response.data.data,
        transaction: undefined,
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const [selectedKeyword, setSelectedKeyword] = useState<string[]>([]);
  return (
    <>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[3] text-xl'>Keyword Type:</span>
        <Select
          className='w-full flex-[5]'
          key={'district'}
          isClearable
          options={[
            { label: 'Landlord', value: 'landlord' },
            { label: 'Developer', value: 'developer' },
          ]}
          value={onboardingData.keywordType}
          onChange={(e) => updateOnboardingData({ keywordType: e })}
        />
      </label>
      {loadingKeywords && (
        <div className='flex items-center justify-center'>
          <LoadingCircle circleColor='violet' size='large' />
        </div>
      )}
      {onboardingData.keywordType?.value && keywordList && (
        <div className='flex w-full'>
          <ul className='mr-5 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-1 rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              RERA {startCase(onboardingData.keywordType.value)}
            </li>
            <button
              className='btn btn-warning btn-sm max-w-fit self-center'
              type='button'
              onClick={() => {
                let names: string[] = [];
                keywordList.rera.map((projectKeywords) => {
                  names = names.concat(projectKeywords.keyword_list);
                });
                if (onboardingData.keywordType?.value === 'landlord') {
                  updateOnboardingData({
                    landlordKeywords: [
                      ...onboardingData.landlordKeywords,
                      ...names,
                    ],
                  });
                } else if (onboardingData.keywordType?.value === 'developer') {
                  updateOnboardingData({
                    developerKeywords: [
                      ...onboardingData.developerKeywords,
                      ...names,
                    ],
                  });
                }
              }}
            >
              Select All
            </button>
            <div className='flex flex-col gap-y-1 overflow-y-auto'>
              {keywordList?.rera?.map((projectKeywords) =>
                projectKeywords.keyword_list.map((keyword, index) => (
                  <label key={index} className='ml-3 flex flex-col'>
                    <input
                      type='checkbox'
                      className='peer'
                      hidden
                      name='rera-keyword-list'
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedKeyword((prev) => [keyword, ...prev]);
                        }
                      }}
                    />
                    <span className='btn btn-ghost btn-sm !block h-full max-w-[90%] flex-row justify-normal gap-0 self-start whitespace-break-spaces py-2 text-left font-normal leading-5 peer-checked:bg-green-500'>
                      {keyword}
                    </span>
                  </label>
                ))
              )}
            </div>
          </ul>
          <ul className='menu mr-2 max-h-[90vh] w-full max-w-[300px] flex-nowrap overflow-y-auto rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              Transaction {startCase(onboardingData.keywordType.value)}
            </li>
          </ul>
          <div className='flex flex-col items-center justify-center gap-5'>
            <button
              className='btn btn-outline btn-xs'
              type='button'
              onClick={() => {
                const checkBoxes = document.getElementsByName(
                  'rera-keyword-list'
                ) as unknown as HTMLInputElement[];
                checkBoxes.forEach((item) => {
                  item.checked = false;
                });
                const editor = document.getElementById(
                  'keyword-editor'
                ) as HTMLInputElement;
                editor.focus();
                if (onboardingData.keywordType?.value === 'developer') {
                  updateOnboardingData({
                    developerKeywords: [
                      ...selectedKeyword,
                      ...onboardingData.developerKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                } else if (onboardingData.keywordType?.value === 'landlord') {
                  updateOnboardingData({
                    landlordKeywords: [
                      ...selectedKeyword,
                      ...onboardingData.landlordKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                }
              }}
            >
              <FiChevronRight size={26} />
            </button>
          </div>
          <ul className='ml-2 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-4 rounded-box bg-green-100 py-4'>
            <li className='menu-title text-center text-xl text-green-600'>
              Tagged Keywords: {startCase(onboardingData.keywordType.value)}
            </li>
            {onboardingData.keywordType?.value === 'developer' && (
              <EditableList keywordType='developerKeywords' />
            )}
            {onboardingData.keywordType?.value === 'landlord' && (
              <EditableList keywordType='landlordKeywords' />
            )}
          </ul>
        </div>
      )}
    </>
  );
}

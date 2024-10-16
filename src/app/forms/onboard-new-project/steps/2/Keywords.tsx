import Select, { SingleValue } from 'react-select';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { startCase } from 'lodash';
import EditableList from '../../EditableList';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';

export default function Keywords() {
  // const { updateProjectFormDataRera, projectFormDataRera } =
  // useProjectStoreRera();
  const [keywordType, setKeywordType] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >({ label: 'Select Keyword Type', value: '' });
  const { updateOnboardingData, onboardingData, tempProjectSourceData } =
    useOnboardingDataStore();
  const { data: reraKeyWordList, isLoading: loadingReraKeywords } = useQuery({
    queryKey: ['keywords', keywordType, onboardingData.selectedReraProjects],
    queryFn: async () => {
      if (!keywordType || onboardingData.selectedTempProject) {
        return undefined;
      }
      const data = {
        project_ids: JSON.stringify(
          onboardingData.selectedReraProjects.map((item) => item.value)
        ),
        type: keywordType.value,
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
          value={keywordType}
          onChange={(e) => setKeywordType(e)}
        />
      </label>
      {loadingReraKeywords && (
        <div className='flex items-center justify-center'>
          <LoadingCircle circleColor='violet' size='large' />
        </div>
      )}
      {keywordType?.value && reraKeyWordList && (
        <div className='flex w-full'>
          <ul className='mr-5 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-1 rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              RERA {startCase(keywordType.value)}
            </li>
            <button
              className='btn btn-warning btn-sm max-w-fit self-center'
              type='button'
              onClick={() => {
                let names: string[] = [];
                reraKeyWordList.rera.map((projectKeywords) => {
                  names = names.concat(projectKeywords.keyword_list);
                });
                if (keywordType?.value === 'landlord') {
                  updateOnboardingData({
                    landlordKeywords: [
                      ...onboardingData.landlordKeywords,
                      ...names,
                    ],
                  });
                } else if (keywordType?.value === 'developer') {
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
              {reraKeyWordList?.rera?.map((projectKeywords) =>
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
              Transaction {startCase(keywordType.value)}
            </li>
            {Object.entries(tempProjectSourceData)
              .map(([_projectId, data]) => {
                return data.party_keywords?.filter(
                  (ele) =>
                    ele.keyword_type ===
                    (keywordType && keywordType.value === 'landlord'
                      ? 'LANDLORD'
                      : 'DEVELOPER')
                );
              })
              .map((ele) => ele?.map((ele) => ele.keywords))
              .filter((ele) => !!ele)
              .reduce((acc, val) => acc.concat(val), [])
              .reduce((acc, val) => acc.concat(val), [])
              .map((keyword, index) => (
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
              ))}
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
                if (keywordType?.value === 'developer') {
                  updateOnboardingData({
                    developerKeywords: [
                      ...selectedKeyword,
                      ...onboardingData.developerKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                } else if (keywordType?.value === 'landlord') {
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
              Tagged Keywords: {startCase(keywordType.value)}
            </li>
            {keywordType?.value === 'developer' && (
              <EditableList keywordType='developerKeywords' />
            )}
            {keywordType?.value === 'landlord' && (
              <EditableList keywordType='landlordKeywords' />
            )}
          </ul>
        </div>
      )}
    </>
  );
}

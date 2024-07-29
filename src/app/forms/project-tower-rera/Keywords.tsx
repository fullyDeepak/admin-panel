import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import Select from 'react-select';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { RiCloseLine } from 'react-icons/ri';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { startCase } from 'lodash';

export default function Keywords() {
  const { updateProjectFormDataRera, projectFormDataRera } =
    useProjectStoreRera();
  const { data: keywordList, isLoading: loadingKeywords } = useQuery({
    queryKey: [
      'keywords',
      projectFormDataRera.keywordType,
      projectFormDataRera.projects,
    ],
    queryFn: async () => {
      if (
        !projectFormDataRera.keywordType ||
        projectFormDataRera.projects.length === 0
      ) {
        return undefined;
      }
      const data = {
        project_ids: JSON.stringify(
          projectFormDataRera.projects.map((item) => +item.value)
        ),
        type: projectFormDataRera.keywordType?.value,
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
  const [inputValue, setInputValue] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');
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
          value={projectFormDataRera.keywordType}
          onChange={(e) => updateProjectFormDataRera({ keywordType: e })}
        />
      </label>
      {loadingKeywords && (
        <div className='flex items-center justify-center'>
          <LoadingCircle circleColor='violet' size='large' />
        </div>
      )}
      {projectFormDataRera.keywordType?.value && (
        <div className='flex w-full'>
          <ul className='menu mr-5 max-h-[90vh] w-full max-w-[400px] flex-nowrap rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              RERA {startCase(projectFormDataRera.keywordType.value)}
            </li>
            <div className='overflow-y-auto'>
              {keywordList?.rera?.map((projectKeywords) =>
                projectKeywords.keyword_list.map((keyword, index) => (
                  <label key={index} className='ml-3 flex flex-col'>
                    <input
                      type='radio'
                      className='peer'
                      hidden
                      name='rera-keyword-list'
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedKeyword(keyword);
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
              Transaction {startCase(projectFormDataRera.keywordType.value)}
            </li>
          </ul>
          <div className='flex flex-col items-center justify-center gap-5'>
            <button
              className='btn btn-xs'
              type='button'
              onClick={() => {
                setInputValue(selectedKeyword);
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
              }}
            >
              <FiChevronRight size={26} />
            </button>
          </div>
          <ul className='ml-2 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-4 rounded-box bg-green-100 py-4'>
            <li className='menu-title text-center text-xl text-green-600'>
              Tagged Keywords:{' '}
              {startCase(projectFormDataRera.keywordType.value)}
            </li>
            <input
              type='text'
              className='mx-auto w-full max-w-[80%] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
              value={inputValue}
              id='keyword-editor'
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.length > 0) {
                  if (projectFormDataRera.keywordType?.value === 'developer') {
                    updateProjectFormDataRera({
                      developerKeywords: [
                        inputValue,
                        ...projectFormDataRera.developerKeywords,
                      ],
                    });
                    setInputValue('');
                  } else if (
                    projectFormDataRera.keywordType?.value === 'landlord'
                  ) {
                    updateProjectFormDataRera({
                      landlordKeywords: [
                        inputValue,
                        ...projectFormDataRera.landlordKeywords,
                      ],
                    });
                    setInputValue('');
                  }
                }
              }}
            />
            {projectFormDataRera.keywordType?.value === 'developer' &&
              projectFormDataRera?.developerKeywords.map((item, index) => (
                <li
                  className='mx-5 flex items-center justify-between border-b pb-2 text-sm'
                  key={index}
                >
                  <a>{item}</a>
                  <button
                    className='aspect-square rounded-full bg-red-200 p-[1px]'
                    type='button'
                    onClick={() => {
                      const filteredDeveloperKeywords =
                        projectFormDataRera.developerKeywords.filter(
                          (keyword) => keyword !== item
                        );
                      updateProjectFormDataRera({
                        developerKeywords: filteredDeveloperKeywords,
                      });
                    }}
                  >
                    <RiCloseLine className='text-red-500' size={20} />
                  </button>
                </li>
              ))}
            <ul className='flex w-full flex-col gap-4 overflow-y-auto rounded-box bg-green-100 py-4'>
              {projectFormDataRera.keywordType?.value === 'landlord' &&
                projectFormDataRera?.landlordKeywords.map((item, index) => (
                  <li
                    className='mx-5 flex items-center justify-between border-b pb-2 text-sm'
                    key={index}
                  >
                    <a>{item}</a>
                    <button
                      className='aspect-square rounded-full bg-red-200 p-[1px]'
                      type='button'
                      onClick={() => {
                        const filteredLandlordKeywords =
                          projectFormDataRera.landlordKeywords.filter(
                            (keyword) => keyword !== item
                          );
                        updateProjectFormDataRera({
                          landlordKeywords: filteredLandlordKeywords,
                        });
                      }}
                    >
                      <RiCloseLine className='text-red-500' size={20} />
                    </button>
                  </li>
                ))}
            </ul>
          </ul>
        </div>
      )}
    </>
  );
}

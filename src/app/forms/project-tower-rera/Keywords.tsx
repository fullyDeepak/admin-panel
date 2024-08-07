import { useProjectStoreRera } from './useProjectStoreRera';
import Select from 'react-select';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { startCase } from 'lodash';
import EditableList from './EditableList';

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
          value={projectFormDataRera.keywordType}
          onChange={(e) => updateProjectFormDataRera({ keywordType: e })}
        />
      </label>
      {loadingKeywords && (
        <div className='flex items-center justify-center'>
          <LoadingCircle circleColor='violet' size='large' />
        </div>
      )}
      {projectFormDataRera.keywordType?.value && keywordList && (
        <div className='flex w-full'>
          <ul className='mr-5 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-1 rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              RERA {startCase(projectFormDataRera.keywordType.value)}
            </li>
            <button
              className='btn btn-warning btn-sm max-w-fit self-center'
              type='button'
              onClick={() => {
                let names: string[] = [];
                keywordList.rera.map((projectKeywords) => {
                  names = names.concat(projectKeywords.keyword_list);
                });
                if (projectFormDataRera.keywordType?.value === 'landlord') {
                  updateProjectFormDataRera({
                    landlordKeywords: [
                      ...projectFormDataRera.landlordKeywords,
                      ...names,
                    ],
                  });
                } else if (
                  projectFormDataRera.keywordType?.value === 'developer'
                ) {
                  updateProjectFormDataRera({
                    developerKeywords: [
                      ...projectFormDataRera.developerKeywords,
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
              Transaction {startCase(projectFormDataRera.keywordType.value)}
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
                if (projectFormDataRera.keywordType?.value === 'developer') {
                  updateProjectFormDataRera({
                    developerKeywords: [
                      ...selectedKeyword,
                      ...projectFormDataRera.developerKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                } else if (
                  projectFormDataRera.keywordType?.value === 'landlord'
                ) {
                  updateProjectFormDataRera({
                    landlordKeywords: [
                      ...selectedKeyword,
                      ...projectFormDataRera.landlordKeywords,
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
              Tagged Keywords:{' '}
              {startCase(projectFormDataRera.keywordType.value)}
            </li>
            {projectFormDataRera.keywordType?.value === 'developer' && (
              <EditableList keywordType='developerKeywords' />
            )}
            {projectFormDataRera.keywordType?.value === 'landlord' && (
              <EditableList keywordType='landlordKeywords' />
            )}
          </ul>
        </div>
      )}
    </>
  );
}

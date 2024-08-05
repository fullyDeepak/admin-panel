import Select from 'react-select';
import { FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import { useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import { useEditProjectStore } from '@/store/useEditProjectStore';
import { startCase } from 'lodash';
import EditableList from './EditableList';

export default function Keywords() {
  const { updateEditProjectFormData, editProjectFormData } =
    useEditProjectStore();
  const { data: keywordList, isLoading: loadingKeywords } = useQuery({
    queryKey: [
      'keywords',
      editProjectFormData.keywordType,
      editProjectFormData.selectedProject,
    ],
    queryFn: async () => {
      if (
        !editProjectFormData.keywordType ||
        !editProjectFormData.selectedProject
      ) {
        return undefined;
      }
      const data = {
        project_ids: JSON.stringify([editProjectFormData.reraId]),
        type: editProjectFormData.keywordType?.value,
      };

      const response = await axiosClient.get<{
        data: { project_id: string; keyword_list: string[] }[];
      }>('/forms/rera/getReraKeywords', {
        params: data,
      });

      const transactionRes = await axiosClient.get<{
        data: {
          simple_transaction_type: string;
          count_names: {
            count: number;
            names: string[];
          }[];
        }[];
      }>('/forms/getProjectCounterParty', {
        params: { project_id: editProjectFormData.selectedProject },
      });
      return {
        rera: response.data.data,
        transaction: transactionRes.data.data,
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
          value={editProjectFormData.keywordType}
          onChange={(e) => updateEditProjectFormData({ keywordType: e })}
        />
      </label>
      {loadingKeywords && (
        <div className='flex items-center justify-center'>
          <LoadingCircle circleColor='violet' size='large' />
        </div>
      )}
      {editProjectFormData.keywordType?.value && keywordList && (
        <div className='flex w-full'>
          <ul className='mr-5 flex max-h-[90vh] w-full max-w-[400px] flex-col gap-1 rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              RERA Landlord Land Owner
            </li>
            <button
              className='btn btn-warning btn-sm max-w-fit self-center'
              type='button'
              onClick={() => {
                let names: string[] = [];
                keywordList.rera.map((projectKeywords) => {
                  names = names.concat(projectKeywords.keyword_list);
                });
                if (editProjectFormData.keywordType?.value === 'landlord') {
                  updateEditProjectFormData({
                    landlordKeywords: [
                      ...editProjectFormData.landlordKeywords,
                      ...names,
                    ],
                  });
                } else if (
                  editProjectFormData.keywordType?.value === 'developer'
                ) {
                  updateEditProjectFormData({
                    developerKeywords: [
                      ...editProjectFormData.developerKeywords,
                      ...names,
                    ],
                  });
                }
              }}
            >
              Select All
            </button>
            <div className='overflow-y-auto'>
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
                          setSelectedKeyword((prev) => [...prev]);
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
          <ul className='menu mr-2 max-h-[90vh] w-full max-w-[400px] flex-nowrap overflow-y-auto rounded-box bg-violet-100 py-4'>
            <li className='menu-title text-center text-xl text-violet-600'>
              Transaction Land Owner
            </li>
            <button
              className='btn btn-warning btn-sm max-w-fit self-center'
              type='button'
              onClick={() => {
                let names: string[] = [];
                keywordList.transaction.map((transData) =>
                  transData.count_names.map((partyName) => {
                    names = names.concat(partyName.names);
                  })
                );
                if (editProjectFormData.keywordType?.value === 'landlord') {
                  updateEditProjectFormData({
                    landlordKeywords: [
                      ...editProjectFormData.landlordKeywords,
                      ...names,
                    ],
                  });
                } else if (
                  editProjectFormData.keywordType?.value === 'developer'
                ) {
                  updateEditProjectFormData({
                    developerKeywords: [
                      ...editProjectFormData.developerKeywords,
                      ...names,
                    ],
                  });
                }
              }}
            >
              Select All
            </button>
            {keywordList?.transaction.map((transData, index) => (
              <li key={index}>
                <details open={index === 0 ? true : false}>
                  <summary className=''>
                    {transData.simple_transaction_type}
                  </summary>

                  <ul className='flex flex-col gap-y-1'>
                    {transData.count_names.map((countNamesItem) =>
                      countNamesItem.names.map((partyName) => (
                        <label key={partyName} className='ml-3 flex flex-col'>
                          <input
                            type='checkbox'
                            className='group peer'
                            hidden
                            name='transaction-keyword-list'
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedKeyword((prev) => [
                                  partyName,
                                  ...prev,
                                ]);
                              }
                            }}
                          />
                          <span className='btn btn-ghost btn-sm !block h-full max-w-[200px] flex-row justify-normal gap-0 self-start whitespace-break-spaces py-2 text-left font-normal leading-5 peer-checked:bg-green-500'>
                            {partyName}{' '}
                            <span className='font-medium'>
                              ({countNamesItem.count})
                            </span>
                          </span>
                        </label>
                      ))
                    )}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
          <div className='flex flex-col items-center justify-center gap-5'>
            <button
              className='btn btn-outline btn-sm'
              type='button'
              onClick={() => {
                const transCheckBoxes = document.getElementsByName(
                  'transaction-keyword-list'
                ) as unknown as HTMLInputElement[];
                transCheckBoxes.forEach((item) => {
                  item.checked = false;
                });
                const reraCheckBoxes = document.getElementsByName(
                  'rera-keyword-list'
                ) as unknown as HTMLInputElement[];
                reraCheckBoxes.forEach((item) => {
                  item.checked = false;
                });
                if (editProjectFormData.keywordType?.value === 'developer') {
                  updateEditProjectFormData({
                    developerKeywords: [
                      ...selectedKeyword,
                      ...editProjectFormData.developerKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                } else if (
                  editProjectFormData.keywordType?.value === 'landlord'
                ) {
                  updateEditProjectFormData({
                    landlordKeywords: [
                      ...selectedKeyword,
                      ...editProjectFormData.landlordKeywords,
                    ],
                  });
                  setSelectedKeyword([]);
                }
              }}
            >
              <FiChevronRight size={26} />
            </button>
          </div>
          <ul className='ml-2 flex max-h-[90vh] w-full flex-col gap-4 rounded-box bg-green-100 py-4'>
            <li className='menu-title text-center text-xl text-green-600'>
              Tagged Keywords:{' '}
              {startCase(editProjectFormData.keywordType.value)}
            </li>
            {editProjectFormData.keywordType?.value === 'developer' && (
              <EditableList keywordType='developerKeywords' />
            )}
            {editProjectFormData.keywordType?.value === 'landlord' && (
              <EditableList keywordType='landlordKeywords' />
            )}
          </ul>
        </div>
      )}
    </>
  );
}

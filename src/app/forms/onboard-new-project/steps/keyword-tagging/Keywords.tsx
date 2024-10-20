import LoadingCircle from '@/components/ui/LoadingCircle';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { uniqWith } from 'lodash';
import { KeyboardEvent, useState } from 'react';
import { LuMoveRight } from 'react-icons/lu';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';

export default function Keywords() {
  // const { updateProjectFormDataRera, projectFormDataRera } =
  // useProjectStoreRera();
  const { setTaggedKeywords, onboardingData } = useOnboardingDataStore();
  const [checkedKeywords, setCheckedKeywords] = useState<
    {
      party: string;
      count: number;
    }[]
  >([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const handleDoubleClickToEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setInputValue(value);
    const inp = document.getElementById('keywords-edit-input') as
      | HTMLInputElement
      | undefined;
    if (inp) {
      inp?.focus();
      const end = inp?.value.length;
      inp.setSelectionRange(end, end);
    }
  };

  const handleOnClickToToggle = (
    index: number,
    value: string,
    keyword_type: 'developer' | 'landlord'
  ) => {
    console.log('toggle', index, value, keyword_type);
    //toggle keyword type
    if (editingIndex === index) return;
    setTaggedKeywords(
      onboardingData.taggedKeywords.map((ele, i) => {
        console.log(i, ele);
        if (i === index) {
          return {
            ...ele,
            keyword_type:
              keyword_type === 'developer'
                ? ('landlord' as const)
                : ('developer' as const),
          };
        }
        return ele;
      })
    );
    // if (keyword_type === 'developer') {
    //   toast.success('Toggled Keyword Type from Developer to Landlord.');
    // } else {
    //   toast.success('Toggled Keyword Type from Landlord to Developer.');
    // }
  };
  const handleOnClickToRemove = (
    index: number,
    value: string,
    keyword_type: 'developer' | 'landlord'
  ) => {
    //toggle keyword type
    console.log('remove', index, value, keyword_type);
    if (editingIndex === index) return;
    setTaggedKeywords(
      onboardingData.taggedKeywords.map((ele, i) => {
        if (i === index) {
          return {
            ...ele,
            removed: ele.removed ? !ele.removed : true,
          };
        }
        return ele;
      })
    );
  };
  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    console.log('handleOnKeyDown', editingIndex);
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleOnBlur();
    } else if (e.key === 'Tab' && editingIndex != null) {
      e.preventDefault();
      if (onboardingData.taggedKeywords.length === editingIndex + 1) {
        handleOnBlur();
      } else {
        handleOnBlur();
        setEditingIndex(editingIndex + 1);
        setInputValue(onboardingData.taggedKeywords[editingIndex + 1].party);
      }
    }
  }

  function handleOnBlur() {
    if (editingIndex != null) {
      setTaggedKeywords(
        onboardingData.taggedKeywords.map((ele, i) => {
          if (i === editingIndex) {
            return {
              ...ele,
              party: inputValue,
            };
          }
          return ele;
        })
      );
      setEditingIndex(null);
    }
  }

  const { data: reraKeyWordList, isLoading: loadingReraKeywords } = useQuery({
    queryKey: ['rera-keywords', onboardingData.selectedReraProjects],
    queryFn: async () => {
      if (!onboardingData.selectedReraProjects.length) {
        return [];
      }
      const data = {
        project_ids: JSON.stringify(
          onboardingData.selectedReraProjects.map((item) => item.value)
        ),
      };

      const response = await axiosClient.get<{
        data: {
          keyword_type: 'LANDLORD' | 'DEVELOPER';
          party_names: string[];
        }[];
      }>('/forms/rera/getReraCounterpartykeywords', {
        params: data,
      });

      return response.data.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const { data: transactionKeywords, isLoading: loadingTransactionKeywords } =
    useQuery({
      queryKey: ['transaction-keywords', onboardingData.selectedTempProject],
      queryFn: async () => {
        if (!onboardingData.selectedTempProject?.value) return null;
        const res = await axiosClient.get<{
          data: {
            deed_type: string;
            parties: {
              party: string;
              count: number;
            }[];
          }[];
        }>(
          '/temp-projects/developer-tagger/get-parties?temp_project_id=' +
            onboardingData.selectedTempProject?.value
        );
        const keywords = res.data.data;
        return keywords;
      },
    });
  return (
    <>
      {loadingReraKeywords ||
        (loadingTransactionKeywords && (
          <div className='flex items-center justify-center'>
            <LoadingCircle circleColor='violet' size='large' />
          </div>
        ))}
      {(transactionKeywords || reraKeyWordList) && (
        <div className='flex h-[90vh] w-full flex-row items-center justify-between gap-1 p-2 align-middle'>
          {/* keywords for project */}
          <div className='mx-2 h-full flex-[3] flex-nowrap overflow-y-auto border border-solid px-4'>
            <ul className='menu flex h-[100%] flex-col flex-nowrap gap-2 py-2'>
              <div className='flex flex-col gap-y-1 overflow-y-auto'>
                {reraKeyWordList?.map((projectKeywords, index) => (
                  <li key={index}>
                    <details open={index === 0 ? true : false}>
                      <summary className='bg-slate-200'>
                        {projectKeywords.keyword_type}
                      </summary>
                      <ul className='flex flex-col gap-y-1'>
                        {projectKeywords.party_names.map((keyword, index) => (
                          <label key={index} className='ml-3 flex flex-col'>
                            <input
                              type='checkbox'
                              className='peer'
                              hidden
                              name='rera-keyword-list'
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedKeywords((prev) => [
                                    { party: keyword, count: 0 },
                                    ...prev,
                                  ]);
                                }
                              }}
                            />
                            <span className='btn btn-ghost btn-sm !block h-full max-w-[90%] flex-row justify-normal gap-0 self-start whitespace-break-spaces py-2 text-left font-normal leading-5 peer-checked:bg-green-500'>
                              {keyword}
                            </span>
                          </label>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </div>
            </ul>
          </div>
          <div className='mx-2 h-full flex-[3] flex-nowrap overflow-y-auto border border-solid px-4'>
            <ul className='menu flex h-[100%] flex-col flex-nowrap gap-2 py-2'>
              {transactionKeywords?.map((keywordGroups, index) => (
                <li key={index}>
                  <details open={index === 0 ? true : false}>
                    <summary className='bg-slate-200'>
                      {keywordGroups.deed_type}
                    </summary>
                    <ul className='flex flex-col gap-y-1'>
                      {keywordGroups.parties
                        .sort((a, b) => {
                          return b.count - a.count;
                        })
                        .map((item) => (
                          <label
                            key={item.party}
                            className='flex w-fit flex-col text-wrap'
                          >
                            <input
                              className='peer'
                              type='checkbox'
                              hidden
                              name='keyword-checkbox'
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedKeywords((prev) => [...prev, item]);
                                } else {
                                  setCheckedKeywords((prev) =>
                                    prev.filter((ele) => ele !== item)
                                  );
                                }
                              }}
                            />
                            <span className='btn btn-ghost btn-sm !block h-full flex-row justify-normal self-start py-2 text-left font-normal leading-5 peer-checked:bg-green-500'>
                              <span>{item.party}</span>{' '}
                              <span>({item.count})</span>
                            </span>
                          </label>
                        ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </div>
          {/* button to shift from left to right */}
          <div className='flex flex-col gap-10'>
            <button
              className='btn btn-ghost bg-green-400'
              onClick={() => {
                const checkboxes = document.getElementsByName(
                  'keyword-checkbox'
                ) as unknown as HTMLInputElement[];
                checkboxes.forEach((item) => {
                  item.checked = false;
                });
                const res = [
                  ...onboardingData.taggedKeywords,
                  ...checkedKeywords.map((ele) => {
                    return {
                      ...ele,
                      keyword_type: 'developer' as const,
                      removed: false,
                    };
                  }),
                ];
                setTaggedKeywords(
                  uniqWith(res, (a, b) => {
                    return a.party == b.party;
                  })
                );
                setCheckedKeywords([]);
              }}
            >
              <LuMoveRight size={20} />
            </button>
            <button
              className='btn btn-ghost bg-red-400'
              onClick={() => {
                const checkboxes = document.getElementsByName(
                  'keyword-checkbox'
                ) as unknown as HTMLInputElement[];
                checkboxes.forEach((item) => {
                  item.checked = false;
                });
                const rera_keywords = document.getElementsByName(
                  'rera-keyword-list'
                ) as unknown as HTMLInputElement[];
                rera_keywords.forEach((item) => {
                  item.checked = false;
                });
                const res = [
                  ...onboardingData.taggedKeywords,
                  ...checkedKeywords.map((ele) => {
                    return {
                      ...ele,
                      keyword_type: 'landlord' as const,
                      removed: false,
                    };
                  }),
                ];
                setTaggedKeywords(
                  uniqWith(res, (a, b) => {
                    return a.party == b.party;
                  })
                );
                setCheckedKeywords([]);
              }}
            >
              <LuMoveRight size={20} />
            </button>
          </div>
          {/* list to show shifted records and double click to editable */}
          <div
            id='selected-keywords'
            className='h-full flex-[3] overflow-auto border border-solid px-4'
          >
            <ul className='flex flex-col gap-2 py-2'>
              {onboardingData.taggedKeywords.map((item, index) => (
                <li
                  className={`flex flex-row items-stretch justify-between gap-2 text-pretty ${item.removed ? 'hidden' : ''}`}
                  key={index}
                >
                  {editingIndex === index ? (
                    <input
                      id='keywords-edit-input'
                      className='input input-bordered w-full flex-[4]'
                      type='text'
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      value={inputValue}
                      onBlur={handleOnBlur}
                      onKeyDown={handleOnKeyDown}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`btn btn-sm h-fit max-w-[80%] flex-[4] self-start !whitespace-break-spaces !break-all py-2 text-left font-normal leading-5 hover:bg-slate-50 ${item.keyword_type === 'developer' ? 'bg-green-300' : 'bg-red-300'} `}
                      onDoubleClick={() => {
                        handleDoubleClickToEdit(index, item.party);
                      }}
                    >
                      {item.party}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      handleOnClickToToggle(
                        index,
                        item.party,
                        item.keyword_type
                      )
                    }
                    className='flex-1 rounded-lg bg-emerald-200 p-[1px] text-3xl'
                  >
                    {item.keyword_type === 'developer' ? '👷‍♂️' : '👨‍🦳'}
                  </button>
                  <button
                    onClick={() =>
                      handleOnClickToRemove(
                        index,
                        item.party,
                        item.keyword_type
                      )
                    }
                    className='flex-1 rounded-lg bg-emerald-200 p-[1px] text-3xl'
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

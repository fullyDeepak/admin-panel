'use client';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { uniqWith } from 'lodash';
import { KeyboardEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { LuLoader, LuMoveRight } from 'react-icons/lu';
import Select, { SingleValue } from 'react-select';
import { DeveloperGroupSelectionPanel } from './DeveloperGroupSelectionPanel';
import { DeveloperCleanAndTagPanel } from './DeveloperCleanAndTagPanel';

type Props =
  | {
      showOnlyDevTaggerWithoutJV?: boolean;
      showOnlyDevTaggerWithJV?: never;
      showDevGroupSelectionPanel?: never;
    }
  | {
      showOnlyDevTaggerWithoutJV?: never;
      showOnlyDevTaggerWithJV?: boolean;
      showDevGroupSelectionPanel?: never;
    }
  | {
      showOnlyDevTaggerWithoutJV?: never;
      showOnlyDevTaggerWithJV?: never;
      showDevGroupSelectionPanel?: boolean;
    };
export default function Page({
  showDevGroupSelectionPanel,
  showOnlyDevTaggerWithJV,
  showOnlyDevTaggerWithoutJV,
}: Props) {
  // states
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedMandal, setSelectedMandal] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: number;
  } | null>();
  const [districtOptions, setDistrictOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [mandalOptions, setMandalOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [villageOptions, setVillageOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [dmvData, setDmvData] = useState<
    | {
        district_id: number;
        district_name: string;
        mandals: {
          mandal_id: number;
          mandal_name: string;
          villages: { village_id: number; village_name: string }[];
        }[];
      }[]
    | null
  >(null);
  const [selectedTempProject, setSelectedTempProject] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >();
  const [tempProjectOptions, setTempProjectOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [keywordOptions, setKeywordOptions] = useState<
    {
      deed_type: string;
      parties: {
        party: string;
        count: number;
      }[];
    }[]
  >([]);

  const [checkedKeywords, setCheckedKeywords] = useState<
    {
      party: string;
      count: number;
    }[]
  >([]);

  const [taggedKeywords, setTaggedKeywords] = useState<
    {
      party: string;
      count: number;
      keyword_type: 'developer' | 'landlord';
      removed: boolean;
    }[]
  >([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [isMutation, setIsMutation] = useState<boolean>(true);
  useState<number>(-1);
  const [selectedDevelopers, setSelectedDevelopers] = useState<
    {
      label: string;
      value: string;
      gst_number?: string | null;
      organization_type?: string | null;
    }[]
  >([]);

  // queries
  const { isLoading } = useQuery({
    queryKey: ['village-project-cleaner-developer-tagger'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          state_name: string;
          state_id: number;
          districts: {
            district_id: number;
            district_name: string;
            mandals: {
              mandal_id: number;
              mandal_name: string;
              villages: { village_id: number; village_name: string }[];
            }[];
          }[];
        }[];
      }>('/forms/getOnboardedSDMV');
      console.log(res.data.data);
      const telanganaData = res.data.data.find(
        (item) => item.state_id === 36
      )?.districts;
      if (!telanganaData) return null;
      setDmvData(telanganaData);
      const districtOpts = telanganaData.map((item) => ({
        label: `${item.district_id}:${item.district_name}`,
        value: item.district_id,
      }));
      setDistrictOptions(districtOpts);
      return res.data.data;
    },
    staleTime: Infinity,
  });

  const {
    isLoading: loadingTempProjects,
    isError,
    error,
  } = useQuery({
    queryKey: ['temp-projects', selectedVillage],
    queryFn: async () => {
      if (!selectedVillage) return null;
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
          occurrence_count: number;
        }[];
      }>(
        '/temp-projects/developer-tagger/get-projects-to-tag-keywords?village_id=' +
          selectedVillage?.value
      );
      const tempProjects = res.data.data.map((item) => ({
        label: `${item.id}:${item.name} (${item.occurrence_count})`,
        value: item.id,
      }));
      setTempProjectOptions(tempProjects);
      setTaggedKeywords([]);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const { isLoading: loadingKeywords } = useQuery({
    queryKey: ['keywords', selectedTempProject],
    queryFn: async () => {
      if (!selectedTempProject?.value) return null;
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
          selectedTempProject?.value
      );
      const keywords = res.data.data;
      setKeywordOptions(keywords);
      return res.data.data;
    },
  });

  // handlers

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
    setTaggedKeywords((prev) => {
      return prev.map((ele, i) => {
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
      });
    });
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
    setTaggedKeywords((prev) => {
      return prev.map((ele, i) => {
        if (i === index) {
          return {
            ...ele,
            removed: ele.removed ? !ele.removed : true,
          };
        }
        return ele;
      });
    });
    // if (keyword_type === 'developer') {
    //   toast.success('Toggled Keyword Type from Developer to Landlord.');
    // } else {
    //   toast.success('Toggled Keyword Type from Landlord to Developer.');
    // }
  };

  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    console.log('handleOnKeyDown', editingIndex);
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleOnBlur();
    } else if (e.key === 'Tab' && editingIndex != null) {
      e.preventDefault();
      if (taggedKeywords.length === editingIndex + 1) {
        handleOnBlur();
      } else {
        handleOnBlur();
        setEditingIndex(editingIndex + 1);
        setInputValue(taggedKeywords[editingIndex + 1].party);
      }
    }
  }

  function handleOnBlur() {
    if (editingIndex != null) {
      setTaggedKeywords((prev) => {
        return prev.map((ele, i) => {
          if (i === editingIndex) {
            return {
              ...ele,
              party: inputValue,
            };
          }
          return ele;
        });
      });
      setEditingIndex(null);
    }
  }
  const {
    data: developersToGroup,
    isLoading: loadingDevelopersToGroup,
    refetch: refetchDevelopersToGroup,
  } = useQuery({
    queryKey: ['developer-to-group-options'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
        }[];
      }>('/developers/developers-to-group');
      console.log(res.data.data);
      const developersToGroup = res.data.data.map((item) => ({
        developerName: item.name,
        developerId: item.id,
      }));
      return developersToGroup;
    },
  });

  async function submitKeywords(data: {
    project_id?: string;
    keywords: typeof taggedKeywords;
  }) {
    await toast.promise(
      axiosClient.post('/temp-projects/developer-tagger/post-keywords', data),
      {
        loading: 'Submitting keywords...',
        success: () => {
          setTaggedKeywords([]);
          setSelectedTempProject(null);
          return 'Keyword Submitted';
        },
        error: 'Error',
      }
    );
  }

  if (showOnlyDevTaggerWithJV) {
    return (
      <DeveloperCleanAndTagPanel
        isMutation={false}
        setIsMutation={setIsMutation}
        selectedTempProject={selectedTempProject}
        selectedDevelopers={selectedDevelopers}
        setSelectedDevelopers={setSelectedDevelopers}
        refetchDevelopersToGroup={refetchDevelopersToGroup}
        hideMutationToggle={true}
        header='Select Developers to create a JV.'
      />
    );
  }

  if (showOnlyDevTaggerWithoutJV) {
    return (
      <DeveloperCleanAndTagPanel
        isMutation={true}
        setIsMutation={setIsMutation}
        selectedTempProject={selectedTempProject}
        selectedDevelopers={selectedDevelopers}
        setSelectedDevelopers={setSelectedDevelopers}
        refetchDevelopersToGroup={refetchDevelopersToGroup}
        hideMutationToggle={true}
        header='Select Developers to Create Mutations'
      />
    );
  }

  if (showDevGroupSelectionPanel) {
    return (
      <DeveloperGroupSelectionPanel
        isMutation={isMutation}
        selectedDevelopers={selectedDevelopers}
        loadingDevelopersToGroup={loadingDevelopersToGroup}
        developersToGroup={developersToGroup}
        refetchDevelopersToGroup={refetchDevelopersToGroup}
      />
    );
  }

  return isLoading ? (
    <div className='flex h-[50dvh] flex-col items-center justify-center'>
      <LuLoader size={40} className='animate-spin' />
      <div className='text-5xl font-bold'>Loading DMVs...</div>
    </div>
  ) : (
    <>
      <div className='mb-8 mt-10 flex flex-col justify-center'>
        <h1 className='mb-4 text-center text-3xl font-semibold underline'>
          Developer Tagger Cleaner
        </h1>
        <div className='z-10 mt-5 flex w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={districtOptions || []}
              value={selectedDistrict}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedDistrict(e);
                console.log('district changed', e);
                if (e) {
                  const mandalOpts = dmvData
                    ?.find((item) => item.district_id === e.value)
                    ?.mandals.map((item) => ({
                      label: `${item.mandal_id}:${item.mandal_name}`,
                      value: item.mandal_id,
                    }));
                  console.log('mandal options', mandalOpts);
                  setMandalOptions(mandalOpts || []);
                } else {
                  setMandalOptions([]);
                }
                setSelectedMandal(null);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={mandalOptions || []}
              value={selectedMandal}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedMandal(e);
                console.log('mandal changed', e);
                if (e) {
                  console.log(
                    dmvData
                      ?.find(
                        (item) => item.district_id === selectedDistrict?.value
                      )
                      ?.mandals.find((item) => item.mandal_id === e.value)
                  );
                  const villageOpts = dmvData
                    ?.find(
                      (item) => item.district_id === selectedDistrict?.value
                    )
                    ?.mandals.find((item) => item.mandal_id === e.value)
                    ?.villages.map((item) => ({
                      label: `${item.village_id}:${item.village_name}`,
                      value: item.village_id,
                    }));
                  console.log('village options', villageOpts);
                  setVillageOptions(villageOpts || []);
                } else {
                  setVillageOptions([]);
                }
              }}
              isDisabled={Boolean(!selectedDistrict)}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>Village:</span>
            <Select
              className='w-full flex-[5]'
              key={'village'}
              options={villageOptions || []}
              value={selectedMandal ? selectedVillage : null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => setSelectedVillage(e)}
              isDisabled={Boolean(!selectedMandal)}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>
              Select Clean Apartment Name:
            </span>
            <Select
              className='w-full flex-[5]'
              key={'tempProject'}
              options={tempProjectOptions || []}
              value={selectedTempProject || []}
              noOptionsMessage={(_i) => {
                return isError ? error.message : 'No Raw';
              }}
              isLoading={loadingTempProjects}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: string;
                }>
              ) => {
                setSelectedTempProject(e);
                document.getElementById('keywords-container')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              isDisabled={Boolean(!selectedVillage)}
            />
          </label>
        </div>
      </div>
      {loadingKeywords ? (
        <div className='flex h-[50dvh] flex-col items-center justify-center'>
          <LuLoader size={40} className='animate-spin' />
          <div className='text-5xl font-bold'>Loading Keywords...</div>
        </div>
      ) : keywordOptions.length > 0 ? (
        <div
          id='keywords-container'
          className='mx-2 flex flex-col items-center justify-between gap-4 px-2 py-4'
        >
          <h3 className='text-center text-2xl font-semibold'>
            Keywords for {selectedTempProject?.label}
          </h3>
          <div className='flex h-[60vh] w-full flex-row items-center justify-between gap-1 border align-middle'>
            {/* keywords for project */}
            <div className='h-full flex-[3] flex-nowrap overflow-y-auto border border-solid px-4'>
              <ul className='menu flex h-[100%] flex-col flex-nowrap gap-2 overflow-auto py-2'>
                {keywordOptions.map((keywordGroups, index) => (
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
                              className='flex w-fit flex-col'
                            >
                              <input
                                className='peer'
                                type='checkbox'
                                hidden
                                name='keyword-checkbox'
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCheckedKeywords((prev) => [
                                      ...prev,
                                      item,
                                    ]);
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
                    ...taggedKeywords,
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
                      return a.party == b.party && a.count == b.count;
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
                  const res = [
                    ...taggedKeywords,
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
                      return a.party == b.party && a.count == b.count;
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
                {taggedKeywords.map((item, index) => (
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
          <button
            className='btn-rezy'
            onClick={() =>
              submitKeywords({
                project_id: selectedTempProject?.value,
                keywords: taggedKeywords,
              })
            }
          >
            Submit
          </button>
        </div>
      ) : null}
      <div className='mx-10 flex flex-col gap-5'>
        {/* card to select exisitng developers and/or new ones */}
        {/* card to add jlv partners for the developer ^ */}
        <DeveloperCleanAndTagPanel
          isMutation={isMutation}
          setIsMutation={setIsMutation}
          selectedTempProject={selectedTempProject}
          selectedDevelopers={selectedDevelopers}
          setSelectedDevelopers={setSelectedDevelopers}
          refetchDevelopersToGroup={refetchDevelopersToGroup}
        />
        <DeveloperGroupSelectionPanel
          isMutation={isMutation}
          selectedDevelopers={selectedDevelopers}
          loadingDevelopersToGroup={loadingDevelopersToGroup}
          developersToGroup={developersToGroup}
          refetchDevelopersToGroup={refetchDevelopersToGroup}
        />
      </div>
    </>
  );
}

'use client';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { isEqual, uniq, uniqWith } from 'lodash';
import { KeyboardEvent, useState } from 'react';
import { LuLoader, LuMoveRight } from 'react-icons/lu';
import Select, { SingleValue } from 'react-select';
// @ts-expect-error  third party
import SelectVirtualized from 'react-select-virtualized';
export default function Page() {
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

  const [selectedDevelopers, setSelectedDevelopers] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedDeveloperGroup, setSelectedDeveloperGroup] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [developerEditingIndex, setDeveloperEditingIndex] =
    useState<number>(-1);
  const [developerInputValue, setDeveloperInputValue] = useState<string>('');
  // queries
  const { isLoading } = useQuery({
    queryKey: ['village-project-cleaner'],
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
        }[];
      }>('/temp-projects?village_id=' + selectedVillage?.value);
      const tempProjects = res.data.data.map((item) => ({
        label: `${item.id}:${item.name}`,
        value: item.id,
      }));
      setTempProjectOptions(tempProjects);
      return res.data.data;
    },
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

  const { data: developerOptions, isLoading: loadingDevelopers } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          developer_id: string;
          developer_name: string;
        }[];
      }>('/developers');
      const developers = res.data.data.map((item) => ({
        label: `${item.developer_id}:${item.developer_name}`,
        value: item.developer_id,
      }));
      return developers;
    },
    staleTime: Infinity,
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

  const handleDoubleClickToEditDeveloper = (index: number, value: string) => {
    console.log('double click Developer', index, value);
    setDeveloperEditingIndex(index);
    setDeveloperInputValue(value);
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

  function handleOnDeveloperKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    console.log('handleOnDeveloperKeyDown', developerEditingIndex, e);
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleOnDeveloperInputBlur();
    } else if (e.key === 'Tab' && developerEditingIndex != null) {
      e.preventDefault();
      if (selectedDevelopers.length === developerEditingIndex + 1) {
        handleOnDeveloperInputBlur();
      } else {
        handleOnDeveloperInputBlur();
        setDeveloperEditingIndex(developerEditingIndex + 1);
        setDeveloperInputValue(
          selectedDevelopers[developerEditingIndex + 1].label
        );
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

  function handleOnDeveloperInputBlur() {
    console.log('handleOnDeveloperInputBlur', developerEditingIndex);
    if (developerEditingIndex != null) {
      setSelectedDevelopers((prev) => {
        return prev.map((ele, i) => {
          if (i === developerEditingIndex) {
            return {
              ...ele,
              label: developerInputValue,
            };
          }
          return ele;
        });
      });
      setDeveloperEditingIndex(-1);
      setDeveloperInputValue('');
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-[50dvh] flex-col items-center justify-center'>
        <LuLoader size={40} className='animate-spin' />
        <div className='text-5xl font-bold'>Loading DMVs...</div>
      </div>
    );
  }
  return (
    <>
      <div className='mb-8 mt-10 flex flex-col justify-center'>
        <h1 className='mb-4 text-center text-3xl font-semibold underline'>
          Village Project Cleaner
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
                if (e) {
                  const mandalOpts = dmvData
                    ?.find((item) => item.district_id === e.value)
                    ?.mandals.map((item) => ({
                      label: `${item.mandal_id}:${item.mandal_name}`,
                      value: item.mandal_id,
                    }));
                  setMandalOptions(mandalOpts || []);
                } else {
                  setMandalOptions([]);
                }
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
                if (e) {
                  const villageOpts = dmvData
                    ?.find((item) => item.district_id === e.value)
                    ?.mandals.find((item) => item.mandal_id === e.value)
                    ?.villages.map((item) => ({
                      label: `${item.village_id}:${item.village_name}`,
                      value: item.village_id,
                    }));
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
        </div>
      ) : null}
      <div>
        {/* card to select exisitng developers and/or new ones */}
        <div className='flex h-[80dvh] w-full justify-between gap-16 border border-solid'>
          <div
            id='developer'
            className='flex h-full w-full flex-col justify-between gap-5 border border-solid p-5'
          >
            {loadingDevelopers ? (
              <>Loading...</>
            ) : (
              <>
                <h3 className='text-center text-2xl font-semibold'>
                  Select Developers to Tag to This Project
                </h3>
                <SelectVirtualized
                  className='w-full self-start'
                  key={'developer-name-filler'}
                  options={
                    developerOptions?.filter(
                      (item) =>
                        !selectedDevelopers.some(
                          (ele) => ele.value === item.value
                        )
                    ) || []
                  }
                  onChange={(
                    e: SingleValue<{
                      label: string;
                      value: string;
                    }>
                  ) => {
                    if (e) {
                      setSelectedDevelopers((prev) => [
                        ...prev,
                        {
                          label: e.label.split(':')[1],
                          value: e.value,
                        },
                      ]);
                    }
                  }}
                  isDisabled={selectedTempProject?.value === ''}
                  // menuIsOpen
                  styles={{
                    menu: (baseStyle: object, state: object) => {
                      console.log(baseStyle, state);
                      return {
                        ...baseStyle,
                        height: '220px !important',
                        overflow: 'hidden',
                      };
                    },
                  }}
                />
                <ul className='flex flex-1 flex-col gap-2 overflow-y-auto py-2'>
                  {selectedDevelopers?.map((selectedDeveloper, index) => (
                    <li
                      className='flex flex-row items-stretch justify-between gap-2 text-pretty'
                      key={index}
                    >
                      {developerEditingIndex === index ? (
                        <input
                          id='keywords-edit-input'
                          className='input input-bordered w-full flex-[4]'
                          type='text'
                          onChange={(e) => {
                            setDeveloperInputValue(e.target.value);
                          }}
                          value={developerInputValue}
                          onBlur={handleOnDeveloperInputBlur}
                          onKeyDown={handleOnDeveloperKeyDown}
                          autoFocus
                        />
                      ) : (
                        <span
                          className='btn btn-sm h-fit max-w-[80%] flex-[4] self-start !whitespace-break-spaces !break-all py-2 text-left font-normal leading-5 hover:bg-slate-50'
                          onDoubleClick={() => {
                            handleDoubleClickToEditDeveloper(
                              index,
                              selectedDeveloper.label
                            );
                          }}
                        >
                          {selectedDeveloper.label}
                        </span>
                      )}
                      <span className='h-fit w-6 self-start !whitespace-break-spaces !break-all rounded-md bg-slate-200 py-2 text-center align-middle font-normal leading-5'>
                        {selectedDeveloper.value || 'N'}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedDevelopers((prev) => {
                            return prev.filter(
                              (item, item_index) => item_index !== index
                            );
                          })
                        }
                        className='flex-1 rounded-lg bg-emerald-200 p-[1px] text-3xl'
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
                <div className='flex w-full flex-row justify-center gap-2'>
                  <button className='btn'>IS JV</button>
                  <button className='btn'>Is Mutation</button>
                </div>
                <button
                  className='btn w-full'
                  onClick={() => {
                    const to_set = [
                      ...selectedDevelopers.filter((item) => item.label !== ''),
                      {
                        label: '',
                        value: '',
                      },
                    ];
                    setSelectedDevelopers(to_set);
                    setDeveloperEditingIndex(to_set.length);
                    setDeveloperInputValue('');
                  }}
                >
                  Add Developer
                </button>
              </>
            )}
          </div>
          {/* card to add jlv partners for the developer ^ */}
          <div
            id='developer-group'
            className='relative h-full w-full border border-solid p-5'
          >
            {/* create overlay to show that this is disabled if more than one developer is selected */}
            <div
              className={`absolute left-0 top-0 z-20 bg-gray-900 opacity-50 ${selectedDevelopers.length > 1 ? 'visible h-full w-full' : 'hidden'}`}
            >
              <span
                className={`relative top-0 flex h-full w-full items-center justify-center text-center text-2xl text-white ${selectedDevelopers.length > 1 ? 'visible' : 'hidden'}`}
              >
                Cant Select Group When more than one developer is selected since
                a JV will be created.
              </span>
            </div>
            <label className='px-auto flex flex-col items-center justify-between gap-5'>
              <span className='flex-[2] text-balance text-center text-base font-semibold md:text-xl'>
                Select developers to add as Sibling Organizations to the
                Developer group
              </span>
              <Select
                className='w-full flex-[5]'
                key={'developer-jlv-selection'}
                options={[
                  {
                    label: 'aparna',
                    value: '12',
                  },
                ]}
                isDisabled={selectedDevelopers.length > 1}
              />
              <input type='text' className='input input-bordered w-full' />
            </label>
            <ul className='flex flex-col gap-2 py-2'>
              {selectedDeveloperGroup?.map((item) => (
                <li
                  key={item.value}
                  className='btn btn-sm'
                  onClick={() => {
                    setSelectedDeveloperGroup((prev) =>
                      prev.filter((ele) => ele.value !== item.value)
                    );
                  }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* button to submit above data to api */}
        <button
          className='btn w-40'
          onClick={() => {
            //
          }}
        >
          Submit
        </button>
      </div>
    </>
  );
}

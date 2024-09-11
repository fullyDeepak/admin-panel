'use client';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
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
      value: number;
    }>
  >({ label: 'Select Project', value: 0 });
  const [tempProjectOptions, setTempProjectOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [keywordOptions, setKeywordOptions] = useState<
    {
      temp_project_id: string;
      deed_types: string[];
      party: string;
      freq: number;
    }[]
  >([]);

  const [checkedKeywords, setCheckedKeywords] = useState<
    {
      temp_project_id: string;
      deed_types: string[];
      party: string;
      freq: number;
    }[]
  >([]);

  const [taggedKeywords, setTaggedKeywords] = useState<
    {
      temp_project_id: string;
      deed_types: string[];
      party: string;
      freq: number;
      keyword_type: 'developer' | 'landlord';
      removed: boolean;
    }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [selectedDeveloper, setSelectedDeveloper] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >({ label: 'Select Developer', value: '' });
  const [developerName, setDeveloperName] = useState<string>('');
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
  const [selectedJLVPartners, setSelectedJLVPartners] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

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
  const { isLoading: loadingTempProjects } = useQuery({
    queryKey: ['temp-projects', selectedVillage],
    queryFn: async () => {
      if (!selectedVillage) return null;
      const res = await axiosClient.get<{
        data: {
          id: number;
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
    staleTime: Infinity,
  });

  const { isLoading: loadingKeywords } = useQuery({
    queryKey: ['keywords', selectedTempProject],
    queryFn: async () => {
      if (!selectedTempProject?.value) return null;
      const res = await axiosClient.get<{
        data: {
          temp_project_id: string;
          deed_types: string[];
          party: string;
          freq: number;
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

  function handleOnKeyDown() {
    return (e: KeyboardEvent<HTMLInputElement>) => {
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
    };
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
              value={selectedVillage ? selectedTempProject : null}
              isLoading={loadingTempProjects}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
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
          className='mx-2 flex h-[98vh] flex-col items-center gap-2 p-2'
        >
          <h3 className='text-center text-2xl font-semibold'>
            Keywords for {selectedTempProject?.label}
          </h3>
          <div className='flex h-[80vh] w-full flex-row items-center justify-between gap-1 align-middle'>
            {/* keywords for project */}
            <div className='h-full flex-[3] overflow-auto border border-solid px-4'>
              <ul className='flex h-[100%] flex-col gap-2 overflow-auto py-2'>
                {keywordOptions
                  ?.filter(
                    (ele) =>
                      !taggedKeywords.some(
                        (item) => item.party === ele.party && !item.removed
                      )
                  )
                  .map((item) => (
                    <li key={item.party}>
                      <label className='flex w-fit flex-col'>
                        <input
                          className='peer'
                          type='checkbox'
                          hidden
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
                          <span>({item.deed_types.join(', ')})</span>{' '}
                          <span>({item.freq})</span>
                        </span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
            {/* button to shift from left to right */}
            <div className='flex flex-col gap-10'>
              <button
                className='btn btn-ghost bg-green-400'
                onClick={() => {
                  setTaggedKeywords((prev) => [
                    ...prev,
                    ...checkedKeywords.map((ele) => {
                      return {
                        ...ele,
                        keyword_type: 'developer' as const,
                        removed: false,
                      };
                    }),
                  ]);
                  setCheckedKeywords([]);
                }}
              >
                <LuMoveRight size={20} />
              </button>
              <button
                className='btn btn-ghost bg-red-400'
                onClick={() => {
                  setTaggedKeywords((prev) => [
                    ...prev,
                    ...checkedKeywords.map((ele) => {
                      return {
                        ...ele,
                        keyword_type: 'landlord' as const,
                        removed: false,
                      };
                    }),
                  ]);
                  setCheckedKeywords([]);
                  document.getElementById('selected-keywords')?.scrollTo({
                    behavior: 'smooth',
                    top: document.getElementById('selected-keywords')
                      ?.scrollHeight,
                  });
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
            {/* card to select exisitng developers and/or new ones */}
            <div className='flex h-full flex-[3] flex-col border border-solid'>
              <div
                id='developer'
                className='flex flex-[2] flex-col gap-5 overflow-x-auto border border-solid p-5'
              >
                {loadingDevelopers ? (
                  <>Loading...</>
                ) : (
                  <>
                    <label className='flex items-center justify-between gap-5'>
                      <span className='flex-1 text-base'>Developer:</span>
                      <SelectVirtualized
                        className='w-full flex-[5]'
                        key={'developer-name-filler'}
                        options={developerOptions || []}
                        onChange={(
                          e: SingleValue<{
                            label: string;
                            value: string;
                          }>
                        ) => {
                          if (e) {
                            setSelectedDeveloper({
                              label: e.label,
                              value: e.value,
                            });
                            setDeveloperName(e.label.split(':')[1]);
                            setSelectedDeveloperId(e.value);
                          }
                        }}
                        isDisabled={selectedTempProject?.value === 0}
                      />
                    </label>
                    <input
                      type='text'
                      className='input input-bordered w-full'
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                    />
                  </>
                )}
              </div>
              {/* card to add jlv partners for the developer ^ */}
              <div
                id='jlv-partners'
                className='!block flex-[3] overflow-auto border border-solid p-5'
              >
                <label className='flex flex-col items-center justify-between gap-5'>
                  <span className='flex-[2] text-base md:text-xl'>
                    Select developers to add as JLV Partners to the Above
                    Developer Name
                  </span>
                  <SelectVirtualized
                    className='w-full flex-[5]'
                    key={'developer-jlv-selection'}
                    options={
                      developerOptions?.filter(
                        (ele) =>
                          !selectedJLVPartners.some(
                            (item) => item.value === ele.value
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
                        setSelectedJLVPartners((prev) => [
                          ...prev,
                          { label: e.label, value: e.value },
                        ]);
                      }
                    }}
                    isDisabled={selectedTempProject?.value === 0}
                  />
                </label>
                <ul className='flex max-h-[60%] flex-col gap-2 overflow-y-scroll py-2'>
                  {selectedJLVPartners?.map((item) => (
                    <li
                      key={item.value}
                      className='btn btn-sm'
                      onClick={() => {
                        setSelectedJLVPartners((prev) =>
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
      ) : null}
    </>
  );
}

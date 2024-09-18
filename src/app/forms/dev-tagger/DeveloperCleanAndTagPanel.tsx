import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import toast from 'react-hot-toast';
import { LuLoader2 } from 'react-icons/lu';
import { SingleValue } from 'react-select';
// @ts-expect-error  third party
import SelectVirtualized from 'react-select-virtualized';

export function DeveloperCleanAndTagPanel({
  isMutation,
  setIsMutation,
  selectedTempProject,
  selectedDevelopers,
  setSelectedDevelopers,
  refetchDevelopersToGroup,
}: {
  isMutation: boolean;
  setIsMutation: Dispatch<SetStateAction<boolean>>;
  selectedTempProject:
    | SingleValue<{
        label: string;
        value: string;
      }>
    | undefined;
  selectedDevelopers: {
    label: string;
    value: string;
    gst_number?: string | null;
    organization_type?: string | null;
  }[];
  setSelectedDevelopers: Dispatch<
    SetStateAction<
      {
        label: string;
        value: string;
        gst_number?: string | null;
        organization_type?: string | null;
      }[]
    >
  >;
  refetchDevelopersToGroup: () => void;
}) {
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
  const [JVName, setJVName] = useState<string>('');
  const [developerEditingIndex, setDeveloperEditingIndex] =
    useState<number>(-1);
  const [developerInputValue, setDeveloperInputValue] = useState<string>('');
  function handleOnDeveloperRadioChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedDeveloperId(e.target.value);
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

  const {
    data: developerOptions,
    isLoading: loadingDevelopers,
    refetch: refetchDevelopers,
  } = useQuery({
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
  });
  return loadingDevelopers ? (
    <>
      {' '}
      <div className='flex h-[50dvh] flex-col items-center justify-center'>
        <LuLoader2 size={40} className='animate-spin' />
        <div className='text-2xl font-bold'>Loading Developers...</div>
      </div>
    </>
  ) : (
    <div
      id='developer'
      className='relative mb-2 flex h-[90dvh] w-full flex-col justify-between gap-2 border border-solid p-5'
    >
      <h3 className='text-center text-2xl font-semibold'>
        Select Developers to Tag to This Project or to Create Mutations
      </h3>
      <SelectVirtualized
        className='w-full self-start'
        key={'developer-name-filler'}
        options={
          developerOptions
            ?.filter((ele) => {
              return (
                (!isMutation &&
                  (ele.value.startsWith('M') ||
                    (selectedTempProject && ele.value.startsWith('J')))) ||
                isMutation
              );
            })
            .filter(
              (item) =>
                !selectedDevelopers.some((ele) => ele.value === item.value)
            ) || []
        }
        // closeMenuOnSelect={false}
        onChange={async (
          e: SingleValue<{
            label: string;
            value: string;
          }>
        ) => {
          if (e) {
            let gst_number: string | null;
            let organization_type: string | null;
            if (e.value.startsWith('R')) {
              const res = (
                await axiosClient.get<{
                  data: {
                    developer_id: string;
                    developer_name: string;
                    organization_type: string;
                    gst_number: string | null;
                    mca_id: string | null;
                    police_case_flag: boolean;
                    court_cases_flag: boolean;
                    case_numbers: string | null;
                    registered_state: string | null;
                    director_names: string | null;
                  };
                }>('/developers/' + e.value + '?type=rera')
              ).data.data;
              gst_number = res?.gst_number;
              organization_type = res?.organization_type;
            } else if (e.value.startsWith('M')) {
              const res = (
                await axiosClient.get<{
                  data: {
                    developer_id: string;
                    developer_name: string;
                    organization_type: string;
                    gst_number: string | null;
                    mca_id: string | null;
                    police_case_flag: boolean;
                    court_cases_flag: boolean;
                    case_numbers: string | null;
                    registered_state: string | null;
                    director_names: string | null;
                  };
                }>('/developers/' + e.value.replace('M', ''))
              ).data.data;
              gst_number = res?.gst_number;
              organization_type = res?.organization_type;
            }
            setSelectedDevelopers((prev) => [
              ...prev,
              {
                label: e.label.split(':')[1],
                value: e.value,
                gst_number: gst_number,
                organization_type: organization_type,
              },
            ]);
          }
        }}
        isDisabled={
          selectedDevelopers.filter((ele) => ele.value.startsWith('J')).length >
            0 || selectedTempProject?.value === ''
        }
        // menuIsOpen
      />
      {!isMutation && selectedDevelopers.length > 0 && (
        <label
          htmlFor='jv-name'
          className='flex items-center justify-center gap-3 self-center'
        >
          <span className='text-balance text-center text-base font-semibold md:text-xl'>
            Enter JV Name :
          </span>
          <input
            type='text'
            className='input input-bordered w-96'
            name='jv-name'
            value={JVName}
            onChange={(e) => {
              setJVName(e.target.value);
            }}
          />
        </label>
      )}
      <ul className='flex flex-1 flex-col gap-2 overflow-y-auto py-2'>
        {selectedDevelopers?.map((selectedDeveloper, index) => (
          <li
            className='flex flex-row items-center justify-between gap-2 text-pretty'
            key={index}
          >
            {isMutation ? (
              <input
                type='radio'
                className='radio checked:bg-violet-600'
                name='developer-radio'
                value={selectedDeveloper.value}
                checked={selectedDeveloper.value === selectedDeveloperId}
                onChange={handleOnDeveloperRadioChange}
              />
            ) : null}
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
                className='btn btn-sm h-full max-w-[80%] flex-[4] self-start !whitespace-break-spaces !break-all py-2 text-left font-normal leading-5 hover:bg-slate-50'
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
            <span className='btn no-animation my-auto h-full w-60 min-w-fit self-center rounded-lg bg-emerald-200 p-[1px] text-center align-middle'>
              {selectedDeveloper.organization_type || 'NA'}
            </span>
            <span className='btn no-animation my-auto h-full w-60 min-w-fit self-center rounded-lg bg-emerald-200 p-[1px] text-center align-middle'>
              {selectedDeveloper.gst_number || 'NA'}
            </span>
            <span className='btn no-animation my-auto h-full w-24 self-center rounded-lg bg-emerald-200 p-[1px] text-center align-middle'>
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
              className='btn no-animation rounded-lg bg-emerald-200 p-[1px] text-3xl'
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <div className='flex w-full flex-row justify-center gap-2'>
        <span>IS JV</span>
        <input
          type='checkbox'
          className='toggle'
          checked={isMutation}
          onChange={(e) => {
            setIsMutation(e.target.checked);
            setSelectedDevelopers([]);
          }}
        />
        <span>Is Mutation</span>
      </div>
      <button
        className='btn w-full'
        onClick={() => {
          const to_set = [
            ...selectedDevelopers.filter((item) => item.label !== ''),
            {
              label: '',
              value: 'N' + selectedDevelopers.length,
            },
          ];
          setSelectedDevelopers(to_set);
          setDeveloperEditingIndex(to_set.length - 1);
          setDeveloperInputValue('');
          const inp = document.getElementById('keywords-edit-input') as
            | HTMLInputElement
            | undefined;
          if (inp) {
            inp?.focus();
            const end = inp?.value.length;
            inp.setSelectionRange(end, end);
          }
        }}
      >
        Add Developer
      </button>
      <button
        className='btn-rezy w-40 self-center'
        onClick={async () => {
          if (isMutation && !selectedDeveloperId) {
            toast.error('Select a dominant developer first.');
            return;
          }
          const toPost = {
            project_id: selectedTempProject?.value,
            is_mutation: isMutation,
            JVName: JVName,
            developers: selectedDevelopers.map((ele) => {
              const developer_name = ele.label;
              const root_developer_id = ele.value;
              return {
                developer_name,
                root_developer_id,
              };
            }),
            mutationPriority: selectedDeveloperId,
          };
          toast.promise(
            axiosClient.post('/developers/attach-to-project', toPost),
            {
              error: (e) => {
                return (
                  'Failed to Submit : ' +
                    (
                      e as AxiosError<{
                        message: string;
                      }>
                    ).response?.data.message || 'Error'
                );
              },
              loading: 'Tagging developers...',
              success: () => {
                return 'Developers attached to project.';
              },
            }
          );
          setSelectedDevelopers([]);
          refetchDevelopersToGroup();
          refetchDevelopers();
        }}
      >
        Submit
      </button>
    </div>
  );
}

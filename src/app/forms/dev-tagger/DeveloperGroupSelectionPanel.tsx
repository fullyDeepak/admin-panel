import { KeyboardEvent, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/utils/AxiosClient';
import TanstackReactTable from './Table';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<GroupSelectorTableRow>();
export type GroupSelectorTableRow = {
  developerName: string;
  developerId: string;
};
const columns = [
  columnHelper.accessor('developerName', {
    header: 'Developer Name',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('developerName')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
  }),
  columnHelper.accessor('developerId', {
    header: 'Developer Id',
    cell: ({ row }) => (
      <p className='max-w-7xl text-pretty break-all'>
        {row.getValue('developerId')}
      </p>
    ),
    meta: {
      filterVariant: 'text',
    },
  }),
];
export function DeveloperGroupSelectionPanel({
  isMutation,
  selectedDevelopers,
  developerSelectorTableData,
}: {
  isMutation: boolean;
  selectedDevelopers: SingleValue<{ label: string; value: string }>[];
  developerSelectorTableData: GroupSelectorTableRow[];
}) {
  const [selectedDeveloperGroupId, setSelectedDeveloperGroupId] = useState<
    string | null
  >(null);
  const [cleanDeveloperGroupName, setCleanDeveloperGroupName] = useState<
    string | null
  >(null);
  const [showWarning, setShowWarning] = useState<boolean>(true);
  const [selectingGroupMembers, setSelectingGroupMembers] =
    useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<GroupSelectorTableRow[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [developerGroupMembers, setDeveloperGroupMembers] = useState<
    GroupSelectorTableRow[]
  >([]);
  const [selectedDeveloperGroup, setSelectedDeveloperGroup] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >({ label: 'Select Developer Group', value: '' });
  const [inputValue, setInputValue] = useState('');
  const [developerGroupEditingIndex, setDeveloperGroupEditingIndex] =
    useState<number>(-1);
  const [developerGroupInputValue, setDevelopergroupInputValue] =
    useState<string>('');
  function handleDoubleClickToEditDeveloperGroup(index: number, value: string) {
    console.log('double click Developer Group', index, value);
    setDeveloperGroupEditingIndex(index);
    setDevelopergroupInputValue(value);
    const inp = document.getElementById('keywords-edit-input') as
      | HTMLInputElement
      | undefined;
    if (inp) {
      inp?.focus();
      const end = inp?.value.length;
      inp.setSelectionRange(end, end);
    }
  }
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function handleOnBlur() {
    if (editingIndex != null) {
      setDeveloperGroupMembers((prev) => {
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
  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    console.log('handleOnDeveloperGroupKeyDown', developerGroupEditingIndex);
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleOnBlur();
    } else if (e.key === 'Tab' && developerGroupEditingIndex != null) {
      e.preventDefault();
      if (selectedRows.length === developerGroupEditingIndex + 1) {
        handleOnBlur();
      } else {
        handleOnBlur();
        setDeveloperGroupEditingIndex(developerGroupEditingIndex + 1);
        setInputValue(
          selectedRows[developerGroupEditingIndex + 1].developerName
        );
      }
    }
  }

  function handleOnInputBlur() {
    console.log('handleOnDeveloperGroupInputBlur', developerGroupEditingIndex);
    if (developerGroupEditingIndex != null) {
      setDeveloperGroupMembers((prev) => {
        return prev.map((ele, i) => {
          if (i === developerGroupEditingIndex) {
            return {
              ...ele,
              developerName: developerGroupInputValue,
            };
          }
          return ele;
        });
      });
      setDeveloperGroupEditingIndex(-1);
      setDevelopergroupInputValue('');
    }
  }

  const {
    data: developerGroupOptions,
    isLoading: loadingDeveloperGroupOptions,
  } = useQuery({
    queryKey: ['developer-group-options'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
        }[];
      }>('/developer-groups');
      const developerGroupOptions = res.data.data.map((item) => ({
        label: `${item.id}:${item.name}`,
        value: item.id,
      }));
      return developerGroupOptions;
    },
  });
  return (
    <div
      id='developer-group'
      className='relative mb-2 flex h-[90dvh] w-full flex-col justify-between gap-2 border border-solid p-5'
    >
      {/* create overlay to show that this is disabled if more than one developer is selected */}
      <div
        className={`absolute left-0 top-0 z-20 bg-gray-900 opacity-50 ${!isMutation && selectedDevelopers.length > 1 ? 'visible h-full w-full' : 'hidden'}`}
      >
        <span
          className={`relative top-0 flex h-full w-full items-center justify-center text-center text-xl text-white ${selectedDevelopers.length > 1 ? 'visible' : 'hidden'}`}
        >
          Cant Select Group When more than one developer is selected since a JV
          will be created.
        </span>
      </div>
      <label className='px-auto flex flex-col items-center justify-between gap-5'>
        <span className='text-balance text-center text-base font-semibold md:text-xl'>
          {selectedDeveloperGroupId
            ? `Selected Group: ${selectedDeveloperGroupId}`
            : 'Select developers to add as Sibling Organizations to the Developer group'}
        </span>
        <Select
          className='w-1/2'
          key={'developer-jlv-selection'}
          options={developerGroupOptions || []}
          isLoading={loadingDeveloperGroupOptions}
          value={selectedDeveloperGroup}
          isDisabled={selectedDevelopers.length > 1}
          isClearable
          onChange={(e) => {
            console.log(e);
            if (e?.value) {
              setSelectedDeveloperGroupId(e.value);
              setCleanDeveloperGroupName(e.label.split(':')[1].trim());
              setShowWarning(false);
              setSelectedDeveloperGroup(e);
            } else if (e === null) {
              setSelectedDeveloperGroupId(null);
              setCleanDeveloperGroupName(null);
              setShowWarning(false);
              setSelectedDeveloperGroup(null);
            }
          }}
        />
        <input
          type='text'
          className='input input-bordered w-1/2'
          value={cleanDeveloperGroupName || ''}
          onChange={(e) => {
            setSelectedDeveloperGroupId('__new');
            setCleanDeveloperGroupName(e.target.value);
            setShowWarning(true);
          }}
        />
      </label>
      {developerGroupOptions &&
        developerGroupOptions.length > 0 &&
        developerGroupOptions.find(
          (item) =>
            item.label.split(':')[1].trim().toUpperCase() ===
            cleanDeveloperGroupName?.toUpperCase()
        ) &&
        showWarning && (
          <p className='flex flex-col text-center text-2xl font-semibold'>
            <span>This Developer Group is already in the list.</span>
            <button
              className='btn btn-neutral mx-auto my-5 w-40'
              onClick={() => {
                const toSet = developerGroupOptions.find(
                  (item) =>
                    item.label.split(':')[1].trim().toUpperCase() ===
                    cleanDeveloperGroupName?.toUpperCase()
                );
                if (toSet) {
                  setSelectedDeveloperGroup(toSet);
                  setCleanDeveloperGroupName(toSet.label.split(':')[1].trim());
                  setSelectedDeveloperGroupId(toSet.value);
                  setShowWarning(false);
                }
              }}
            >
              Select That Group?
            </button>
          </p>
        )}
      {selectingGroupMembers ? (
        <div className='flex max-h-[60%] flex-1 flex-col gap-2 overflow-y-auto py-2'>
          <TanstackReactTable
            data={developerSelectorTableData}
            columns={columns}
            setSelectedRows={setSelectedRows}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            isMultiSelection={true}
          />
        </div>
      ) : (
        <>
          {developerGroupMembers.length > 0 && (
            <ul className='flex flex-1 flex-col gap-2 overflow-y-auto py-2'>
              {developerGroupMembers?.map((selectedRow, index) => (
                <li
                  className='flex flex-row items-stretch justify-between gap-2 text-pretty'
                  key={index}
                >
                  {developerGroupEditingIndex === index ? (
                    <input
                      id='keywords-edit-input'
                      className='input input-bordered w-full flex-[4]'
                      type='text'
                      onChange={(e) => {
                        setDevelopergroupInputValue(e.target.value);
                      }}
                      value={developerGroupInputValue}
                      onBlur={handleOnInputBlur}
                      onKeyDown={handleOnKeyDown}
                      autoFocus
                    />
                  ) : (
                    <span
                      className='btn btn-sm h-fit max-w-[80%] flex-[4] self-start !whitespace-break-spaces !break-all py-2 text-left font-normal leading-5 hover:bg-slate-50'
                      onDoubleClick={() => {
                        handleDoubleClickToEditDeveloperGroup(
                          index,
                          selectedRow.developerName
                        );
                      }}
                    >
                      {selectedRow.developerName}
                    </span>
                  )}
                  <span className='rounded-lg bg-emerald-200 p-[1px] text-xl'>
                    {selectedRow.developerId || 'N'}
                  </span>
                  <button
                    onClick={() =>
                      setDeveloperGroupMembers((prev) => {
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
          )}
        </>
      )}
      <button
        className='btn-rezy !w-fit self-center'
        onClick={() => {
          if (selectingGroupMembers) {
            console.log(selectedRows, developerGroupMembers);
            const res = [
              ...developerGroupMembers,
              ...selectedRows.filter((ele) => {
                return !developerGroupMembers.some(
                  (item) => item.developerId === ele.developerId
                );
              }),
            ];
            setDeveloperGroupMembers(res);
            setSelectingGroupMembers(false);
            setSelectedRows([]);
            setRowSelection({});
          } else {
            setSelectingGroupMembers(true);
          }
        }}
      >
        {selectingGroupMembers
          ? 'Attach Selected Developers to Group'
          : 'Select More Developers'}
      </button>
      <button
        className='btn-rezy w-40 self-center'
        onClick={() => {
          console.log;
        }}
      >
        Submit
      </button>
    </div>
  );
}

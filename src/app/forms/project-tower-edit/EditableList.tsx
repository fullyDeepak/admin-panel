import {
  EditProjectTaggingType,
  useEditProjectStore,
} from './useEditProjectStore';
import { nanoid } from 'nanoid';
import { KeyboardEvent, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

type AllowedKeys = Pick<
  EditProjectTaggingType,
  'developerKeywords' | 'landlordKeywords'
>;

type Props = {
  keywordType: keyof AllowedKeys;
};

export default function EditableList({ keywordType }: Props) {
  const { editProjectFormData, updateEditProjectFormData } =
    useEditProjectStore();
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDoubleClick = (index: number, value: string) => {
    setEditingIndex(index);
    setInputValue(value);
  };
  function handleDelete(item: string) {
    const filteredKeywords = editProjectFormData[keywordType]?.filter(
      (keyword) => keyword !== item
    );
    updateEditProjectFormData({
      [keywordType]: filteredKeywords,
    });
  }

  function handleOnBlur() {
    if (editingIndex != null) {
      const updatedList = [...editProjectFormData[keywordType]];
      updatedList[editingIndex] = inputValue;
      setEditingIndex(null);
      updateEditProjectFormData({
        [keywordType]: updatedList,
      });
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleOnBlur();
    } else if (e.key === 'Tab' && editingIndex != null) {
      e.preventDefault();
      if (editProjectFormData[keywordType].length === editingIndex + 1) {
        handleOnBlur();
      } else {
        setEditingIndex(editingIndex + 1);
        setInputValue(editProjectFormData[keywordType][editingIndex + 1]);
      }
    }
  }

  return (
    <ul className='flex w-full flex-col gap-4 overflow-y-auto rounded-box bg-green-100 py-4'>
      {editProjectFormData[keywordType].map((item, index) => (
        <li
          className='mx-5 flex items-center justify-between border-b pb-2 text-sm'
          key={nanoid()}
          onDoubleClick={() => handleDoubleClick(index, item)}
        >
          {editingIndex === index ? (
            <input
              type='text'
              className='w-[90%] rounded-md px-2 py-2 shadow outline-none'
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleOnBlur}
              autoFocus
            />
          ) : (
            <a>{item}</a>
          )}
          <button
            className='aspect-square rounded-full bg-red-200 p-[1px]'
            type='button'
            onClick={() => {
              handleDelete(item);
            }}
          >
            <RiCloseLine className='text-red-500' size={20} />
          </button>
        </li>
      ))}
    </ul>
  );
}
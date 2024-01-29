import { ChangeEvent, useState, KeyboardEvent } from 'react';

type ChipInputProps = {
  chips: string[];
  updateFormData: (newDetails: Partial<object>) => void;
  updateKey: string;
};

const ChipInput = ({ chips, updateFormData, updateKey }: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(',', ''));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' ||
      (e.key === ',' &&
        inputValue.trim() !== '' &&
        !chips.includes(inputValue.trim()))
    ) {
      updateFormData({
        [updateKey]: [...chips, inputValue.trim()],
      });
      setInputValue('');
    }
  };

  const handleChipRemove = (indexToRemove: number) => {
    updateFormData({
      [updateKey]: chips.filter((_, index) => index !== indexToRemove),
    });
  };

  return (
    <div className='ml-[6px] flex w-full flex-[5] flex-wrap items-center gap-3 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-600 '>
      {chips.map((chip, index) => (
        <div key={index} className='badge border-rose-300 bg-rose-100'>
          {chip}
          <span
            className='cursor-pointer pl-1'
            onClick={() => handleChipRemove(index)}
          >
            &times;
          </span>
        </div>
      ))}
      <input
        type='text'
        className='outline-none'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={'Hit Enter or Comma for chip'}
      />
    </div>
  );
};

export default ChipInput;

import React, { KeyboardEvent, useState } from 'react';

type ChipInputProps = {
  chips: string[];
  onChange: (chips: string[]) => void;
  inputValue?: string;
  onInputValueChange?: (chip: string) => void;
  placeholder?: string;
  allowDuplicate?: boolean;
  autoTrim?: boolean;
};

const ChipInputV2 = ({
  chips,
  placeholder,
  inputValue,
  onInputValueChange,
  onChange,
  allowDuplicate,
  autoTrim,
}: ChipInputProps) => {
  const [value, setValue] = useState(inputValue || '');
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value) {
      e.preventDefault();
      e.stopPropagation();
      if (allowDuplicate) {
        onChange([...chips, autoTrim ? value.trim() : value]);
        setValue('');
        onInputValueChange?.('');
      } else if (!chips.includes(autoTrim ? value.trim() : value)) {
        onChange([...chips, autoTrim ? value.trim() : value]);
        setValue('');
        onInputValueChange?.('');
      }
    }
  };

  function handleChipRemove(index: number) {
    const newChips = chips.filter((_, i) => i !== index);
    onChange(newChips);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onInputValueChange?.(e.target.value);
    setValue(e.target.value);
  }

  return (
    <div
      className={`flex w-full flex-[5] flex-wrap items-center gap-3 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-violet-600`}
    >
      {chips?.map((chip, index) => (
        <div
          key={index}
          className='relative h-auto max-h-60 whitespace-pre-wrap rounded-xl bg-violet-100 pl-2 pr-7 outline outline-1 outline-violet-300'
        >
          {chip}
          <span
            className='absolute -right-0 top-0 flex h-full w-5 cursor-pointer select-none items-center justify-center rounded-r-xl bg-violet-500 px-1.5 text-white'
            onClick={() => handleChipRemove(index)}
          >
            <span>&times;</span>
          </span>
        </div>
      ))}
      <input
        type='text'
        className='outline-none'
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        placeholder={placeholder ? placeholder : 'Add value and Press Enter'}
      />
    </div>
  );
};

export default ChipInputV2;

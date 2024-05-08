import React, { ChangeEvent, useState, KeyboardEvent } from 'react';

type ChipInputProps =
  | {
      chips: string[];
      updateFormData: (newDetails: Partial<object>) => void;
      updateChipsFn?: never;
      updateKey: string;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: true;
      generationKey: string;
    }
  | {
      chips: string[];
      updateFormData: (newDetails: Partial<object>) => void;
      updateChipsFn?: never;
      updateKey: string;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: false;
      generationKey?: never;
    }
  | {
      chips: string[];
      updateChipsFn: React.Dispatch<React.SetStateAction<string[]>>;
      updateFormData?: never;
      updateKey?: never;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: false;
      generationKey?: never;
    };

const ChipInput = ({
  chips,
  updateFormData,
  placeholder,
  regexPattern,
  addTWClass,
  updateKey,
  enableGeneration,
  generationKey,
  updateChipsFn,
}: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(',', ''));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === 'Enter' || e.key === ',') &&
      inputValue.trim() !== '' &&
      !chips.includes(inputValue.trim())
    ) {
      if (enableGeneration && inputValue.includes(generationKey)) {
        const [start, stop] = inputValue.split(generationKey);
        const generatedChips = [];
        for (let i = +start; i <= +stop; i++) {
          !chips.includes(String(i)) ? generatedChips.push(String(i)) : null;
        }
        updateFormData({
          [updateKey]: [...chips, ...generatedChips],
        });
        setInputValue('');
      } else {
        if (regexPattern !== undefined) {
          const value = inputValue.trim();
          if (regexPattern.test(value) && updateFormData) {
            updateFormData({
              [updateKey]: [...chips, inputValue.trim()],
            });
            setInputValue('');
          } else if (updateChipsFn) {
            updateChipsFn([...chips, inputValue.trim()]);
          }
        } else {
          if (updateFormData) {
            updateFormData({
              [updateKey]: [...chips, inputValue.trim()],
            });
          } else if (updateChipsFn) {
            updateChipsFn([...chips, inputValue.trim()]);
          }
          setInputValue('');
        }
      }
    } else if (
      e.key === 'Backspace' &&
      chips.length > 0 &&
      inputValue.length === 0
    ) {
      const newChips = [...chips];
      newChips.pop();
      if (updateFormData) {
        updateFormData({
          [updateKey]: newChips,
        });
      } else if (updateChipsFn) {
        updateChipsFn(newChips);
      }
      setInputValue('');
    }
  };

  const handleChipRemove = (indexToRemove: number) => {
    if (updateFormData) {
      updateFormData({
        [updateKey]: chips.filter((_, index) => index !== indexToRemove),
      });
    } else if (updateChipsFn) {
      updateChipsFn(chips.filter((_, index) => index !== indexToRemove));
    }
  };

  return (
    <div
      className={`ml-[6px] flex w-full flex-[5] flex-wrap items-center gap-3 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-600 ${addTWClass}`}
    >
      {chips?.map((chip, index) => (
        <div
          key={index}
          className='badge h-auto max-h-60 border-rose-300 bg-rose-100'
        >
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
        placeholder={placeholder ? placeholder : 'Hit Enter or Comma for chip'}
      />
    </div>
  );
};

export default ChipInput;

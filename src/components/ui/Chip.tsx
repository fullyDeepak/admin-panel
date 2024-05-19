import React, { ChangeEvent, useState, KeyboardEvent } from 'react';

type ChipInputProps =
  | {
      chips: string[];
      updateFormData: (id: number, key: string, value: any) => void;
      updateChipsFn?: never;
      updateKey: string;
      updateId: number;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: true;
      generationKey: string;
      allowTrim?: boolean;
    }
  | {
      chips: string[];
      updateFormData: (id: number, key: string, value: any) => void;
      updateChipsFn?: never;
      updateKey: string;
      updateId: number;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: false;
      generationKey?: never;
      allowTrim?: boolean;
    }
  | {
      chips: string[];
      updateChipsFn: React.Dispatch<React.SetStateAction<string[]>>;
      updateFormData?: never;
      updateKey?: never;
      updateId?: number;
      regexPattern?: RegExp;
      placeholder?: string;
      addTWClass?: string;
      enableGeneration?: false;
      generationKey?: never;
      allowTrim?: boolean;
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
  updateId,
  allowTrim = true,
}: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(',', ''));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === 'Enter' || e.key === ',') &&
      (allowTrim ? inputValue.trim() !== '' : true) &&
      (allowTrim
        ? !chips.includes(inputValue.trim())
        : !chips.includes(inputValue))
    ) {
      if (enableGeneration && inputValue.includes(generationKey)) {
        const [start, stop] = inputValue.split(generationKey);
        const generatedChips = [];
        for (let i = +start; i <= +stop; i++) {
          !chips.includes(String(i)) ? generatedChips.push(String(i)) : null;
        }
        updateFormData(updateId, updateKey, [...chips, ...generatedChips]);
        setInputValue('');
      } else {
        if (regexPattern !== undefined) {
          const value = allowTrim ? inputValue.trim() : inputValue;
          if (regexPattern.test(value) && updateFormData) {
            updateFormData(updateId, updateKey, [
              ...chips,
              allowTrim ? inputValue.trim() : inputValue,
            ]);
            setInputValue('');
          } else if (updateChipsFn) {
            updateChipsFn([
              ...chips,
              allowTrim ? inputValue.trim() : inputValue,
            ]);
          }
        } else {
          console.log({ inputValue });
          if (updateFormData) {
            updateFormData(updateId, updateKey, [
              ...chips,
              allowTrim ? inputValue.trim() : inputValue,
            ]);
          } else if (updateChipsFn) {
            updateChipsFn([
              ...chips,
              allowTrim ? inputValue.trim() : inputValue,
            ]);
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
        updateFormData(updateId, updateKey, newChips);
      } else if (updateChipsFn) {
        updateChipsFn(newChips);
      }
      setInputValue('');
    }
  };

  const handleChipRemove = (indexToRemove: number) => {
    if (updateFormData) {
      updateFormData(
        updateId,
        updateKey,
        chips.filter((_, index) => index !== indexToRemove)
      );
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
          className='badge h-auto max-h-60 whitespace-pre-wrap border-rose-300 bg-rose-100'
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

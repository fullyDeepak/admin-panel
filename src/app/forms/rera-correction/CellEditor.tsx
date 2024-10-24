'use client';

import { useState } from 'react';

type Props = {
  value: string;
  onComplete: (_newValue: string) => void;
};

export default function CellEditor({ onComplete, value }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const onBlur = () => {
    setIsEditing(false);
    onComplete(inputValue);
  };
  return (
    <div onDoubleClick={() => setIsEditing(true)} className='min-h-5'>
      {isEditing ? (
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          spellCheck={false}
          className='w-full flex-[5] rounded-md border-0 bg-transparent p-1 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
          onBlur={onBlur}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onComplete(inputValue);
              setIsEditing(false);
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

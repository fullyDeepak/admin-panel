'use client';

import { ChangeEvent, useState } from 'react';

type Props = {
  value: string;
  onChange: (_e: ChangeEvent<HTMLInputElement>) => void;
};

export default function CellEditor({ onChange, value }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const onBlur = () => {
    setIsEditing(false);
  };
  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          type='text'
          value={value}
          onChange={onChange}
          className='w-full flex-[5] rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
          onBlur={onBlur}
          autoFocus
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

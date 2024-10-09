'use client';

import axiosClient from '@/utils/AxiosClient';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';

type Response = {
  message: string;
  data: { label: string; value: string }[];
};

export default function Page() {
  const [_inputValue, setValue] = useState('');
  const [selectedValue, _setSelectedValue] = useState(null);

  async function loadSuggestions(inputValue: string) {
    if (inputValue.length < 3) {
      return [];
    }
    const response = await axiosClient.get<Response>('/map/autocomplete', {
      params: { query: inputValue },
    });
    return response.data.data;
  }
  const loadOptions = useCallback(debounce(loadSuggestions, 500), []);

  const handleInputChange = (value: string) => {
    setValue(value);
  };

  // const handleChange = (value: string) => {
  //   setSelectedValue(value);
  // };

  return (
    <div className='mx-auto mt-20 flex max-w-[80%] items-center justify-center'>
      <div className='flex w-full max-w-[500px] flex-col items-center'>
        <AsyncSelect
          value={selectedValue}
          className='w-full'
          loadOptions={loadOptions}
          onInputChange={handleInputChange}
          // onChange={handleChange}
        />
        <pre className='max-w-[80%] whitespace-pre-wrap'>
          Selected Value: {JSON.stringify(selectedValue || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}

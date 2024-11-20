import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ImageItem, ImageStoreState } from '../../useProjectImageStore';

type Props = {
  imgKey: keyof ImageStoreState;
  fileName: string;
  label:
    | {
        label: string;
        value: string;
        __isNew__?: boolean | undefined;
      }
    | undefined;
  setProjectImageLabel: (
    _key: keyof ImageStoreState,
    _fileName: string,
    _label: ImageItem['label']
  ) => void;
};

export default function ImageLabelDropdown({
  imgKey,
  fileName,
  label,
  setProjectImageLabel,
}: Props) {
  const { data: options, isLoading } = useQuery({
    queryKey: ['image-labels'],
    queryFn: async () => {
      const res = await axiosClient('/forms/imgTag/label');
      return res.data.data;
    },
  });
  return (
    <CreatableSelect
      className='w-40 text-xs'
      options={options || []}
      isLoading={isLoading}
      value={label || undefined}
      isClearable
      instanceId={'image-label-selector'}
      onChange={(
        e: SingleValue<{
          label: string;
          value: string;
          __isNew__?: boolean | undefined;
        }>
      ) => {
        if (e) {
          setProjectImageLabel(imgKey, fileName, e);
        }
      }}
    />
  );
}

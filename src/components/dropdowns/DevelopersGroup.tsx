import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { Props } from 'react-select';
export function DeveloperGroup(props: Props & { SetValue: string | null }) {
  const { data: developerGroup, isLoading: loadingDeveloperGroup } = useQuery({
    queryKey: ['developer-group'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          id: number;
          name: string;
        }[];
      }>('/developers/developer-groups');
      return [
        ...res.data.data.map((item) => ({
          label: `G:${item.id}:${item.name}`,
          value: `G:${item.id}`,
        })),
      ];
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Select
        key={'developerGroupSelector'}
        options={developerGroup || []}
        isLoading={loadingDeveloperGroup}
        isDisabled={props.isDisabled}
        onChange={props.onChange}
        value={
          developerGroup?.find((ele) => ele.value == props.SetValue) || null
        }
        className={props.className}
      />
    </>
  );
}

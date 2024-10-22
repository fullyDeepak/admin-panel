import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { Props } from 'react-select';
export function MasterDevelopers(props: Props & { SetValue: string | null }) {
  const { data: masterDevelopers, isLoading: loadingMasterDevelopers } =
    useQuery({
      queryKey: ['master-developers'],
      queryFn: async () => {
        const res = await axiosClient.get<{
          data: {
            developers: {
              id: number;
              name: string;
              developer_group_name: string;
            }[];
            jvs: { id: number; name: string }[];
          };
        }>('/developers/master-developers-jv');
        return [
          ...res.data.data.developers.map((item) => ({
            label: `M:${item.id}:${item.name}:${item.developer_group_name}`,
            value: `DEVELOPER:${item.id}`,
          })),
          ...res.data.data.jvs.map((item) => ({
            label: `J:${item.id}:${item.name}`,
            value: `JV:${item.id}`,
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
        key={'masterDeveloperSelector'}
        options={masterDevelopers || []}
        isLoading={loadingMasterDevelopers}
        isDisabled={props.isDisabled}
        onChange={props.onChange}
        value={
          masterDevelopers?.find((ele) => ele.value === props.SetValue) || null
        }
        className={props.className}
      />
    </>
  );
}

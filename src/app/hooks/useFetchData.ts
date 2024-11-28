import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

const fetchData = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<{ data: T }> = await axiosClient.get(url);

  return response.data.data;
};

const useFetchData = <T>(url: string | null, staleTime = 1000 * 60 * 5) => {
  return useQuery<T, Error>({
    queryKey: [url],
    queryFn: () => fetchData<T>(url || ''),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(url),
  });
};

export default useFetchData;

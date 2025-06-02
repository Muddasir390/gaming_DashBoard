import { useQuery } from '@tanstack/react-query';
import { getTimeToFirstSessionAPI } from '../api/activation';


export function useGetTimeToFirstSession() {
  const {
    refetch: getTimeToFirstSessionRefetch,
    isLoading: getTimeToFirstSessionIsLoading,
    isSuccess: getTimeToFirstSessionIsSuccess,
    data: getTimeToFirstSessionData,
    isRefetching: getTimeToFirstSessionIsRefetching,
  } = useQuery({
    queryKey: ['getTimeToFirstSession'],
    queryFn: getTimeToFirstSessionAPI,
    retry: false,
    enabled:  false
  });

  return {
    getTimeToFirstSessionRefetch,
    getTimeToFirstSessionIsLoading,
    getTimeToFirstSessionIsSuccess,
    getTimeToFirstSessionData,
    getTimeToFirstSessionIsRefetching,
  };
}

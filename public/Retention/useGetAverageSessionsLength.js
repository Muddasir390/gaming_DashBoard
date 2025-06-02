import { useQuery } from '@tanstack/react-query';
import { getAverageSessionsLengthAPI } from '../api/retention';


export function useGetAverageSessionsLength() {
  const {
    refetch: averageSessionsLengthRefetch,
    isLoading: averageSessionsLengthIsLoading,
    isSuccess: averageSessionsLengthIsSuccess,
    data: averageSessionsLengthData,
    isRefetching: averageSessionsLengthIsRefetching,
  } = useQuery({
    queryKey: ['averageSessionsLength'],
    queryFn: getAverageSessionsLengthAPI,
    retry: false,
    enabled:  false
  });

  return {
    averageSessionsLengthRefetch,
    averageSessionsLengthIsLoading,
    averageSessionsLengthIsSuccess,
    averageSessionsLengthData,
    averageSessionsLengthIsRefetching,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getRegistrationToFirstSessionRateAPI} from '../api/activation';


export function useGetRegistrationToFirstSessionRate() {
  const {
    refetch: getRegistrationToFirstSessionRateRefetch,
    isLoading: getRegistrationToFirstSessionRateIsLoading,
    isSuccess: getRegistrationToFirstSessionRateIsSuccess,
    data: getRegistrationToFirstSessionRateData,
    isRefetching: getRegistrationToFirstSessionRateIsRefetching,
  } = useQuery({
    queryKey: ['getRegistrationToFirstSessionRateAPI'],
    queryFn: getRegistrationToFirstSessionRateAPI,
    retry: false,
    enabled:  false
  });

  return {
    getRegistrationToFirstSessionRateRefetch,
    getRegistrationToFirstSessionRateIsLoading,
    getRegistrationToFirstSessionRateIsSuccess,
    getRegistrationToFirstSessionRateData,
    getRegistrationToFirstSessionRateIsRefetching,
  };
}

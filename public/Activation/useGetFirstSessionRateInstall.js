import { useQuery } from '@tanstack/react-query';
import {getFirstSessionRateInstallAPI} from '../api/activation';


export function useGetFirstSessionRateInstall() {
  const {
    refetch: getFirstSessionRateInstallRefetch,
    isLoading: getFirstSessionRateInstallIsLoading,
    isSuccess: getFirstSessionRateInstallIsSuccess,
    data: getFirstSessionRateInstallData,
    isRefetching: getFirstSessionRateInstallIsRefetching,
  } = useQuery({
    queryKey: ['getFirstSessionRateInstall'],
    queryFn: getFirstSessionRateInstallAPI,
    retry: false,
    enabled:  false
  });

  return {
    getFirstSessionRateInstallRefetch,
    getFirstSessionRateInstallIsLoading,
    getFirstSessionRateInstallIsSuccess,
    getFirstSessionRateInstallData,
    getFirstSessionRateInstallIsRefetching,
  };
}

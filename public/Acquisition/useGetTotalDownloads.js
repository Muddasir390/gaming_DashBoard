import { useQuery } from '@tanstack/react-query';
import { getTotalDownloadsAPI } from '../api/acusition';


export function useGetTotalDownloads() {
  const {
    refetch: totalDownloadsRefetch,
    isLoading: totalDownloadsIsLoading,
    isSuccess: totalDownloadsIsSuccess,
    data: totalDownloadsData,
    isRefetching: totalDownloadsIsRefetching,
  } = useQuery({
    queryKey: ['totalDownloads'],
    queryFn: getTotalDownloadsAPI,
    retry: false,
    enabled:  false
  });

  return {
    totalDownloadsRefetch,
    totalDownloadsIsLoading,
    totalDownloadsIsSuccess,
    totalDownloadsData,
    totalDownloadsIsRefetching,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getDownloadsApi } from '../api/acusition';


export function useGetTotalFileDownloads() {
  const {
    refetch: downloadsRefetch,
    isLoading: downloadsLoading,
    isSuccess: downloadIsSuccess,
    data: downloadsData,
    isRefetching: downloadsIsRefetching,
  } = useQuery({
    queryKey: ['downloadsData'],
    queryFn: getDownloadsApi,
    retry: false,
    enabled:  true
  });

  return {
    downloadsRefetch,
    downloadsLoading,
    downloadIsSuccess,
    downloadsData,
    downloadsIsRefetching,
  };
}

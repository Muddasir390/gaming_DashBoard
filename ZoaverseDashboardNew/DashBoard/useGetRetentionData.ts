import { useQuery } from '@tanstack/react-query';
import { getRetentionAPi } from '../api/dashBoard';


export function useGetRetentionData(data:any) {
  const {
    refetch: retentionRefetch,
    isLoading: retentionLoading,
    isSuccess: retentionIsSuccess,
    data: retentionData,
    isRefetching: retentionIsRefetching,
  } = useQuery({
    queryKey: ['getRetention', data],
    queryFn: (data)=> getRetentionAPi(data),
    retry: false,
    enabled:  true
  });

  return {
    retentionRefetch,
    retentionLoading,
    retentionIsSuccess,
    retentionData,
    retentionIsRefetching,
  };
}

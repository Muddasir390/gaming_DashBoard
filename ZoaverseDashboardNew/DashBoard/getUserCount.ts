import { useQuery } from '@tanstack/react-query';
import { getUserCountApi } from '../api/dashBoard';


export function getUserCount() {
  const {
    refetch: userCountRefetch,
    isLoading: userCountLoading,
    isSuccess: userCountIsSuccess,
    data: userCountData,
    isRefetching: userCountIsRefetching,
  } = useQuery({
    queryKey: ['getUserCount'],
    queryFn: getUserCountApi,
    retry: false,
    enabled:  true
  });

  return {
    userCountRefetch,
    userCountLoading,
    userCountIsSuccess,
    userCountData,
    userCountIsRefetching,
  };
}

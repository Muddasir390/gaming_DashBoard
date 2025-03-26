import { useQuery } from '@tanstack/react-query';
import { getSessionApi } from '../api/dashBoard';


export function useGetSession() {
  const {
    refetch: sessionRefetch,
    isLoading: sessionLoading,
    isSuccess: sessionSuccess,
    data: sessionData,
    isRefetching: sessionRefetching,
  } = useQuery({
    queryKey: ['getSession'],
    queryFn: getSessionApi,
    retry: false,
    enabled:  true
  });

  return {
    sessionRefetch,
    sessionLoading,
    sessionSuccess,
    sessionData,
    sessionRefetching,
  };
}

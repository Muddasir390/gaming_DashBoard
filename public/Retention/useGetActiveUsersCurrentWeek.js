import { useQuery } from '@tanstack/react-query';
import {getActiveUsersCurrentWeekURL} from '../api/retention';


export function useGetActiveUsersCurrentWeek() {
  const {
    refetch: activeUsersCurrentWeekRefetch,
    isLoading: activeUsersCurrentWeekIsLoading,
    isSuccess: activeUsersCurrentWeekIsSuccess,
    data: activeUsersCurrentWeekData,
    isRefetching: activeUsersCurrentWeekIsRefetching,
  } = useQuery({
    queryKey: ['activeUsersCurrentWeek'],
    queryFn: getActiveUsersCurrentWeekURL,
    retry: false,
    enabled:  false
  });

  return {
    activeUsersCurrentWeekRefetch,
    activeUsersCurrentWeekIsLoading,
    activeUsersCurrentWeekIsSuccess,
    activeUsersCurrentWeekData,
    activeUsersCurrentWeekIsRefetching,
  };
}

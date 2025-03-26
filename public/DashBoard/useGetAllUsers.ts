import { useQuery } from '@tanstack/react-query';
import { getAllUsersApi } from '../api/dashBoard';


export function useGetAllUsers() {
  const {
    refetch: refetchUsers,
    isLoading: usersLoading,
    isSuccess: usersSuccess,
    data: usersData,
    isRefetching: usersRefetchLoading,
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsersApi,
    retry: false,
    enabled:  true
  });

  return {
    refetchUsers,
    usersLoading,
    usersSuccess,
    usersData,
    usersRefetchLoading,
  };
}

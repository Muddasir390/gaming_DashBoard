import { useMutation } from '@tanstack/react-query';
import { dailyActiveUserApi } from '../api/dashBoard';

export function dailyActiveUsers() {

  const {
    mutate: activeUsers,
    isPending: activeUserLoading,
    data: activeUsersData,
    isSuccess: activeUsersSuccess,
    
  } = useMutation({
    mutationFn: dailyActiveUserApi,
    retry: false,
  });

  return {
    activeUsers,
    activeUserLoading,
    activeUsersData,
    activeUsersSuccess
  };
}

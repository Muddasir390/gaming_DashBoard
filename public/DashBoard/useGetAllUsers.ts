import { useMutation } from '@tanstack/react-query';
import {getAllUsersApi} from '../api/dashBoard'

export function useGetAllUsers() {

  const {
    mutate: getUser,
    isPending: usersLoading,
    data: usersData,
    isError: usersIsError,
    isSuccess: UserIsSuccess,
  } = useMutation({
    mutationFn: getAllUsersApi,
    retry: false,
  });

  return {
    getUser,
    usersLoading,
    usersData,
    usersIsError,
    UserIsSuccess,
  };
}

import { useMutation } from '@tanstack/react-query';
import {
  loginApi
} from '../api/login';

export function useLoginQuery() {

  const {
    mutate: userLogin,
    isPending: loading,
    data: dataLoginPost,
    isError: isErrorLoginPost,
    isSuccess: isSuccessLogin,
  } = useMutation({
    mutationFn: loginApi,
    retry: false,
  });

  return {
    userLogin,
    loading,
    dataLoginPost,
    isErrorLoginPost,
    isSuccessLogin
  };
}

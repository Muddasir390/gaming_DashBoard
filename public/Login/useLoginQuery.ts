import { useMutation } from '@tanstack/react-query';
import {
  loginApi
} from '../api/login';
import { useRouter } from "next/router";

export function useLoginQuery() {
  const route = useRouter()

  const {
    mutate: userLogin,
    isPending: loading,
    data: dataLoginPost,
    isError: isErrorLoginPost,
    isSuccess: isSuccessLogin,
  } = useMutation({
    mutationFn: loginApi,
    retry: false,
    onSuccess: success => {
      route.push('/dashBoard')
    },
  });

  return {
    userLogin,
    loading,
    dataLoginPost,
    isErrorLoginPost,
    isSuccessLogin
  };
}

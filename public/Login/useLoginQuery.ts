import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify'

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
    onError:((e:any)=> toast.error(e?.response?.data?.message))
  });

  return {
    userLogin,
    loading,
    dataLoginPost,
    isErrorLoginPost,
    isSuccessLogin
  };
}

import { useMutation } from '@tanstack/react-query';
import {getSinglePostApi} from '../api/dashBoard'

export function useGetSinglePostData() {

  const {
    mutate: postData,
    isPending: loading,
    data: singlePostData,
    isError: singlePostIsError,
    isSuccess: singlePostIsSuccess,
  } = useMutation({
    mutationFn: getSinglePostApi,
    retry: false,
  });

  return {
    postData,
    loading,
    singlePostData,
    singlePostIsError,
    singlePostIsSuccess,
  };
}

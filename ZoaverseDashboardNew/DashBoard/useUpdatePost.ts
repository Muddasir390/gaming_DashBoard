import { useMutation } from '@tanstack/react-query';
import {updatePostApi} from '../api/dashBoard'

export function useUpdatePost() {

  const {
    mutate: updatePost,
    isPending: updatePostLoading,
    data: updatePostData,
    isError: updatePostIsError,
    isSuccess: updatePostIsSuccess,
  } = useMutation({
    mutationFn: updatePostApi,
    retry: false,
  });

  return {
    updatePost,
    updatePostLoading,
    updatePostData,
    updatePostIsError,
    updatePostIsSuccess,
  };
}

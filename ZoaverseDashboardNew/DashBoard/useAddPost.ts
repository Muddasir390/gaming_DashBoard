import { useMutation } from '@tanstack/react-query';
import {addPostApi} from '../api/dashBoard'

export function useAddPost() {

  const {
    mutate: addPost,
    isPending: addPostLoading,
    data: addPostData,
    isError: addPostIsError,
    isSuccess: addPostIsSuccess,
  } = useMutation({
    mutationFn: addPostApi,
    retry: false,
  });

  return {
    addPost,
    addPostLoading,
    addPostData,
    addPostIsError,
    addPostIsSuccess,
  };
}

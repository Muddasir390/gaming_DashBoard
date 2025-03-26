import { useMutation } from '@tanstack/react-query';
import { deletePostApi } from '../api/dashBoard';

export function useDeletePost() {

  const {
    mutate: deletePost,
    isPending: deletePostLoading,
    data: deletePostData,
    isSuccess: deletePostIsSucces,
  } = useMutation({
    mutationFn: deletePostApi,
    retry: false,
  });

  return {
    deletePost,
    deletePostLoading,
    deletePostData,
    deletePostIsSucces,
  };
}

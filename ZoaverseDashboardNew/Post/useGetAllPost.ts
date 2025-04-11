import { useQuery } from '@tanstack/react-query';
import { getAllPostApi } from '../api/dashBoard';


export function useGetAllPost() {
  const {
    refetch: refetchPost,
    isLoading: postLoading,
    isSuccess: postIsSuccess,
    data: postData,
    isRefetching: postRefetchLoading,
  } = useQuery({
    queryKey: ['allAds'],
    queryFn: getAllPostApi,
    retry: false,
    enabled:  true
  });

  return {
    refetchPost,
    postLoading,
    postIsSuccess,
    postData,
    postRefetchLoading,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getSpecificUserApi } from '../api/dashBoard';


export function specificUserDetail(data:any) {
  const {
    refetch: specificUserRefetch,
    isLoading: specificUserIsLoading,
    isSuccess: specificUserIsSuccess,
    data: specificUserData,
    isRefetching: specificUserIsRefetching,
  } = useQuery({
    queryKey: ['specificUserDetail', data],
    queryFn:(data)=> getSpecificUserApi(data),
    retry: false,
    enabled:  data?.id ? true : false
  });

  return {
    specificUserRefetch,
    specificUserIsLoading,
    specificUserIsSuccess,
    specificUserData,
    specificUserIsRefetching,
  };
}

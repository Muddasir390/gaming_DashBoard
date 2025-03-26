import { useQuery } from '@tanstack/react-query';
import { getAllFleetsApi } from '../api/dashBoard';

export function useGetAllFleets() {
  const {
    error: getFleetsError,
    refetch: refetchFleet,
    isLoading: fleetsLoading,
    isSuccess: fleetIsSuccess,
    isRefetching: fleetsRefetchLoading,
    data: fleetsData,
  } = useQuery({
    queryKey: ['getAllFleets'],
    queryFn: getAllFleetsApi,
    retry: false,
    enabled: true,
  });

  return {
    getFleetsError,
    refetchFleet,
    fleetsLoading,
    fleetIsSuccess,
    fleetsRefetchLoading,
    fleetsData,
  };
}

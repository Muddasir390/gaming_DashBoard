import { useQuery } from '@tanstack/react-query';
import { getRepeatPurchaseRate } from '../api/revenue';


export function useGetRepeatPurchaseRate() {
  const {
    refetch: repeatPurchaseRateRefetch,
    isLoading: repeatPurchaseRateIsLoading,
    isSuccess: repeatPurchaseRateIsSuccess,
    data: repeatPurchaseRateData,
    isRefetching: repeatPurchaseRateIsRefetching,
  } = useQuery({
    queryKey: ['repeatPurchaseRate'],
    queryFn: getRepeatPurchaseRate,
    retry: false,
    enabled:  false
  });

  return {
    repeatPurchaseRateRefetch,
    repeatPurchaseRateIsLoading,
    repeatPurchaseRateIsSuccess,
    repeatPurchaseRateData,
    repeatPurchaseRateIsRefetching,
  };
}

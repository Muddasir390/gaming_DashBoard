import { useQuery } from '@tanstack/react-query';
import {getPurchaseRateAPI} from '../api/acusition';


export function useGetPurchaseRate() {
  const {
    refetch: purchaseRateRefetch,
    isLoading: purchaseRateIsLoading,
    isSuccess: purchaseRateIsSuccess,
    data: purchaseRateData,
    isRefetching: purchaseRateIsRefetching,
  } = useQuery({
    queryKey: ['purchaseRate'],
    queryFn: getPurchaseRateAPI,
    retry: false,
    enabled:  false
  });

  return {
    purchaseRateRefetch,
    purchaseRateIsLoading,
    purchaseRateIsSuccess,
    purchaseRateData,
    purchaseRateIsRefetching,
  };
}

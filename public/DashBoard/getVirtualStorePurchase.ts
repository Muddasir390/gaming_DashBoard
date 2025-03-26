import { useMutation } from '@tanstack/react-query';
import { virtualStorePurchaseApi } from '../api/dashBoard';

export function getVirtualStorePurchase() {

  const {
    mutate: virtualStore,
    isPending: virtualStoreLoading,
    data: virtualStoreData,
    isSuccess: virtualStoreIsSuccess,
  } = useMutation({
    mutationFn: virtualStorePurchaseApi,
    retry: false,
  });

  return {
    virtualStore,
    virtualStoreLoading,
    virtualStoreData,
    virtualStoreIsSuccess,
  };
}

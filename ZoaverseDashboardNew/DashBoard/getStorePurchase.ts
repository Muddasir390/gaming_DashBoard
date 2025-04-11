import { useMutation } from '@tanstack/react-query';
import { storePurchaseApi } from '../api/dashBoard';

export function getStorePurchase() {

  const {
    mutate: storePurchase,
    isPending: storePurchaseLoading,
    data: storePurchaseData,
    isSuccess: storePurchaseIsSuccess,
  } = useMutation({
    mutationFn: storePurchaseApi,
    retry: false,
  });

  return {
    storePurchase,
    storePurchaseLoading,
    storePurchaseData,
    storePurchaseIsSuccess,
  };
}

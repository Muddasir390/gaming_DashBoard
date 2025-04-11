import { useMutation } from '@tanstack/react-query';
import { updateFleetApi } from '../api/dashBoard';

export function useUpdateFleet() {

  const {
    mutate: updateFleet,
    isPending: updateFleetLoading,
    data: updateFleetData,
    isSuccess: updateFleetIsSuccess,
  } = useMutation({
    mutationFn: updateFleetApi,
    retry: false,
  });

  return {
    updateFleet,
    updateFleetLoading,
    updateFleetData,
    updateFleetIsSuccess,
  };
}

import { useQuery } from "@tanstack/react-query";
import { getReactivationRateAPI } from "../api/retention";

export function useGetReactivationRate(data) {
  const {
    refetch: reactivationRateRefetch,
    isLoading: reactivationRateIsLoading,
    isSuccess: reactivationRateIsSuccess,
    data: reactivationRateData,
    isError: reactivationRateIsError,
    error: reactivationRateError,
  } = useQuery({
    queryKey: ["reactivationRate", data],
    queryFn: getReactivationRateAPI,
    retry: false,
    enabled: !!data.startDate && !!data.endDate && !!data.inactivityDays,
  });

  return {
    reactivationRateRefetch,
    reactivationRateIsLoading,
    reactivationRateIsSuccess,
    reactivationRateData,
    reactivationRateIsError,
    reactivationRateError,
  };
}
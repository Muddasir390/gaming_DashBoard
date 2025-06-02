import { useQuery } from "@tanstack/react-query";
import { getChurnRateAPI } from "../api/retention";

export function useGetChurnRate(data) {
  const {
    refetch: churnRateRefetch,
    isLoading: churnRateIsLoading,
    isSuccess: churnRateIsSuccess,
    data: churnRateData,
    isError: churnRateIsError,
    error: churnRateError,
  } = useQuery({
    queryKey: ["churnRate", data],
    queryFn: getChurnRateAPI,
    retry: false,
    enabled: !!data.startDate && !!data.endDate && !!data.inactivityDays,
  });

  return {
    churnRateRefetch,
    churnRateIsLoading,
    churnRateIsSuccess,
    churnRateData,
    churnRateIsError,
    churnRateError,
  };
}
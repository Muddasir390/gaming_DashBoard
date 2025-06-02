import { useQuery } from "@tanstack/react-query";
import { getLauncherAndZoaverseDetailsAPI } from "../api/acusition";

export function useGetLauncherAndZoaverseDetails(data) {
  const {
    refetch: launcherAndZoaverseDetailsRefetch,
    isLoading: launcherAndZoaverseDetailsIsLoading,
    isSuccess: launcherAndZoaverseDetailsIsSuccess,
    data: launcherAndZoaverseDetailsData,
    isError: launcherAndZoaverseDetailsIsError,
    error: launcherAndZoaverseDetailsError,
  } = useQuery({
    queryKey: ["launcherAndZoaverseDetails", data],
    queryFn: getLauncherAndZoaverseDetailsAPI,
    retry: false,
    enabled: !!data.startDate && !!data.endDate,
  });

  return {
    launcherAndZoaverseDetailsRefetch,
    launcherAndZoaverseDetailsIsLoading,
    launcherAndZoaverseDetailsIsSuccess,
    launcherAndZoaverseDetailsData,
    launcherAndZoaverseDetailsIsError,
    launcherAndZoaverseDetailsError,
  };
}
import { useQuery } from "@tanstack/react-query";
import { getLauncherInstallDetailsAPI } from "../api/acusition";

export function useGetlauncherInstallDetails(data) {
  const {
    refetch: launcherInstallDetailsRefetch,
    isLoading: launcherInstallDetailsIsLoading,
    isSuccess: launcherInstallDetailsIsSuccess,
    data: launcherInstallDetailsData,
    isError: launcherInstallDetailsIsError,
    error: launcherInstallDetailsError,
  } = useQuery({
    queryKey: ["launcherInstallDetails", data],
    queryFn: getLauncherInstallDetailsAPI,
    retry: false,
    enabled: !!data.startDate && !!data.endDate,
  });

  return {
    launcherInstallDetailsRefetch,
    launcherInstallDetailsIsLoading,
    launcherInstallDetailsIsSuccess,
    launcherInstallDetailsData,
    launcherInstallDetailsIsError,
    launcherInstallDetailsError,
  };
}
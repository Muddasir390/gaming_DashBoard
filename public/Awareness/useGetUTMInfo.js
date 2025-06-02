import { useQuery } from "@tanstack/react-query";
import { getLauncherAndZoaverseDetailsAPI } from "../api/acusition";
import { getUTMInfoAPI } from "../api/awareness";

export function useGetUTMInfo(data) {
  const {
    refetch: utmInfoRefetch,
    isLoading: utmInfoIsLoading,
    isSuccess: utmInfoIsSuccess,
    data: utmInfoData,
    isError: utmInfoIsError,
    error: utmInfoError,
  } = useQuery({
    queryKey: ["utmInfo", data],
    queryFn: getUTMInfoAPI,
    retry: false,
    enabled: !!data.startDate && !!data.endDate,
  });

  return {
    utmInfoRefetch,
    utmInfoIsLoading,
    utmInfoIsSuccess,
    utmInfoData,
    utmInfoIsError,
    utmInfoError,
  };
}
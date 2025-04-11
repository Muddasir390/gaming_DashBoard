import { useMutation } from '@tanstack/react-query';
import {userJourneyApi} from '../api/dashBoard'

export function useGetUserJourney() {

  const {
    mutate: userJourney,
    isPending: userJourneyLoading,
    data: userJourneyData,
    isError: userJourneyIsError,
    isSuccess: userJourneyIsSuccess,
  } = useMutation({
    mutationFn: userJourneyApi,
    retry: false,
  });

  return {
   userJourney,
   userJourneyLoading,
   userJourneyData,
   userJourneyIsError,
   userJourneyIsSuccess,
  };
}

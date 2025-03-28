import { useMutation } from '@tanstack/react-query';
import { roomInfoApi } from '../api/dashBoard';

export function getRoomInfo() {

  const {
    mutate: roomINfo,
    isPending: roomInfoLoading,
    data: roomInfoData,
    isSuccess: roomInfoIsSuccess,
  } = useMutation({
    mutationFn: roomInfoApi,
    retry: false,
  });

  return {
    roomINfo,
    roomInfoLoading,
    roomInfoData,
    roomInfoIsSuccess,
  };
}

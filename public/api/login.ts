import { apisEndpoint } from './apiurl';
import { httpWithoutAuth, httpWithAuth } from './http';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';




export const loginApi = async (payload: any) => {
    try {
      const response = httpWithoutAuth.post(apisEndpoint.loginURL, payload);
      const data = (await response).data;
      httpWithAuth.setAuthorizationHeader(data?.token);
      Cookies.set('token', data?.token, { expires: 100, secure: true });
      return data;
    } catch (error: any) {
      toast.error(error?.response?.data?.detail);
      throw error;
    }
  };